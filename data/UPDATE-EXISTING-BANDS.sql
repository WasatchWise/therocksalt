-- ========================================
-- UPDATE EXISTING BANDS WITH RESEARCH DATA
-- Adds tier, description, bio, hometown
-- ========================================

-- Update Chelsea Grin
UPDATE public.bands
SET
  tier = 'platinum',
  hometown = 'Salt Lake City, UT',
  description = 'Deathcore metal band signed to major labels, one of Utah''s most globally recognized metal acts.',
  bio = 'Formed in 2007 in SLC, Chelsea Grin has released 6 studio albums and toured internationally. Known for aggressive live shows and millions of streams, they represent Utah on the world metal stage.'
WHERE slug = 'chelsea-grin';

-- Update Cult Leader
UPDATE public.bands
SET
  tier = 'national_act',
  hometown = 'Salt Lake City, UT',
  description = 'Hardcore/metal band spawned from the ashes of Gaza, signed to Deathwish Inc.',
  bio = 'Formed in 2013 after Gaza disbanded. Members were veterans of the local hardcore community. Gained national recognition in the hardcore/metal scene with multiple albums on Jacob Bannon''s Deathwish Inc. label. Have toured the U.S. and Europe.'
WHERE slug = 'cult-leader';

-- Update Eagle Twin
UPDATE public.bands
SET
  tier = 'national_act',
  hometown = 'Salt Lake City, UT',
  description = 'Two-piece experimental doom/blues metal band on Southern Lord Records.',
  bio = 'Formed in 2007 as a two-piece experimental doom/blues metal band. Earned critical acclaim on Southern Lord Records and have toured internationally. Their sludgy sound and longevity (15+ years) make them stalwarts of the local heavy music scene.'
WHERE slug = 'eagle-twin';

-- Update Fictionist
UPDATE public.bands
SET
  tier = 'headliner',
  hometown = 'Provo, UT',
  description = 'Provo-based indie rock band that nearly signed with Atlantic Records.',
  bio = 'Active 2008-2018, often played in SLC venues. Released multiple albums, nearly signed with Atlantic Records, and opened for acts like Imagine Dragons. Regularly featured in local press and on KRCL. Had regional name recognition.'
WHERE slug = 'fictionist';

-- Update Form of Rocket
UPDATE public.bands
SET
  tier = 'headliner',
  hometown = 'Salt Lake City, UT',
  description = 'Post-hardcore/math rock band, a local favorite noted for high-energy sound.',
  bio = 'Active in the 2000s, this SLC band was a local favorite noted for their high-energy math-rock sound. One of co-owner Will Sartain''s favorites at Kilby Court. With two acclaimed albums and appearances at local festivals (like Crucialfest), they influenced the 2000s SLC underground rock scene.'
WHERE slug = 'form-of-rocket';

-- Update Iceburn
UPDATE public.bands
SET
  tier = 'hof',
  hometown = 'Salt Lake City, UT',
  description = 'Pioneering jazz-core/post-hardcore band signed to Revelation Records.',
  bio = 'Formed in 1991 blending hardcore, metal, and jazz. Signed to Revelation Records in the ''90s. Gained an international cult following for their experimental style and are regarded as local legends. Their innovative fusion style put SLC on the map in the post-hardcore underground.'
WHERE slug = 'iceburn';

-- Update Imagine Dragons
UPDATE public.bands
SET
  tier = 'platinum',
  hometown = 'Las Vegas, NV (Utah roots)',
  description = 'Multi-platinum pop/rock band with Utah roots (Dan Reynolds from Utah).',
  bio = 'While formed in Las Vegas, the band''s early lineup had roots in Utah''s music scene. Singer Dan Reynolds is from Utah and the band cut its teeth playing Provo venues. By 2012 they achieved multi-platinum worldwide success. Famously played an early show at Kilby Court before breaking big.'
WHERE slug = 'imagine-dragons';

-- Update IDKHOW
UPDATE public.bands
SET
  tier = 'platinum',
  hometown = 'Salt Lake City, UT',
  description = 'Indie pop/alt rock duo featuring Dallon Weekes (ex-Panic! at the Disco) and Ryan Seaman.',
  bio = 'Formed in 2016 as a duo featuring Dallon Weekes (formerly of Panic! at the Disco and The Brobecks) and Ryan Seaman (also ex-Brobecks), both originating from SLC''s music scene. IDKHBTFM has a huge online following and Billboard charting hits. They represent the modern wave of SLC-bred talent reaching national audiences.'
WHERE slug = 'idkhow';

-- Update The National Parks
UPDATE public.bands
SET
  tier = 'national_act',
  hometown = 'Provo, UT',
  description = 'Indie folk band beloved statewide with dedicated national fanbase.',
  bio = 'Provo-based indie folk band formed in 2013, beloved statewide. Have several albums and a dedicated national fanbase, and have headlined regional festivals. They credit early gigs at Kilby Court for helping launch their career. Their uplifting folk-pop sound and touring success make them one of Utah''s prominent musical exports in the 2010s.'
WHERE slug = 'the-national-parks';

-- Update Neon Trees
UPDATE public.bands
SET
  tier = 'hof',
  hometown = 'Provo, UT',
  description = 'New wave/pop rock band with platinum hits in the early 2010s.',
  bio = 'Formed in Provo in 2005, Neon Trees exploded to fame with platinum hits in the early 2010s. They cut their teeth in Utah''s all-ages venues and even played tiny Kilby Court before topping charts. With national tours (including opening for The Killers) and multiple Top-40 singles, they are among Utah''s most successful modern rock bands.'
WHERE slug = 'neon-trees';

-- Update Red Bennies
UPDATE public.bands
SET
  tier = 'headliner',
  hometown = 'Salt Lake City, UT',
  description = 'Long-running SLC garage/alternative rock band led by David Payne.',
  bio = 'A longtime SLC garage/alternative rock band led by singer/guitarist David Payne. Active from the mid-1990s through 2010s, releasing numerous albums and frequently headlining local clubs. They were a favorite local live act and helped sustain SLC''s rock scene in the late ''90s and 2000s.'
WHERE slug = 'red-bennies';

-- Update Royal Bliss
UPDATE public.bands
SET
  tier = 'national_act',
  hometown = 'Salt Lake City, UT',
  description = 'Hard rock band known for DIY ethos, played 1000+ shows.',
  bio = 'SLC rock band formed in 1997, known for a hard-working DIY ethos. They''ve played 1000+ shows, released 8 albums, and even scored a deal with Capitol Records in the 2000s. Royal Bliss regularly headlines local festivals and remains one of Utah''s best-known rock bands regionally, with a loyal fanbase after 25+ years.'
WHERE slug = 'royal-bliss';

-- Update SubRosa
UPDATE public.bands
SET
  tier = 'national_act',
  hometown = 'Salt Lake City, UT',
  description = 'Experimental doom metal band with electric violins, internationally acclaimed.',
  bio = 'Active 2005-2019, achieved international acclaim in the metal press. Their albums made Decibel Magazine''s Top 40 lists, and they played major festivals (Roadburn, etc.). SubRosa''s unique mix of crushing riffs and electric violins put Utah''s doom scene on the map.'
WHERE slug = 'subrosa';

-- Update The Used
UPDATE public.bands
SET
  tier = 'hof',
  hometown = 'Orem, UT',
  description = 'Emo/post-hardcore band with platinum debut in 2002, one of Utah''s most famous exports.',
  bio = 'Though originating from Orem, The Used became one of Utah''s most famous rock exports with their 2002 platinum debut. They emerged from the Utah County hardcore scene and quickly gained international fame, influencing a generation of post-hardcore bands. Their success opened industry eyes to Utah''s music talent pool.'
WHERE slug = 'the-used';

-- Update Clear
UPDATE public.bands
SET
  tier = 'national_act',
  hometown = 'Salt Lake City, UT',
  description = 'Nationally significant straight-edge hardcore band, the only Utah hardcore band well-known out of state.',
  bio = 'Formed in 1995 and played their first show in February 1996. Produced a sound that was a fusion of heavy punk and heavy metal (metalcore). Released ''The Sickness Must End'' (7" record, 1996) and ''Deeper Than Blood'' (full-length CD, 1999) on Stillborn Records. They were the only Utah hardcore band well-known out of state and seemed positioned to ''make it big.'' The band dissolved in 2000 due to growing pains and diverging musical tastes.'
WHERE slug = 'clear';

-- Update The Brobecks
UPDATE public.bands
SET
  tier = 'headliner',
  hometown = 'Salt Lake City, UT',
  description = 'Indie rock band fronted by Dallon Weekes, precursor to IDKHOW.',
  bio = 'Formed in 2002 in Salt Lake City, growing out of the previous band 1000 West. Fronted by Dallon Weekes (lead vocals, bass, main songwriter). Released four studio albums. Ryan Seaman was drummer 2008-2009. Weekes later joined Panic! at the Disco (2009-2017) before founding IDKHOW. The Brobecks reunited in 2025 with a remastered album and new material.'
WHERE slug = 'the-brobecks';

-- Update Gaza
UPDATE public.bands
SET
  tier = 'headliner',
  hometown = 'Salt Lake City, UT',
  description = 'Mathcore/grindcore band known for extreme sounds.',
  bio = 'Active 2004-2013. Influential Salt Lake City heavy music band known for extreme sounds. Released three albums before disbanding in March 2013. Members went on to form Cult Leader.'
WHERE slug = 'gaza';

-- Update The Backseat Lovers
UPDATE public.bands
SET
  tier = 'platinum',
  hometown = 'Provo, UT',
  description = 'Indie rock band with viral hit ''Kilby Girl'', signed to Capitol Records.',
  bio = 'Formed in Provo in 2018. Members: Joshua Harmon (vocals/guitar), Jonas Swanson (guitar), KJ Ward (bass), Juice Welch (drums). Achieved viral success with ''Kilby Girl'', an ode to Kilby Court. The song broke into Billboard''s rock airplay chart in 2021. Self-released debut before signing to Capitol Records. Released ''Waiting to Spill'' in 2022.'
WHERE slug = 'the-backseat-lovers';

-- Update American Humor
UPDATE public.bands
SET
  tier = 'featured',
  hometown = 'Salt Lake City, UT',
  description = 'Favorite local punk band.'
WHERE slug = 'american-humor';

-- Update Fancy Ladz
UPDATE public.bands
SET
  tier = 'featured',
  hometown = 'Salt Lake City, UT',
  description = 'Popular local punk band.'
WHERE slug = 'fancy-ladz';

-- Update Worlds Worst
UPDATE public.bands
SET
  tier = 'featured',
  hometown = 'Salt Lake City, UT',
  description = 'Punk group with national buzz.'
WHERE slug = 'worlds-worst';

-- Show results
SELECT slug, name, tier, hometown FROM public.bands
WHERE tier IN ('hof', 'platinum', 'national_act', 'headliner', 'featured')
ORDER BY
  CASE tier
    WHEN 'hof' THEN 1
    WHEN 'platinum' THEN 2
    WHEN 'national_act' THEN 3
    WHEN 'headliner' THEN 4
    WHEN 'featured' THEN 5
  END,
  name;

-- ========================================
-- UPDATES COMPLETE!
-- Check the results above
-- ========================================
