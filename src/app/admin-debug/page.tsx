'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDebugPage() {
  const [debug, setDebug] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      const supabase = createClient();

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      // Get session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      // Try to get admin record
      let adminData = null;
      let adminError = null;

      if (user) {
        const result = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', user.id)
          .single();

        adminData = result.data;
        adminError = result.error;
      }

      setDebug({
        user: user ? {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        } : null,
        userError: userError?.message,
        session: session ? {
          access_token: session.access_token ? 'EXISTS' : 'MISSING',
          refresh_token: session.refresh_token ? 'EXISTS' : 'MISSING',
          expires_at: session.expires_at,
        } : null,
        sessionError: sessionError?.message,
        adminData,
        adminError: adminError?.message,
      });

      setLoading(false);
    }

    checkStatus();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-white text-black p-8">Loading debug info...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Debug Info</h1>

        <div className="space-y-6">
          <div className="border rounded p-4">
            <h2 className="font-bold text-xl mb-2">Current User</h2>
            <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm">
              {JSON.stringify(debug.user, null, 2)}
            </pre>
            {debug.userError && (
              <div className="mt-2 text-red-600">Error: {debug.userError}</div>
            )}
          </div>

          <div className="border rounded p-4">
            <h2 className="font-bold text-xl mb-2">Session</h2>
            <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm">
              {JSON.stringify(debug.session, null, 2)}
            </pre>
            {debug.sessionError && (
              <div className="mt-2 text-red-600">Error: {debug.sessionError}</div>
            )}
          </div>

          <div className="border rounded p-4">
            <h2 className="font-bold text-xl mb-2">Admin Record</h2>
            <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm">
              {JSON.stringify(debug.adminData, null, 2)}
            </pre>
            {debug.adminError && (
              <div className="mt-2 text-red-600">Error: {debug.adminError}</div>
            )}
          </div>

          <div className="border rounded p-4 bg-yellow-50">
            <h2 className="font-bold text-xl mb-2">Expected Admin User ID</h2>
            <code className="bg-gray-100 p-2 rounded block">515860fb-6ab5-4115-bfa0-a3a3b83385d4</code>
            <div className="mt-2 text-sm">
              {debug.user?.id === '515860fb-6ab5-4115-bfa0-a3a3b83385d4' ? (
                <span className="text-green-600">✓ User ID matches!</span>
              ) : (
                <span className="text-red-600">✗ User ID does not match</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
