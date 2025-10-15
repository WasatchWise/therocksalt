-- ============================================================
-- FIX ADMIN POLICIES - Fix infinite recursion error
-- ============================================================
-- This fixes the infinite recursion issue in admin_users RLS policies

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read their own admin status" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

-- Simple policy: Authenticated users can read admin_users table
-- This allows checking admin status without recursion
CREATE POLICY "Authenticated users can read admin_users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (true);

-- Policy: Users can only insert/update/delete if they're already a super admin
-- Using a function with SECURITY DEFINER to avoid recursion
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now create insert/update/delete policies using the function
CREATE POLICY "Super admins can insert admin users"
ON public.admin_users
FOR INSERT
TO authenticated
WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admins can update admin users"
ON public.admin_users
FOR UPDATE
TO authenticated
USING (public.is_super_admin());

CREATE POLICY "Super admins can delete admin users"
ON public.admin_users
FOR DELETE
TO authenticated
USING (public.is_super_admin());
