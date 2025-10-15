'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminNav() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <nav className="bg-gray-800 text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex gap-6">
          <a href="/admin" className="hover:text-gray-300">Dashboard</a>
          <a href="/admin/venues" className="hover:text-gray-300">Venues</a>
          <a href="/admin/bands" className="hover:text-gray-300">Bands</a>
          <a href="/" className="hover:text-gray-300">View Site</a>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
