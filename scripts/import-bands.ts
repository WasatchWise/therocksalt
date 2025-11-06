import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ImportStats {
  bands: { success: number; failed: number; skipped: number };
  musicians: { success: number; failed: number; skipped: number };
  band_members: { success: number; failed: number; skipped: number };
  genres: { success: number; failed: number; skipped: number };
  band_genres: { success: number; failed: number; skipped: number };
  releases: { success: number; failed: number; skipped: number };
  venues: { success: number; failed: number; skipped: number };
  events: { success: number; failed: number; skipped: number };
  event_bands: { success: number; failed: number; skipped: number };
  articles: { success: number; failed: number; skipped: number };
  rock_facts: { success: number; failed: number; skipped: number };
  errors: Array<{ entity: string; error: string; data?: any }>;
}

const stats: ImportStats = {
  bands: { success: 0, failed: 0, skipped: 0 },
  musicians: { success: 0, failed: 0, skipped: 0 },
  band_members: { success: 0, failed: 0, skipped: 0 },
  genres: { success: 0, failed: 0, skipped: 0 },
  band_genres: { success: 0, failed: 0, skipped: 0 },
  releases: { success: 0, failed: 0, skipped: 0 },
  venues: { success: 0, failed: 0, skipped: 0 },
  events: { success: 0, failed: 0, skipped: 0 },
  event_bands: { success: 0, failed: 0, skipped: 0 },
  articles: { success: 0, failed: 0, skipped: 0 },
  rock_facts: { success: 0, failed: 0, skipped: 0 },
  errors: [],
};

// Slug to UUID mappings
const slugToId = {
  bands: new Map<string, string>(),
  musicians: new Map<string, string>(),
  genres: new Map<string, string>(),
  venues: new Map<string, string>(),
  events: new Map<string, string>(),
};

// Data normalization helpers
function normalizeState(state: string | null): string | null {
  if (!state) return null;
  const stateMap: Record<string, string> = {
    'Utah': 'UT',
    'utah': 'UT',
    'California': 'CA',
    'New York': 'NY',
  };
  return stateMap[state] || state;
}

function validateDate(dateStr: string | null): string | null {
  if (!dateStr) return null;

  // Fix invalid dates like "2009-02-30"
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = parseInt(match[1]);
    const month = parseInt(match[2]);
    let day = parseInt(match[3]);

    // Check if date is valid
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) {
      console.warn(`⚠️  Invalid date ${dateStr} - setting to last day of month`);
      day = daysInMonth;
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  return dateStr;
}

function normalizeStatus(status: string | null): string | null {
  if (!status) return null;
  const validStatuses = ['active', 'hiatus', 'dissolved', 'reunited'];
  return validStatuses.includes(status) ? status : null;
}

// Import functions
async function importGenres(data: any[]): Promise<void> {
  console.log('\n📦 Importing Genres...');

  // Deduplicate genres by name
  const uniqueGenres = new Map<string, any>();

  for (const item of data) {
    if (item.genres) {
      for (const genre of item.genres) {
        const genreName = typeof genre === 'string' ? genre : genre.name;
        if (!uniqueGenres.has(genreName)) {
          uniqueGenres.set(genreName, {
            name: genreName,
            description: typeof genre === 'object' ? genre.description : null,
          });
        }
      }
    }

    if (item.band_genres) {
      for (const bg of item.band_genres) {
        const genreName = bg.genre_name;
        if (genreName && !uniqueGenres.has(genreName)) {
          uniqueGenres.set(genreName, { name: genreName, description: null });
        }
      }
    }
  }

  for (const [name, genreData] of uniqueGenres) {
    try {
      const { data: existing } = await supabase
        .from('genres')
        .select('id, name')
        .eq('name', name)
        .single();

      if (existing) {
        slugToId.genres.set(name, existing.id);
        stats.genres.skipped++;
        continue;
      }

      const { data: inserted, error } = await supabase
        .from('genres')
        .insert(genreData)
        .select()
        .single();

      if (error) throw error;

      slugToId.genres.set(name, inserted.id);
      stats.genres.success++;
      console.log(`  ✅ Created genre: ${name}`);
    } catch (error: any) {
      stats.genres.failed++;
      stats.errors.push({ entity: 'genre', error: error.message, data: genreData });
      console.error(`  ❌ Failed to import genre ${name}:`, error.message);
    }
  }
}

async function importBands(data: any[]): Promise<void> {
  console.log('\n🎸 Importing Bands...');

  // Deduplicate bands by slug
  const uniqueBands = new Map<string, any>();

  for (const item of data) {
    if (item.bands) {
      for (const band of item.bands) {
        if (!uniqueBands.has(band.slug)) {
          uniqueBands.set(band.slug, band);
        }
      }
    }
  }

  for (const [slug, bandData] of uniqueBands) {
    try {
      const { data: existing } = await supabase
        .from('bands')
        .select('id, slug')
        .eq('slug', slug)
        .single();

      if (existing) {
        slugToId.bands.set(slug, existing.id);
        stats.bands.skipped++;
        continue;
      }

      const normalizedBand = {
        slug: bandData.slug,
        name: bandData.name,
        origin_city: bandData.origin_city,
        state: normalizeState(bandData.state),
        country: bandData.country || 'USA',
        formed_year: bandData.formed_year,
        disbanded_year: bandData.disbanded_year,
        status: normalizeStatus(bandData.status),
        description: bandData.description,
        bio: bandData.bio,
        history: bandData.history,
        hero_image_url: bandData.hero_image_url,
        spotify_url: bandData.spotify_url,
        bandcamp_url: bandData.bandcamp_url,
        website_url: bandData.website_url,
        instagram_handle: bandData.instagram_handle,
        facebook_url: bandData.facebook_url,
        youtube_url: bandData.youtube_url,
        press_contact: bandData.press_contact,
        featured: bandData.featured || false,
        notes: bandData.notes,
      };

      const { data: inserted, error } = await supabase
        .from('bands')
        .insert(normalizedBand)
        .select()
        .single();

      if (error) throw error;

      slugToId.bands.set(slug, inserted.id);
      stats.bands.success++;
      console.log(`  ✅ Created band: ${bandData.name} (${slug})`);
    } catch (error: any) {
      stats.bands.failed++;
      stats.errors.push({ entity: 'band', error: error.message, data: bandData });
      console.error(`  ❌ Failed to import band ${bandData.name}:`, error.message);
    }
  }
}

async function importMusicians(data: any[]): Promise<void> {
  console.log('\n🎤 Importing Musicians...');

  const uniqueMusicians = new Map<string, any>();

  for (const item of data) {
    if (item.musicians) {
      for (const musician of item.musicians) {
        if (!uniqueMusicians.has(musician.slug)) {
          uniqueMusicians.set(musician.slug, musician);
        }
      }
    }
  }

  for (const [slug, musicianData] of uniqueMusicians) {
    try {
      const { data: existing } = await supabase
        .from('musicians')
        .select('id, slug')
        .eq('slug', slug)
        .single();

      if (existing) {
        slugToId.musicians.set(slug, existing.id);
        stats.musicians.skipped++;
        continue;
      }

      const { data: inserted, error } = await supabase
        .from('musicians')
        .insert({
          slug: musicianData.slug,
          name: musicianData.name,
          role: musicianData.role,
          location: musicianData.location,
          bio: musicianData.bio,
          website_url: musicianData.website_url,
          instagram_handle: musicianData.instagram_handle,
        })
        .select()
        .single();

      if (error) throw error;

      slugToId.musicians.set(slug, inserted.id);
      stats.musicians.success++;
      console.log(`  ✅ Created musician: ${musicianData.name}`);
    } catch (error: any) {
      stats.musicians.failed++;
      stats.errors.push({ entity: 'musician', error: error.message, data: musicianData });
      console.error(`  ❌ Failed to import musician ${musicianData.name}:`, error.message);
    }
  }
}

async function importBandMembers(data: any[]): Promise<void> {
  console.log('\n👥 Importing Band Members...');

  for (const item of data) {
    if (item.band_members || item.band_memberships) {
      const memberships = item.band_members || item.band_memberships;

      for (const membership of memberships) {
        try {
          const bandId = slugToId.bands.get(membership.band_slug);
          const musicianId = slugToId.musicians.get(membership.musician_slug);

          if (!bandId) {
            console.warn(`  ⚠️  Band slug not found: ${membership.band_slug}`);
            stats.band_members.skipped++;
            continue;
          }

          if (!musicianId) {
            console.warn(`  ⚠️  Musician slug not found: ${membership.musician_slug}`);
            stats.band_members.skipped++;
            continue;
          }

          const { error } = await supabase
            .from('band_members')
            .upsert({
              band_id: bandId,
              musician_id: musicianId,
              instrument: membership.instrument,
              role: membership.role,
              tenure_start: membership.tenure_start,
              tenure_end: membership.tenure_end,
            }, {
              onConflict: 'band_id,musician_id',
            });

          if (error) throw error;

          stats.band_members.success++;
        } catch (error: any) {
          stats.band_members.failed++;
          stats.errors.push({ entity: 'band_member', error: error.message, data: membership });
        }
      }
    }
  }

  console.log(`  ✅ Imported ${stats.band_members.success} band member relationships`);
}

async function importBandGenres(data: any[]): Promise<void> {
  console.log('\n🎵 Importing Band-Genre Relationships...');

  for (const item of data) {
    if (item.band_genres) {
      for (const bg of item.band_genres) {
        try {
          const bandId = slugToId.bands.get(bg.band_slug);
          const genreId = slugToId.genres.get(bg.genre_name);

          if (!bandId || !genreId) {
            stats.band_genres.skipped++;
            continue;
          }

          const { error } = await supabase
            .from('band_genres')
            .upsert({
              band_id: bandId,
              genre_id: genreId,
            }, {
              onConflict: 'band_id,genre_id',
            });

          if (error) throw error;

          stats.band_genres.success++;
        } catch (error: any) {
          stats.band_genres.failed++;
          stats.errors.push({ entity: 'band_genre', error: error.message, data: bg });
        }
      }
    }
  }

  console.log(`  ✅ Imported ${stats.band_genres.success} band-genre relationships`);
}

async function importVenues(data: any[]): Promise<void> {
  console.log('\n🏛️  Importing Venues...');

  const uniqueVenues = new Map<string, any>();

  for (const item of data) {
    if (item.venues) {
      for (const venue of item.venues) {
        if (!uniqueVenues.has(venue.slug)) {
          uniqueVenues.set(venue.slug, venue);
        }
      }
    }
  }

  for (const [slug, venueData] of uniqueVenues) {
    try {
      const { data: existing } = await supabase
        .from('venues')
        .select('id, slug')
        .eq('slug', slug)
        .single();

      if (existing) {
        slugToId.venues.set(slug, existing.id);
        stats.venues.skipped++;
        continue;
      }

      const { data: inserted, error } = await supabase
        .from('venues')
        .insert({
          slug: venueData.slug,
          name: venueData.name,
          address: venueData.address,
          city: venueData.city,
          state: normalizeState(venueData.state),
          postal_code: venueData.postal_code,
          country: venueData.country || 'USA',
          latitude: venueData.latitude,
          longitude: venueData.longitude,
          status: venueData.status,
          website_url: venueData.website_url,
          phone: venueData.phone,
          instagram_handle: venueData.instagram_handle,
          facebook_url: venueData.facebook_url,
          capacity: venueData.capacity,
          notes: venueData.notes,
        })
        .select()
        .single();

      if (error) throw error;

      slugToId.venues.set(slug, inserted.id);
      stats.venues.success++;
      console.log(`  ✅ Created venue: ${venueData.name}`);
    } catch (error: any) {
      stats.venues.failed++;
      stats.errors.push({ entity: 'venue', error: error.message, data: venueData });
      console.error(`  ❌ Failed to import venue ${venueData.name}:`, error.message);
    }
  }
}

async function importReleases(data: any[]): Promise<void> {
  console.log('\n💿 Importing Releases...');

  for (const item of data) {
    if (item.releases) {
      for (const release of item.releases) {
        try {
          const bandId = slugToId.bands.get(release.band_slug || release.artist_slug);

          if (!bandId) {
            console.warn(`  ⚠️  Band slug not found: ${release.band_slug || release.artist_slug}`);
            stats.releases.skipped++;
            continue;
          }

          const { error } = await supabase
            .from('releases')
            .insert({
              band_id: bandId,
              slug: release.slug,
              title: release.title,
              release_year: release.release_year,
              release_date: validateDate(release.release_date),
              format: release.format,
              rarity_notes: release.rarity_notes,
              cover_image_url: release.cover_image_url,
              spotify_url: release.spotify_url,
              bandcamp_url: release.bandcamp_url,
            });

          if (error) throw error;

          stats.releases.success++;
        } catch (error: any) {
          stats.releases.failed++;
          stats.errors.push({ entity: 'release', error: error.message, data: release });
        }
      }
    }
  }

  console.log(`  ✅ Imported ${stats.releases.success} releases`);
}

async function printStats(): Promise<void> {
  console.log('\n\n═══════════════════════════════════════');
  console.log('📊 IMPORT SUMMARY');
  console.log('═══════════════════════════════════════\n');

  const categories = [
    'bands', 'musicians', 'band_members', 'genres', 'band_genres',
    'releases', 'venues', 'events', 'event_bands', 'articles', 'rock_facts'
  ] as const;

  for (const category of categories) {
    const stat = stats[category];
    if (stat.success + stat.failed + stat.skipped > 0) {
      console.log(`${category.toUpperCase()}:`);
      console.log(`  ✅ Success: ${stat.success}`);
      console.log(`  ⏭️  Skipped: ${stat.skipped}`);
      console.log(`  ❌ Failed: ${stat.failed}\n`);
    }
  }

  if (stats.errors.length > 0) {
    console.log('\n⚠️  ERRORS:');
    stats.errors.slice(0, 10).forEach((err, i) => {
      console.log(`  ${i + 1}. ${err.entity}: ${err.error}`);
    });

    if (stats.errors.length > 10) {
      console.log(`  ... and ${stats.errors.length - 10} more errors`);
    }
  }

  console.log('\n═══════════════════════════════════════\n');
}

async function main() {
  console.log('🚀 Starting bulk import...\n');

  // Read all JSON files
  const jsonFiles = [
    'notebook-output-1.json',
    'notebook-output-2.json',
    'notebook-output-3.json',
    'notebook-output-4.json',
    'notebook-output-5.json',
    'notebook-output-6.json',
    'notebook-output-7.json',
    'notebook-output-8.json',
    'notebook-output-9.json',
  ];

  const allData: any[] = [];

  for (const file of jsonFiles) {
    const filePath = path.join(__dirname, '..', 'data', file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      allData.push(JSON.parse(content));
      console.log(`📄 Loaded ${file}`);
    }
  }

  // Import in correct order (respecting foreign keys)
  await importGenres(allData);
  await importBands(allData);
  await importMusicians(allData);
  await importBandMembers(allData);
  await importBandGenres(allData);
  await importVenues(allData);
  await importReleases(allData);

  await printStats();
}

main().catch(console.error);
