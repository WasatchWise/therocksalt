import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Checking database tables...\n');

  // Check venues
  const { data: venues, error: venuesError, count: venuesCount } = await supabase
    .from('venues')
    .select('*', { count: 'exact' });

  console.log('📍 VENUES:');
  console.log(`   Total count: ${venuesCount}`);
  if (venues && venues.length > 0) {
    console.log('   Sample venues:');
    venues.slice(0, 5).forEach((v: any) => {
      console.log(`   - ${v.name} (id: ${v.id})`);
    });
  }
  console.log('');

  // Check bands
  const { data: bands, error: bandsError, count: bandsCount } = await supabase
    .from('bands')
    .select('*', { count: 'exact' });

  console.log('🎸 BANDS:');
  console.log(`   Total count: ${bandsCount}`);
  if (bands && bands.length > 0) {
    console.log('   Sample bands:');
    bands.slice(0, 5).forEach((b: any) => {
      console.log(`   - ${b.name} (id: ${b.id})`);
    });
  }
  console.log('');

  // Check artists
  const { data: artists, error: artistsError, count: artistsCount } = await supabase
    .from('artists')
    .select('*', { count: 'exact' });

  console.log('🎤 ARTISTS:');
  console.log(`   Total count: ${artistsCount}`);
  if (artists && artists.length > 0) {
    console.log('   Sample artists:');
    artists.slice(0, 5).forEach((a: any) => {
      console.log(`   - ${a.name} (id: ${a.id})`);
    });
  }
  console.log('');

  // Check event submissions
  const { data: submissions, error: submissionsError, count: submissionsCount } = await supabase
    .from('event_submissions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  console.log('📅 EVENT SUBMISSIONS:');
  console.log(`   Total count: ${submissionsCount}`);
  if (submissions && submissions.length > 0) {
    console.log('   Recent submissions:');
    submissions.slice(0, 3).forEach((s: any) => {
      console.log(`   - ${s.event_name} at ${s.venue_name || 'Unknown venue'} (${s.event_date})`);
      console.log(`     Status: ${s.status}, Submitted: ${new Date(s.created_at).toLocaleString()}`);
    });
  }
  console.log('');

  // Check for any errors
  if (venuesError) console.error('Venues error:', venuesError);
  if (bandsError) console.error('Bands error:', bandsError);
  if (artistsError) console.error('Artists error:', artistsError);
  if (submissionsError) console.error('Submissions error:', submissionsError);
}

checkTables();
