'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import AdminNav from '@/components/AdminNav';

type EventSubmission = {
  id: string;
  event_name: string;
  organizer_name: string;
  organizer_email: string;
  organizer_phone: string | null;
  event_description: string;
  start_time: string;
  venue_name: string;
  venue_address: string | null;
  city: string;
  state: string;
  ticket_price: string | null;
  ticket_url: string | null;
  event_url: string | null;
  flyer_url: string | null;
  social_media_links: any;
  expected_attendance: string | null;
  additional_notes: string | null;
  status: 'pending' | 'reviewed' | 'approved' | 'declined';
  created_at: string;
};

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<EventSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  async function checkAdminStatus() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login?redirect=/admin');
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
  }

  useEffect(() => {
    if (isAdmin) {
      fetchSubmissions();
    }
  }, [filter, isAdmin]);

  async function fetchSubmissions() {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from('event_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching submissions:', error);
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: 'approved' | 'declined' | 'reviewed') {
    const supabase = createClient();
    const { error } = await supabase
      .from('event_submissions')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } else {
      fetchSubmissions();
    }
  }

  async function deleteSubmission(id: string) {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('event_submissions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting submission:', error);
      alert('Failed to delete submission');
    } else {
      fetchSubmissions();
    }
  }

  if (!isAdmin || loading) {
    return (
      <div className="min-h-screen bg-white text-black p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Loading...</h1>
        </div>
      </div>
    );
  }

  const filteredCount = submissions.length;

  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-white text-black p-8">
        <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Link href="/admin/venues" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Manage Venues
            </Link>
            <Link href="/admin/bands" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Manage Bands
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Event Submissions ({filteredCount})</h2>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded ${filter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('declined')}
              className={`px-4 py-2 rounded ${filter === 'declined' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            >
              Declined
            </button>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="text-gray-500">No submissions found</div>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <div key={submission.id} className="border rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{submission.event_name}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      Submitted: {new Date(submission.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        submission.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : submission.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : submission.status === 'declined'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {submission.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="font-semibold">Organizer</div>
                    <div>{submission.organizer_name}</div>
                    <div className="text-sm text-gray-600">{submission.organizer_email}</div>
                    {submission.organizer_phone && (
                      <div className="text-sm text-gray-600">{submission.organizer_phone}</div>
                    )}
                  </div>

                  <div>
                    <div className="font-semibold">Venue</div>
                    <div>{submission.venue_name}</div>
                    {submission.venue_address && (
                      <div className="text-sm text-gray-600">{submission.venue_address}</div>
                    )}
                    <div className="text-sm text-gray-600">
                      {submission.city}, {submission.state}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold">Date & Time</div>
                    <div>{new Date(submission.start_time).toLocaleString()}</div>
                  </div>

                  <div>
                    <div className="font-semibold">Ticket Price</div>
                    <div>{submission.ticket_price || 'Not specified'}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="font-semibold mb-1">Description</div>
                  <div className="text-gray-700">{submission.event_description}</div>
                </div>

                {submission.flyer_url && (
                  <div className="mb-4">
                    <div className="font-semibold mb-2">Flyer</div>
                    {submission.flyer_url.endsWith('.pdf') ? (
                      <a
                        href={submission.flyer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View PDF Flyer
                      </a>
                    ) : (
                      <img
                        src={submission.flyer_url}
                        alt="Event flyer"
                        className="max-w-md rounded border"
                      />
                    )}
                  </div>
                )}

                {submission.additional_notes && (
                  <div className="mb-4">
                    <div className="font-semibold mb-1">Additional Notes</div>
                    <div className="text-gray-700">{submission.additional_notes}</div>
                  </div>
                )}

                {submission.social_media_links && Object.keys(submission.social_media_links).length > 0 && (
                  <div className="mb-4">
                    <div className="font-semibold mb-1">Social Media</div>
                    <div className="flex gap-3 flex-wrap">
                      {Object.entries(submission.social_media_links).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {platform}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  {submission.status !== 'approved' && (
                    <button
                      onClick={() => updateStatus(submission.id, 'approved')}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                  )}
                  {submission.status !== 'declined' && (
                    <button
                      onClick={() => updateStatus(submission.id, 'declined')}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Decline
                    </button>
                  )}
                  {submission.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(submission.id, 'reviewed')}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Mark Reviewed
                    </button>
                  )}
                  <button
                    onClick={() => deleteSubmission(submission.id)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
