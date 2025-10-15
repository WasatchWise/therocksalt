import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login');
  }

  // Check if user is admin
  const { data: adminData, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (adminError || !adminData) {
    // User is authenticated but not an admin
    redirect('/');
  }

  return { user, admin: adminData };
}

export async function checkAdmin() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { isAdmin: false, user: null };
  }

  const { data: adminData } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    isAdmin: !!adminData,
    user,
    admin: adminData,
  };
}
