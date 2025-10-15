'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import AdminNav from '@/components/AdminNav';

type Venue = {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
};

export default function VenuesManagement() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  async function checkAdminStatus() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login?redirect=/admin/venues');
      return;
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!adminData) {
      router.push('/');
      return;
    }

    setIsAdmin(true);
    fetchVenues();
  }

  async function fetchVenues() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching venues:', error);
    } else {
      setVenues(data || []);
    }
    setLoading(false);
  }

  async function deleteVenue(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const supabase = createClient();
    const { error } = await supabase.from('venues').delete().eq('id', id);

    if (error) {
      console.error('Error deleting venue:', error);
      alert('Failed to delete venue');
    } else {
      fetchVenues();
    }
  }

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin || loading) {
    return (
      <div className="min-h-screen bg-white text-black p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Venue Management</h1>
          <Link href="/admin" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Back to Admin
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search venues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <div className="text-lg font-semibold">
            Showing {filteredVenues.length} of {venues.length} venues
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVenues.map((venue) => (
            <div key={venue.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-bold mb-2">{venue.name}</h3>
              {venue.address && <div className="text-sm text-gray-600">{venue.address}</div>}
              <div className="text-sm text-gray-600">
                {venue.city && venue.state ? `${venue.city}, ${venue.state}` : venue.city || venue.state || ''}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Added: {new Date(venue.created_at).toLocaleDateString()}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditingVenue(venue)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteVenue(venue.id, venue.name)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {editingVenue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Edit Venue</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    value={editingVenue.name}
                    onChange={(e) => setEditingVenue({ ...editingVenue, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Address</label>
                  <input
                    type="text"
                    value={editingVenue.address || ''}
                    onChange={(e) => setEditingVenue({ ...editingVenue, address: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={editingVenue.city || ''}
                    onChange={(e) => setEditingVenue({ ...editingVenue, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">State</label>
                  <input
                    type="text"
                    value={editingVenue.state || ''}
                    onChange={(e) => setEditingVenue({ ...editingVenue, state: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={async () => {
                    const supabase = createClient();
                    const { error } = await supabase
                      .from('venues')
                      .update({
                        name: editingVenue.name,
                        address: editingVenue.address,
                        city: editingVenue.city,
                        state: editingVenue.state,
                      })
                      .eq('id', editingVenue.id);

                    if (error) {
                      console.error('Error updating venue:', error);
                      alert('Failed to update venue');
                    } else {
                      setEditingVenue(null);
                      fetchVenues();
                    }
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingVenue(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
