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
  created_at: string;
};

type BandMember = {
  band_id: string;
  musician_id: string;
  musician: {
    id: string;
    name: string;
    slug: string | null;
  };
  instrument: string | null;
  role: string | null;
  tenure_start: number | null;
  tenure_end: number | null;
};

export default function BandsManagement() {
  const [bands, setBands] = useState<Band[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBand, setSelectedBand] = useState<string | null>(null);
  const [bandMembers, setBandMembers] = useState<BandMember[]>([]);
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

  useEffect(() => {
    if (selectedBand) {
      fetchBandMembers(selectedBand);
    }
  }, [selectedBand]);

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

  const selectedBandData = bands.find((b) => b.id === selectedBand);

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
              {band.origin_city && band.state && (
                <div className="text-sm text-gray-600">
                  {band.origin_city}, {band.state}
                </div>
              )}
              {band.status && (
                <div className="text-sm text-gray-600">Status: {band.status}</div>
              )}
              <div className="text-xs text-gray-500 mt-2">
                Added: {new Date(band.created_at).toLocaleDateString()}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedBand(band.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  View Members
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

        {selectedBand && selectedBandData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{selectedBandData.name} - Band Members</h2>
                <button
                  onClick={() => setSelectedBand(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {bandMembers.length === 0 ? (
                <div className="text-gray-500">No band members found</div>
              ) : (
                <div className="space-y-3">
                  {bandMembers.map((member) => {
                    // Check if musician appears in other bands
                    const musicianName = member.musician?.name || 'Unknown';

                    return (
                      <div key={member.musician_id} className="border rounded p-4">
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
                        <Link
                          href={`/admin/musicians/${member.musician_id}`}
                          className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                        >
                          View all projects for {musicianName} →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={() => setSelectedBand(null)}
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
