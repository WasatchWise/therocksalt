'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminCheckPage() {
  const [data, setData] = useState<any>({
    venues: { count: 0, items: [] },
    bands: { count: 0, items: [] },
    artists: { count: 0, items: [] },
    submissions: { count: 0, items: [] },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Fetch venues
      const { data: venues, count: venuesCount } = await supabase
        .from('venues')
        .select('*', { count: 'exact' });

      // Fetch bands
      const { data: bands, count: bandsCount } = await supabase
        .from('bands')
        .select('*', { count: 'exact' });

      // Fetch artists
      const { data: artists, count: artistsCount } = await supabase
        .from('artists')
        .select('*', { count: 'exact' });

      // Fetch event submissions
      const { data: submissions, count: submissionsCount } = await supabase
        .from('event_submissions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      setData({
        venues: { count: venuesCount || 0, items: venues || [] },
        bands: { count: bandsCount || 0, items: bands || [] },
        artists: { count: artistsCount || 0, items: artists || [] },
        submissions: { count: submissionsCount || 0, items: submissions || [] },
      });
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 bg-white text-black min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Database Check</h1>

      <div className="space-y-8">
        {/* Venues */}
        <div className="border p-4 rounded">
          <h2 className="text-2xl font-bold mb-4">📍 Venues ({data.venues.count})</h2>
          {data.venues.items.length > 0 ? (
            <div className="space-y-2">
              {data.venues.items.slice(0, 10).map((venue: any) => (
                <div key={venue.id} className="border-l-4 border-blue-500 pl-4">
                  <div className="font-semibold">{venue.name}</div>
                  <div className="text-sm text-gray-600">
                    ID: {venue.id} | Created: {new Date(venue.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
              {data.venues.count > 10 && (
                <div className="text-sm text-gray-500 mt-2">
                  ...and {data.venues.count - 10} more
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500">No venues found</div>
          )}
        </div>

        {/* Bands */}
        <div className="border p-4 rounded">
          <h2 className="text-2xl font-bold mb-4">🎸 Bands ({data.bands.count})</h2>
          {data.bands.items.length > 0 ? (
            <div className="space-y-2">
              {data.bands.items.slice(0, 10).map((band: any) => (
                <div key={band.id} className="border-l-4 border-green-500 pl-4">
                  <div className="font-semibold">{band.name}</div>
                  <div className="text-sm text-gray-600">
                    ID: {band.id} | Created: {new Date(band.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
              {data.bands.count > 10 && (
                <div className="text-sm text-gray-500 mt-2">
                  ...and {data.bands.count - 10} more
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500">No bands found</div>
          )}
        </div>

        {/* Artists */}
        <div className="border p-4 rounded">
          <h2 className="text-2xl font-bold mb-4">🎤 Artists ({data.artists.count})</h2>
          {data.artists.items.length > 0 ? (
            <div className="space-y-2">
              {data.artists.items.slice(0, 10).map((artist: any) => (
                <div key={artist.id} className="border-l-4 border-purple-500 pl-4">
                  <div className="font-semibold">{artist.name}</div>
                  <div className="text-sm text-gray-600">
                    ID: {artist.id} | Created: {new Date(artist.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
              {data.artists.count > 10 && (
                <div className="text-sm text-gray-500 mt-2">
                  ...and {data.artists.count - 10} more
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500">No artists found</div>
          )}
        </div>

        {/* Event Submissions */}
        <div className="border p-4 rounded">
          <h2 className="text-2xl font-bold mb-4">📅 Event Submissions ({data.submissions.count})</h2>
          {data.submissions.items.length > 0 ? (
            <div className="space-y-2">
              {data.submissions.items.map((submission: any) => (
                <div key={submission.id} className="border-l-4 border-orange-500 pl-4">
                  <div className="font-semibold">{submission.event_name}</div>
                  <div className="text-sm text-gray-600">
                    Venue: {submission.venue_name || 'N/A'} | Date: {submission.event_date}
                  </div>
                  <div className="text-sm text-gray-600">
                    Status: {submission.status} | Submitted: {new Date(submission.created_at).toLocaleString()}
                  </div>
                  {submission.submitter_email && (
                    <div className="text-sm text-gray-600">Email: {submission.submitter_email}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No event submissions found</div>
          )}
        </div>
      </div>
    </div>
  );
}
