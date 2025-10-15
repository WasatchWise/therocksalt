'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import AdminNav from '@/components/AdminNav';

type Band = {
  id: string;
  name: string;
  slug: string | null;
  origin_city: string | null;
  state: string | null;
  status: string | null;
  bio: string | null;
  description: string | null;
  formed_year: number | null;
  disbanded_year: number | null;
  genre: string | null;
  social_media_links: any;
  website: string | null;
  email: string | null;
  phone: string | null;
  claimed_by: string | null;
  claimed_at: string | null;
  image_url: string | null;
  banner_url: string | null;
  created_at: string;
};

type BandMember = {
  id: string;
  band_id: string;
  musician_id: string | null;
  musician: {
    id: string;
    name: string;
    slug: string | null;
  } | null;
  instrument: string | null;
  role: string | null;
  tenure_start: number | null;
  tenure_end: number | null;
};

export default function BandsManagement() {
  const [bands, setBands] = useState<Band[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBand, setEditingBand] = useState<Band | null>(null);
  const [selectedBandForMembers, setSelectedBandForMembers] = useState<string | null>(null);
  const [bandMembers, setBandMembers] = useState<BandMember[]>([]);
  const [editingMember, setEditingMember] = useState<BandMember | null>(null);
  const [addingMember, setAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  async function checkAdminStatus() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login?redirect=/admin/bands');
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
    fetchBands();
  }

  async function fetchBands() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bands')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching bands:', error);
    } else {
      setBands(data || []);
    }
    setLoading(false);
  }

  async function fetchBandMembers(bandId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('band_members')
      .select(`
        *,
        musician:musicians(id, name, slug)
      `)
      .eq('band_id', bandId);

    if (error) {
      console.error('Error fetching band members:', error);
    } else {
      setBandMembers(data || []);
    }
  }

  async function saveBand() {
    if (!editingBand) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('bands')
      .update({
        name: editingBand.name,
        slug: editingBand.slug,
        origin_city: editingBand.origin_city,
        state: editingBand.state,
        status: editingBand.status,
        bio: editingBand.bio,
        description: editingBand.description,
        formed_year: editingBand.formed_year,
        disbanded_year: editingBand.disbanded_year,
        genre: editingBand.genre,
        social_media_links: editingBand.social_media_links,
        website: editingBand.website,
        email: editingBand.email,
        phone: editingBand.phone,
        image_url: editingBand.image_url,
        banner_url: editingBand.banner_url,
      })
      .eq('id', editingBand.id);

    if (error) {
      console.error('Error updating band:', error);
      alert('Failed to update band');
    } else {
      setEditingBand(null);
      fetchBands();
    }
  }

  async function deleteBand(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const supabase = createClient();
    const { error } = await supabase.from('bands').delete().eq('id', id);

    if (error) {
      console.error('Error deleting band:', error);
      alert('Failed to delete band');
    } else {
      fetchBands();
    }
  }

  async function addBandMember() {
    if (!selectedBandForMembers || !newMemberName.trim()) return;

    const supabase = createClient();

    // First, create or find the musician
    let musicianId = null;
    const { data: existingMusician } = await supabase
      .from('musicians')
      .select('id')
      .ilike('name', newMemberName.trim())
      .single();

    if (existingMusician) {
      musicianId = existingMusician.id;
    } else {
      // Create new musician
      const { data: newMusician, error: musicianError } = await supabase
        .from('musicians')
        .insert({
          name: newMemberName.trim(),
          slug: newMemberName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        })
        .select()
        .single();

      if (musicianError) {
        console.error('Error creating musician:', musicianError);
        alert('Failed to create musician');
        return;
      }
      musicianId = newMusician.id;
    }

    // Now add them to the band
    const { error } = await supabase
      .from('band_members')
      .insert({
        band_id: selectedBandForMembers,
        musician_id: musicianId,
        instrument: editingMember?.instrument || null,
        role: editingMember?.role || null,
        tenure_start: editingMember?.tenure_start || null,
        tenure_end: editingMember?.tenure_end || null,
      });

    if (error) {
      console.error('Error adding band member:', error);
      alert('Failed to add band member');
    } else {
      setAddingMember(false);
      setNewMemberName('');
      setEditingMember(null);
      fetchBandMembers(selectedBandForMembers);
    }
  }

  async function saveBandMember() {
    if (!editingMember || !editingMember.id) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('band_members')
      .update({
        instrument: editingMember.instrument,
        role: editingMember.role,
        tenure_start: editingMember.tenure_start,
        tenure_end: editingMember.tenure_end,
      })
      .eq('id', editingMember.id);

    if (error) {
      console.error('Error updating band member:', error);
      alert('Failed to update band member');
    } else {
      setEditingMember(null);
      if (selectedBandForMembers) {
        fetchBandMembers(selectedBandForMembers);
      }
    }
  }

  async function deleteBandMember(id: string, name: string) {
    if (!confirm(`Are you sure you want to remove ${name} from this band?`)) return;

    const supabase = createClient();
    const { error } = await supabase.from('band_members').delete().eq('id', id);

    if (error) {
      console.error('Error deleting band member:', error);
      alert('Failed to remove band member');
    } else {
      if (selectedBandForMembers) {
        fetchBandMembers(selectedBandForMembers);
      }
    }
  }

  useEffect(() => {
    if (selectedBandForMembers) {
      fetchBandMembers(selectedBandForMembers);
    }
  }, [selectedBandForMembers]);

  const filteredBands = bands.filter((band) =>
    band.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const selectedBandData = bands.find((b) => b.id === selectedBandForMembers);

  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Band Management</h1>
          <Link href="/admin" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Back to Admin
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search bands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <div className="text-lg font-semibold">
            Showing {filteredBands.length} of {bands.length} bands
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBands.map((band) => (
            <div key={band.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-bold mb-2">{band.name}</h3>
              {band.genre && (
                <div className="text-xs font-semibold text-indigo-600 mb-2">{band.genre.toUpperCase()}</div>
              )}
              {band.origin_city && band.state && (
                <div className="text-sm text-gray-600">
                  {band.origin_city}, {band.state}
                </div>
              )}
              {band.formed_year && (
                <div className="text-sm text-gray-600">
                  Formed: {band.formed_year}{band.disbanded_year ? ` - ${band.disbanded_year}` : ' - Present'}
                </div>
              )}
              {band.status && (
                <div className="text-sm text-gray-600">Status: {band.status}</div>
              )}
              {band.claimed_by && (
                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-2 inline-block">
                  ✓ Claimed
                </div>
              )}
              <div className="text-xs text-gray-500 mt-2">
                Added: {new Date(band.created_at).toLocaleDateString()}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditingBand(band)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Edit Band
                </button>
                <button
                  onClick={() => setSelectedBandForMembers(band.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  Members
                </button>
                <button
                  onClick={() => deleteBand(band.id, band.name)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Band Modal */}
        {editingBand && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full my-8">
              <h2 className="text-2xl font-bold mb-4">Edit Band: {editingBand.name}</h2>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {/* Basic Info */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Name *</label>
                      <input
                        type="text"
                        value={editingBand.name}
                        onChange={(e) => setEditingBand({ ...editingBand, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Slug</label>
                      <input
                        type="text"
                        value={editingBand.slug || ''}
                        onChange={(e) => setEditingBand({ ...editingBand, slug: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="band-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Genre</label>
                      <input
                        type="text"
                        value={editingBand.genre || ''}
                        onChange={(e) => setEditingBand({ ...editingBand, genre: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Rock, Metal, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Status</label>
                      <select
                        value={editingBand.status || ''}
                        onChange={(e) => setEditingBand({ ...editingBand, status: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                      >
                        <option value="">Select status...</option>
                        <option value="active">Active</option>
                        <option value="on_hiatus">On Hiatus</option>
                        <option value="disbanded">Disbanded</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Formed Year</label>
                      <input
                        type="number"
                        value={editingBand.formed_year || ''}
                        onChange={(e) => setEditingBand({ ...editingBand, formed_year: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="1990"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Disbanded Year</label>
                      <input
                        type="number"
                        value={editingBand.disbanded_year || ''}
                        onChange={(e) => setEditingBand({ ...editingBand, disbanded_year: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="2000"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-3">Origin</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">City</label>
                      <input
                        type="text"
                        value={editingBand.origin_city || ''}
                        onChange={(e) => setEditingBand({ ...editingBand, origin_city: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">State</label>
                      <input
                        type="text"
                        value={editingBand.state || ''}
                        onChange={(e) => setEditingBand({ ...editingBand, state: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="UT"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio & Description */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-3">Bio & Description</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Short Bio</label>
                      <textarea
                        value={editingBand.bio || ''}
                        onChange={(e) => setEditingBand({ ...editingBand, bio: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        rows={2}
                        placeholder="Short band description..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Full Description</label>
                      <textarea
                        value={editingBand.description || ''}
                        onChange={(e) => setEditingBand({ ...editingBand, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        rows={4}
                        placeholder="Band history, achievements, etc..."
                      />
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
                        value={editingBand.phone || ''}
                        onChange={(e) => setEditingBand({ ...editingBand, phone: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Email</label>
                      <input
                        type="email"
                        value={editingBand.email || ''}
                        onChange={(e) => setEditingBand({ ...editingBand, email: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-1">Website</label>
                      <input
                        type="url"
                        value={editingBand.website || ''}
                        onChange={(e) => setEditingBand({ ...editingBand, website: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-3">Images</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Band Photo URL</label>
                      <input
                        type="url"
                        value={editingBand.image_url || ''}
                        onChange={(e) => setEditingBand({ ...editingBand, image_url: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Banner Image URL</label>
                      <input
                        type="url"
                        value={editingBand.banner_url || ''}
                        onChange={(e) => setEditingBand({ ...editingBand, banner_url: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
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
                        value={editingBand.social_media_links?.facebook || ''}
                        onChange={(e) => setEditingBand({
                          ...editingBand,
                          social_media_links: { ...editingBand.social_media_links, facebook: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Instagram</label>
                      <input
                        type="url"
                        value={editingBand.social_media_links?.instagram || ''}
                        onChange={(e) => setEditingBand({
                          ...editingBand,
                          social_media_links: { ...editingBand.social_media_links, instagram: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Twitter</label>
                      <input
                        type="url"
                        value={editingBand.social_media_links?.twitter || ''}
                        onChange={(e) => setEditingBand({
                          ...editingBand,
                          social_media_links: { ...editingBand.social_media_links, twitter: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Spotify</label>
                      <input
                        type="url"
                        value={editingBand.social_media_links?.spotify || ''}
                        onChange={(e) => setEditingBand({
                          ...editingBand,
                          social_media_links: { ...editingBand.social_media_links, spotify: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Bandcamp</label>
                      <input
                        type="url"
                        value={editingBand.social_media_links?.bandcamp || ''}
                        onChange={(e) => setEditingBand({
                          ...editingBand,
                          social_media_links: { ...editingBand.social_media_links, bandcamp: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Claiming Status */}
                {editingBand.claimed_by && (
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <div className="font-semibold text-green-800">Claimed Band</div>
                    <div className="text-sm text-green-700 mt-1">
                      This band has been claimed on {editingBand.claimed_at ? new Date(editingBand.claimed_at).toLocaleDateString() : 'an unknown date'}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-6 pt-4 border-t">
                <button
                  onClick={saveBand}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingBand(null)}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Band Members Modal */}
        {selectedBandForMembers && selectedBandData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedBandData.name} - Band Members</h2>
                <button
                  onClick={() => {
                    setSelectedBandForMembers(null);
                    setAddingMember(false);
                    setEditingMember(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {bandMembers.length === 0 ? (
                <div className="text-gray-500 mb-4">No band members found</div>
              ) : (
                <div className="space-y-3 mb-4">
                  {bandMembers.map((member) => {
                    const musicianName = member.musician?.name || 'Unknown';
                    const isEditing = editingMember?.id === member.id;

                    return (
                      <div key={member.id} className="border rounded p-4">
                        {isEditing ? (
                          <div className="space-y-3">
                            <div className="font-semibold">{musicianName}</div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-semibold mb-1">Instrument</label>
                                <input
                                  type="text"
                                  value={editingMember.instrument || ''}
                                  onChange={(e) => setEditingMember({ ...editingMember, instrument: e.target.value })}
                                  className="w-full px-2 py-1 border rounded text-sm"
                                  placeholder="Guitar, Drums, etc."
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold mb-1">Role</label>
                                <input
                                  type="text"
                                  value={editingMember.role || ''}
                                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                                  className="w-full px-2 py-1 border rounded text-sm"
                                  placeholder="Lead, Rhythm, etc."
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold mb-1">Tenure Start</label>
                                <input
                                  type="number"
                                  value={editingMember.tenure_start || ''}
                                  onChange={(e) => setEditingMember({ ...editingMember, tenure_start: e.target.value ? parseInt(e.target.value) : null })}
                                  className="w-full px-2 py-1 border rounded text-sm"
                                  placeholder="1990"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold mb-1">Tenure End</label>
                                <input
                                  type="number"
                                  value={editingMember.tenure_end || ''}
                                  onChange={(e) => setEditingMember({ ...editingMember, tenure_end: e.target.value ? parseInt(e.target.value) : null })}
                                  className="w-full px-2 py-1 border rounded text-sm"
                                  placeholder="2000"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={saveBandMember}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingMember(null)}
                                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="font-semibold">{musicianName}</div>
                            {member.instrument && (
                              <div className="text-sm text-gray-600">Instrument: {member.instrument}</div>
                            )}
                            {member.role && (
                              <div className="text-sm text-gray-600">Role: {member.role}</div>
                            )}
                            {(member.tenure_start || member.tenure_end) && (
                              <div className="text-sm text-gray-600">
                                Tenure: {member.tenure_start || '?'} - {member.tenure_end || 'present'}
                              </div>
                            )}
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => setEditingMember(member)}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteBandMember(member.id, musicianName)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add Member Form */}
              {addingMember ? (
                <div className="border rounded p-4 bg-blue-50">
                  <h3 className="font-semibold mb-3">Add Band Member</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Musician Name *</label>
                      <input
                        type="text"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-semibold mb-1">Instrument</label>
                        <input
                          type="text"
                          value={editingMember?.instrument || ''}
                          onChange={(e) => setEditingMember({ ...editingMember!, instrument: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="Guitar"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Role</label>
                        <input
                          type="text"
                          value={editingMember?.role || ''}
                          onChange={(e) => setEditingMember({ ...editingMember!, role: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="Lead"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Tenure Start</label>
                        <input
                          type="number"
                          value={editingMember?.tenure_start || ''}
                          onChange={(e) => setEditingMember({ ...editingMember!, tenure_start: e.target.value ? parseInt(e.target.value) : null })}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="1990"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Tenure End</label>
                        <input
                          type="number"
                          value={editingMember?.tenure_end || ''}
                          onChange={(e) => setEditingMember({ ...editingMember!, tenure_end: e.target.value ? parseInt(e.target.value) : null })}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="2000 (leave empty if current)"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={addBandMember}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Add Member
                    </button>
                    <button
                      onClick={() => {
                        setAddingMember(false);
                        setNewMemberName('');
                        setEditingMember(null);
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAddingMember(true);
                    setEditingMember({} as BandMember);
                  }}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-semibold"
                >
                  + Add Band Member
                </button>
              )}

              <div className="mt-6">
                <button
                  onClick={() => {
                    setSelectedBandForMembers(null);
                    setAddingMember(false);
                    setEditingMember(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Close
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
