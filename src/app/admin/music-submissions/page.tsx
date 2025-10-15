'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import AdminNav from '@/components/AdminNav';

type MusicSubmission = {
  id: string;
  band_name: string;
  contact_name: string;
  contact_email: string;
  hometown: string;
  links: {
    band_photo?: string;
    music_file?: string;
    song_title?: string;
    song_description?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
    spotify?: string;
    bandcamp?: string;
    tiktok?: string;
    streaming_links?: string[];
  };
  notes?: string;
  genre_preferences: string[];
  status: 'pending' | 'reviewed' | 'accepted' | 'declined';
  admin_feedback?: string;
  created_at: string;
  updated_at?: string;
};

export default function MusicSubmissionsAdmin() {
  const [submissions, setSubmissions] = useState<MusicSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'accepted' | 'declined'>('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());
  const [feedbackModal, setFeedbackModal] = useState<{ submissionId: string; feedback: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  async function checkAdminStatus() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login?redirect=/admin/music-submissions');
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
      .from('music_submissions')
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

  async function updateStatus(id: string, newStatus: 'accepted' | 'declined' | 'reviewed', feedback?: string) {
    const supabase = createClient();

    const updateData: any = {
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    if (feedback) {
      updateData.admin_feedback = feedback;
    }

    const { error } = await supabase
      .from('music_submissions')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } else {
      // TODO: Send email to contact_email with status update and feedback
      fetchSubmissions();
      setSelectedSubmissions(new Set());
    }
  }

  async function bulkUpdateStatus(newStatus: 'accepted' | 'declined' | 'reviewed') {
    if (selectedSubmissions.size === 0) {
      alert('Please select at least one submission');
      return;
    }

    if (!confirm(`Are you sure you want to mark ${selectedSubmissions.size} submission(s) as ${newStatus}?`)) {
      return;
    }

    const supabase = createClient();
    const updateData = {
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('music_submissions')
      .update(updateData)
      .in('id', Array.from(selectedSubmissions));

    if (error) {
      console.error('Error bulk updating:', error);
      alert('Failed to bulk update');
    } else {
      fetchSubmissions();
      setSelectedSubmissions(new Set());
    }
  }

  async function deleteSubmission(id: string) {
    if (!confirm('Are you sure you want to delete this submission? This cannot be undone.')) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('music_submissions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting submission:', error);
      alert('Failed to delete submission');
    } else {
      fetchSubmissions();
    }
  }

  function toggleSelection(id: string) {
    const newSelection = new Set(selectedSubmissions);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedSubmissions(newSelection);
  }

  function selectAll() {
    if (selectedSubmissions.size === submissions.length) {
      setSelectedSubmissions(new Set());
    } else {
      setSelectedSubmissions(new Set(submissions.map(s => s.id)));
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
  const pendingCount = submissions.filter(s => s.status === 'pending').length;

  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-white text-black p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Music Submissions</h1>
              <p className="text-gray-600 mt-1">{pendingCount} pending review</p>
            </div>
            <Link href="/admin" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              Back to Admin
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="flex gap-2 mb-4 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
              >
                All ({submissions.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
              >
                Pending ({submissions.filter(s => s.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('reviewed')}
                className={`px-4 py-2 rounded ${filter === 'reviewed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Reviewed ({submissions.filter(s => s.status === 'reviewed').length})
              </button>
              <button
                onClick={() => setFilter('accepted')}
                className={`px-4 py-2 rounded ${filter === 'accepted' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              >
                Accepted ({submissions.filter(s => s.status === 'accepted').length})
              </button>
              <button
                onClick={() => setFilter('declined')}
                className={`px-4 py-2 rounded ${filter === 'declined' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
              >
                Declined ({submissions.filter(s => s.status === 'declined').length})
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedSubmissions.size > 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <span className="font-semibold">
                {selectedSubmissions.size} submission{selectedSubmissions.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => bulkUpdateStatus('reviewed')}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Mark Reviewed
                </button>
                <button
                  onClick={() => bulkUpdateStatus('accepted')}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  Bulk Accept
                </button>
                <button
                  onClick={() => bulkUpdateStatus('declined')}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Bulk Decline
                </button>
                <button
                  onClick={() => setSelectedSubmissions(new Set())}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Select All Checkbox */}
          {submissions.length > 0 && (
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSubmissions.size === submissions.length && submissions.length > 0}
                  onChange={selectAll}
                  className="w-4 h-4"
                />
                Select all {filteredCount} submission{filteredCount !== 1 ? 's' : ''}
              </label>
            </div>
          )}

          {/* Submissions List */}
          {submissions.length === 0 ? (
            <div className="text-gray-500 text-center py-12">
              No {filter !== 'all' ? filter : ''} submissions found
            </div>
          ) : (
            <div className="space-y-6">
              {submissions.map((submission) => (
                <div key={submission.id} className="border rounded-lg p-6 shadow-sm bg-white">
                  {/* Header with Checkbox */}
                  <div className="flex items-start gap-4 mb-4">
                    <input
                      type="checkbox"
                      checked={selectedSubmissions.has(submission.id)}
                      onChange={() => toggleSelection(submission.id)}
                      className="mt-1 w-5 h-5 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold">{submission.band_name}</h3>
                          <div className="text-sm text-gray-600 mt-1">
                            Submitted: {new Date(submission.created_at).toLocaleString()}
                          </div>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {submission.genre_preferences.map((genre, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-semibold"
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded text-sm font-semibold ${
                            submission.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : submission.status === 'reviewed'
                              ? 'bg-blue-100 text-blue-800'
                              : submission.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {submission.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ml-9">
                    {/* Contact Info */}
                    <div>
                      <div className="font-semibold">Contact</div>
                      <div>{submission.contact_name}</div>
                      <div className="text-sm text-gray-600">{submission.contact_email}</div>
                    </div>

                    {/* Location */}
                    <div>
                      <div className="font-semibold">Location</div>
                      <div>{submission.hometown}</div>
                    </div>

                    {/* Band Photo */}
                    {submission.links.band_photo && (
                      <div>
                        <div className="font-semibold mb-2">Band Photo</div>
                        <img
                          src={submission.links.band_photo}
                          alt={`${submission.band_name} photo`}
                          className="max-w-xs rounded border"
                        />
                      </div>
                    )}

                    {/* Music File */}
                    {submission.links.music_file && (
                      <div>
                        <div className="font-semibold mb-2">Music Sample</div>
                        {submission.links.song_title && (
                          <div className="text-sm mb-1">
                            <strong>Title:</strong> {submission.links.song_title}
                          </div>
                        )}
                        <audio controls className="w-full max-w-md">
                          <source src={submission.links.music_file} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                        {submission.links.song_description && (
                          <div className="text-sm text-gray-600 mt-2">
                            {submission.links.song_description}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Notes Section */}
                  {submission.notes && (
                    <div className="mb-4 ml-9">
                      <div className="font-semibold mb-1">Submission Details</div>
                      <div className="text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded">
                        {submission.notes}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  {(submission.links.website ||
                    submission.links.instagram ||
                    submission.links.facebook ||
                    submission.links.spotify ||
                    submission.links.bandcamp ||
                    submission.links.tiktok) && (
                    <div className="mb-4 ml-9">
                      <div className="font-semibold mb-2">Social & Streaming Links</div>
                      <div className="flex gap-3 flex-wrap">
                        {submission.links.website && (
                          <a
                            href={submission.links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Website
                          </a>
                        )}
                        {submission.links.instagram && (
                          <a
                            href={submission.links.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Instagram
                          </a>
                        )}
                        {submission.links.facebook && (
                          <a
                            href={submission.links.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Facebook
                          </a>
                        )}
                        {submission.links.spotify && (
                          <a
                            href={submission.links.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Spotify
                          </a>
                        )}
                        {submission.links.bandcamp && (
                          <a
                            href={submission.links.bandcamp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Bandcamp
                          </a>
                        )}
                        {submission.links.tiktok && (
                          <a
                            href={submission.links.tiktok}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            TikTok
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Admin Feedback */}
                  {submission.admin_feedback && (
                    <div className="mb-4 ml-9 bg-yellow-50 border border-yellow-200 p-3 rounded">
                      <div className="font-semibold mb-1 text-yellow-900">Admin Feedback</div>
                      <div className="text-yellow-800 text-sm">{submission.admin_feedback}</div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t ml-9">
                    {submission.status !== 'accepted' && (
                      <button
                        onClick={() => updateStatus(submission.id, 'accepted')}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Accept
                      </button>
                    )}
                    {submission.status !== 'declined' && (
                      <button
                        onClick={() => setFeedbackModal({ submissionId: submission.id, feedback: submission.admin_feedback || '' })}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Decline with Feedback
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

      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Decline with Feedback</h2>
            <p className="text-sm text-gray-600 mb-4">
              This feedback will be sent to the artist to help them improve their submission.
            </p>
            <textarea
              value={feedbackModal.feedback}
              onChange={(e) => setFeedbackModal({ ...feedbackModal, feedback: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-4"
              rows={6}
              placeholder="Let them know what needs improvement: better audio quality, more complete bio, missing genre fit, etc."
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  updateStatus(feedbackModal.submissionId, 'declined', feedbackModal.feedback);
                  setFeedbackModal(null);
                }}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
              >
                Send Feedback & Decline
              </button>
              <button
                onClick={() => setFeedbackModal(null)}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
