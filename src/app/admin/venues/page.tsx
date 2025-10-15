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
  phone: string | null;
  email: string | null;
  website: string | null;
  description: string | null;
  capacity: number | null;
  venue_type: string | null;
  social_media_links: any;
  claimed_by: string | null;
  claimed_at: string | null;
  image_url: string | null;
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

  async function saveVenue() {
    if (!editingVenue) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('venues')
      .update({
        name: editingVenue.name,
        address: editingVenue.address,
        city: editingVenue.city,
        state: editingVenue.state,
        phone: editingVenue.phone,
        email: editingVenue.email,
        website: editingVenue.website,
        description: editingVenue.description,
        capacity: editingVenue.capacity,
        venue_type: editingVenue.venue_type,
        social_media_links: editingVenue.social_media_links,
        image_url: editingVenue.image_url,
      })
      .eq('id', editingVenue.id);

    if (error) {
      console.error('Error updating venue:', error);
      alert('Failed to update venue');
    } else {
      setEditingVenue(null);
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
              {venue.venue_type && (
                <div className="text-xs font-semibold text-indigo-600 mb-2">{venue.venue_type.toUpperCase()}</div>
              )}
              {venue.address && <div className="text-sm text-gray-600">{venue.address}</div>}
              <div className="text-sm text-gray-600">
                {venue.city && venue.state ? `${venue.city}, ${venue.state}` : venue.city || venue.state || ''}
              </div>
              {venue.capacity && (
                <div className="text-sm text-gray-600 mt-1">Capacity: {venue.capacity}</div>
              )}
              {venue.claimed_by && (
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-2 inline-block">
                  ✓ Claimed
                </div>
              )}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full my-8">
              <h2 className="text-2xl font-bold mb-4">Edit Venue: {editingVenue.name}</h2>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {/* Basic Info */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Name *</label>
                      <input
                        type="text"
                        value={editingVenue.name}
                        onChange={(e) => setEditingVenue({ ...editingVenue, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Venue Type</label>
                      <select
                        value={editingVenue.venue_type || ''}
                        onChange={(e) => setEditingVenue({ ...editingVenue, venue_type: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                      >
                        <option value="">Select type...</option>
                        <option value="bar">Bar</option>
                        <option value="club">Club</option>
                        <option value="theater">Theater</option>
                        <option value="concert_hall">Concert Hall</option>
                        <option value="outdoor">Outdoor Venue</option>
                        <option value="arena">Arena</option>
                        <option value="cafe">Cafe</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Capacity</label>
                      <input
                        type="number"
                        value={editingVenue.capacity || ''}
                        onChange={(e) => setEditingVenue({ ...editingVenue, capacity: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="e.g. 500"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-3">Location</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Address</label>
                      <input
                        type="text"
                        value={editingVenue.address || ''}
                        onChange={(e) => setEditingVenue({ ...editingVenue, address: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
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
                          placeholder="UT"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Phone</label>
                      <input
                        type="tel"
                        value={editingVenue.phone || ''}
                        onChange={(e) => setEditingVenue({ ...editingVenue, phone: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="(801) 555-1234"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Email</label>
                      <input
                        type="email"
                        value={editingVenue.email || ''}
                        onChange={(e) => setEditingVenue({ ...editingVenue, email: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="info@venue.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-1">Website</label>
                      <input
                        type="url"
                        value={editingVenue.website || ''}
                        onChange={(e) => setEditingVenue({ ...editingVenue, website: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="https://venue.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-3">Description</h3>
                  <textarea
                    value={editingVenue.description || ''}
                    onChange={(e) => setEditingVenue({ ...editingVenue, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    rows={4}
                    placeholder="Tell us about this venue..."
                  />
                </div>

                {/* Image */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-3">Image</h3>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Image URL</label>
                    <input
                      type="url"
                      value={editingVenue.image_url || ''}
                      onChange={(e) => setEditingVenue({ ...editingVenue, image_url: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                      placeholder="https://example.com/venue-photo.jpg"
                    />
                  </div>
                </div>

                {/* Social Media */}
                <div className="pb-4">
                  <h3 className="font-semibold text-lg mb-3">Social Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Facebook</label>
                      <input
                        type="url"
                        value={editingVenue.social_media_links?.facebook || ''}
                        onChange={(e) => setEditingVenue({
                          ...editingVenue,
                          social_media_links: { ...editingVenue.social_media_links, facebook: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="https://facebook.com/venue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Instagram</label>
                      <input
                        type="url"
                        value={editingVenue.social_media_links?.instagram || ''}
                        onChange={(e) => setEditingVenue({
                          ...editingVenue,
                          social_media_links: { ...editingVenue.social_media_links, instagram: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="https://instagram.com/venue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Twitter</label>
                      <input
                        type="url"
                        value={editingVenue.social_media_links?.twitter || ''}
                        onChange={(e) => setEditingVenue({
                          ...editingVenue,
                          social_media_links: { ...editingVenue.social_media_links, twitter: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="https://twitter.com/venue"
                      />
                    </div>
                  </div>
                </div>

                {/* Claiming Status */}
                {editingVenue.claimed_by && (
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <div className="font-semibold text-green-800">Claimed Venue</div>
                    <div className="text-sm text-green-700 mt-1">
                      This venue has been claimed on {editingVenue.claimed_at ? new Date(editingVenue.claimed_at).toLocaleDateString() : 'an unknown date'}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-6 pt-4 border-t">
                <button
                  onClick={saveVenue}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingVenue(null)}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
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
