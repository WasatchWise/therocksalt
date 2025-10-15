-- ========================================
-- THE ROCK SALT DATABASE IMPORT
-- Batch 1: Complete import from research
-- ========================================

-- Step 1: Import Genres
-- ========================================

INSERT INTO public.genres (name) VALUES
('Deathcore'),
('Metal'),
('Hardcore'),
('Metalcore'),
('Doom Metal'),
('Experimental'),
('Indie Rock'),
('Post-Hardcore'),
('Math Rock'),
('Jazz-Core'),
('Pop'),
('Rock'),
('Alternative'),
('Hardcore Punk'),
('Straight Edge'),
('Indie Pop'),
('Folk Pop'),
('New Wave'),
('Pop Rock'),
('Garage Rock'),
('Hard Rock'),
('Ska'),
('Punk'),
('Funk'),
('Soul'),
('Emo'),
('Power Pop'),
('Grindcore'),
('Hip-Hop')
ON CONFLICT (name) DO NOTHING;

-- Step 2: Import Bands
-- ========================================

INSERT INTO public.bands (slug, name, origin_city, state, country, formed_year, disbanded_year, status, description, history) VALUES
('chelsea-grin', 'Chelsea Grin', 'Salt Lake City', 'UT', 'USA', 2007, NULL, 'active',
 'Deathcore metal band signed to major labels (Artery/Rise Records), one of Utah''s most globally recognized metal acts.',
 'Formed in 2007 in SLC, Chelsea Grin has released 6 studio albums and toured internationally. Known for aggressive live shows and millions of streams, they represent Utah on the world metal stage.'),

('cult-leader', 'Cult Leader', 'Salt Lake City', 'UT', 'USA', 2013, NULL, 'active',
 'Hardcore/metal band spawned from the ashes of Gaza, signed to Deathwish Inc.',
 'Formed in 2013 after Gaza disbanded. Members were veterans of the local hardcore community. Gained national recognition in the hardcore/metal scene with multiple albums on Jacob Bannon''s Deathwish Inc. label. Have toured the U.S. and Europe.'),

('eagle-twin', 'Eagle Twin', 'Salt Lake City', 'UT', 'USA', 2007, NULL, 'active',
 'Two-piece experimental doom/blues metal band on Southern Lord Records.',
 'Formed in 2007 as a two-piece experimental doom/blues metal band. Earned critical acclaim on Southern Lord Records and have toured internationally. Their sludgy sound and longevity (15+ years) make them stalwarts of the local heavy music scene.'),

('fictionist', 'Fictionist', 'Provo', 'UT', 'USA', 2008, 2018, 'dissolved',
 'Provo-based indie rock band that nearly signed with Atlantic Records.',
 'Active 2008-2018, often played in SLC venues. Released multiple albums, nearly signed with Atlantic Records, and opened for acts like Imagine Dragons. Regularly featured in local press and on KRCL. Had regional name recognition.'),

('form-of-rocket', 'Form of Rocket', 'Salt Lake City', 'UT', 'USA', 2000, NULL, 'dissolved',
 'Post-hardcore/math rock band, a local favorite noted for high-energy sound.',
 'Active in the 2000s, this SLC band was a local favorite noted for their high-energy math-rock sound. One of co-owner Will Sartain''s favorites at Kilby Court. With two acclaimed albums and appearances at local festivals (like Crucialfest), they influenced the 2000s SLC underground rock scene.'),

('iceburn', 'Iceburn', 'Salt Lake City', 'UT', 'USA', 1991, NULL, 'active',
 'Pioneering jazz-core/post-hardcore band signed to Revelation Records.',
 'Formed in 1991 blending hardcore, metal, and jazz. Signed to Revelation Records in the ''90s. Gained an international cult following for their experimental style and are regarded as local legends. Their innovative fusion style put SLC on the map in the post-hardcore underground.'),

('imagine-dragons', 'Imagine Dragons', 'Las Vegas', 'NV', 'USA', 2008, NULL, 'active',
 'Multi-platinum pop/rock band with Utah roots (Dan Reynolds from Utah).',
 'While formed in Las Vegas, the band''s early lineup had roots in Utah''s music scene. Singer Dan Reynolds is from Utah and the band cut its teeth playing Provo venues. By 2012 they achieved multi-platinum worldwide success. Famously played an early show at Kilby Court before breaking big.'),

('insight', 'Insight', 'Salt Lake City', 'UT', 'USA', 1987, 1990, 'dissolved',
 'The first SLC band to fully embrace straight-edge hardcore movement.',
 'Active 1987-1990, Insight was the first SLC band to fully embrace the straight-edge hardcore movement. Built a dedicated local and national following in the hardcore scene. They espoused drug-free and progressive ideals, influencing countless SLC hardcore bands that followed. Their 1989 EP Standing Strong on Soulforce Records is a touchstone of SLC hardcore history.'),

('idkhow', 'I Don''t Know How But They Found Me', 'Salt Lake City', 'UT', 'USA', 2016, NULL, 'active',
 'Indie pop/alt rock duo featuring Dallon Weekes (ex-Panic! at the Disco) and Ryan Seaman.',
 'Formed in 2016 as a duo featuring Dallon Weekes (formerly of Panic! at the Disco and The Brobecks) and Ryan Seaman (also ex-Brobecks), both originating from SLC''s music scene. IDKHBTFM has a huge online following and Billboard charting hits. They represent the modern wave of SLC-bred talent reaching national audiences.'),

('the-national-parks', 'The National Parks', 'Provo', 'UT', 'USA', 2013, NULL, 'active',
 'Indie folk band beloved statewide with dedicated national fanbase.',
 'Provo-based indie folk band formed in 2013, beloved statewide. Have several albums and a dedicated national fanbase, and have headlined regional festivals. They credit early gigs at Kilby Court for helping launch their career. Their uplifting folk-pop sound and touring success make them one of Utah''s prominent musical exports in the 2010s.'),

('neon-trees', 'Neon Trees', 'Provo', 'UT', 'USA', 2005, NULL, 'active',
 'New wave/pop rock band with platinum hits in the early 2010s.',
 'Formed in Provo in 2005, Neon Trees exploded to fame with platinum hits in the early 2010s. They cut their teeth in Utah''s all-ages venues and even played tiny Kilby Court before topping charts. With national tours (including opening for The Killers) and multiple Top-40 singles, they are among Utah''s most successful modern rock bands.'),

('the-osmonds', 'The Osmonds', 'Ogden', 'UT', 'USA', 1958, NULL, 'active',
 'Utah''s original pop superstars with international fame in the ''70s.',
 'Utah''s original pop superstars from Ogden, active since the 1960s. While not part of the underground scene, their international fame in the ''70s put Utah on the music industry''s radar. They paved the way for Utah''s entertainment industry and are cultural icons.'),

('red-bennies', 'Red Bennies', 'Salt Lake City', 'UT', 'USA', 1995, NULL, 'active',
 'Long-running SLC garage/alternative rock band led by David Payne.',
 'A longtime SLC garage/alternative rock band led by singer/guitarist David Payne. Active from the mid-1990s through 2010s, releasing numerous albums and frequently headlining local clubs. They were a favorite local live act and helped sustain SLC''s rock scene in the late ''90s and 2000s.'),

('royal-bliss', 'Royal Bliss', 'Salt Lake City', 'UT', 'USA', 1997, NULL, 'active',
 'Hard rock band known for DIY ethos, played 1000+ shows.',
 'SLC rock band formed in 1997, known for a hard-working DIY ethos. They''ve played 1000+ shows, released 8 albums, and even scored a deal with Capitol Records in the 2000s. Royal Bliss regularly headlines local festivals and remains one of Utah''s best-known rock bands regionally, with a loyal fanbase after 25+ years.'),

('subrosa', 'SubRosa', 'Salt Lake City', 'UT', 'USA', 2005, 2019, 'dissolved',
 'Experimental doom metal band with electric violins, internationally acclaimed.',
 'Active 2005-2019, achieved international acclaim in the metal press. Their albums made Decibel Magazine''s Top 40 lists, and they played major festivals (Roadburn, etc.). SubRosa''s unique mix of crushing riffs and electric violins put Utah''s doom scene on the map.'),

('swim-herschel-swim', 'Swim Herschel Swim', 'Salt Lake City', 'UT', 'USA', 1987, 1993, 'dissolved',
 'Legendary SLC ska/punk band known for wild live shows.',
 'A legendary SLC ska/punk band active in the late ''80s/early ''90s. Known for wild live shows and helped establish Utah''s ska scene. One of the first Utah ska bands to tour regionally, they hold a fond place in local music history.'),

('talia-keys', 'Talia Keys', 'Salt Lake City', 'UT', 'USA', 2010, NULL, 'active',
 'Prolific singer-songwriter and multi-instrumentalist known for high-energy funk/rock/soul.',
 'A prolific SLC singer-songwriter and multi-instrumentalist known for high-energy performances with her band (Talia Keys & The Love). Active since the 2010s, she''s a staple at Utah music festivals and a vocal activist. Has been featured on KRCL and opened for national acts, making her one of the prominent faces of the current local music scene.'),

('the-used', 'The Used', 'Orem', 'UT', 'USA', 2001, NULL, 'active',
 'Emo/post-hardcore band with platinum debut in 2002, one of Utah''s most famous exports.',
 'Though originating from Orem, The Used became one of Utah''s most famous rock exports with their 2002 platinum debut. They emerged from the Utah County hardcore scene and quickly gained international fame, influencing a generation of post-hardcore bands. Their success opened industry eyes to Utah''s music talent pool.'),

('victims-willing', 'Victims Willing', 'Salt Lake City', 'UT', 'USA', 1983, NULL, 'active',
 'One of SLC''s longest-running punk bands, mainstay of ''80s hardcore.',
 'Formed in 1983, one of SLC''s longest-running punk bands. Mainstay of the ''80s hardcore scene, known for a crossover punk/metal sound and relentless DIY spirit. Played with punk legends (opening for Danzig and D.R.I.) and is revered as an OG band in SLC''s punk history.'),

('clear', 'Clear', 'Salt Lake City', 'UT', 'USA', 1995, 2000, 'dissolved',
 'Nationally significant straight-edge hardcore band, the only Utah hardcore band well-known out of state.',
 'Formed in 1995 and played their first show in February 1996. Produced a sound that was a fusion of heavy punk and heavy metal (metalcore). Released ''The Sickness Must End'' (7" record, 1996) and ''Deeper Than Blood'' (full-length CD, 1999) on Stillborn Records. They were the only Utah hardcore band well-known out of state and seemed positioned to ''make it big.'' The band dissolved in 2000 due to growing pains and diverging musical tastes.'),

('the-brobecks', 'The Brobecks', 'Salt Lake City', 'UT', 'USA', 2002, 2013, 'reunited',
 'Indie rock band fronted by Dallon Weekes, precursor to IDKHOW.',
 'Formed in 2002 in Salt Lake City, growing out of the previous band 1000 West. Fronted by Dallon Weekes (lead vocals, bass, main songwriter). Released four studio albums. Ryan Seaman was drummer 2008-2009. Weekes later joined Panic! at the Disco (2009-2017) before founding IDKHOW. The Brobecks reunited in 2025 with a remastered album and new material.'),

('gaza', 'Gaza', 'Salt Lake City', 'UT', 'USA', 2004, 2013, 'dissolved',
 'Mathcore/grindcore band known for extreme sounds.',
 'Active 2004-2013. Influential Salt Lake City heavy music band known for extreme sounds. Released three albums before disbanding in March 2013. Members went on to form Cult Leader.'),

('the-backseat-lovers', 'The Backseat Lovers', 'Provo', 'UT', 'USA', 2018, NULL, 'active',
 'Indie rock band with viral hit ''Kilby Girl'', signed to Capitol Records.',
 'Formed in Provo in 2018. Members: Joshua Harmon (vocals/guitar), Jonas Swanson (guitar), KJ Ward (bass), Juice Welch (drums). Achieved viral success with ''Kilby Girl'', an ode to Kilby Court. The song broke into Billboard''s rock airplay chart in 2021. Self-released debut before signing to Capitol Records. Released ''Waiting to Spill'' in 2022.'),

('club-mungo', 'CLUB MUNGO', 'Salt Lake City', 'UT', 'USA', 2023, NULL, 'active',
 'Local hip-hop group, made first performance at Kilby Court in February 2023.', NULL),

('strawberry-cough', 'Strawberry Cough', 'Salt Lake City', 'UT', 'USA', 2023, NULL, 'active',
 'Local band that performed their first show at Kilby Court.', NULL),

('worlds-worst', 'Worlds Worst', 'Salt Lake City', 'UT', 'USA', 2020, NULL, 'active',
 'Punk group with national buzz.', NULL),

('fancy-ladz', 'Fancy Ladz', 'Salt Lake City', 'UT', 'USA', NULL, NULL, 'active',
 'Popular local punk band.', NULL),

('american-humor', 'American Humor', 'Salt Lake City', 'UT', 'USA', NULL, NULL, 'active',
 'Favorite local punk band.', NULL),

('spitting-teeth', 'Spitting Teeth', 'Salt Lake City', 'UT', 'USA', 1978, NULL, 'dissolved',
 '1978 punk pioneers, hosted one of SLC''s first punk shows at University of Utah.', NULL),

('the-atheists', 'The Atheists', 'Salt Lake City', 'UT', 'USA', 1979, NULL, 'dissolved',
 'Late 1970s punk band.', NULL)
ON CONFLICT (slug) DO NOTHING;

-- Step 3: Import Venues
-- ========================================

INSERT INTO public.venues (slug, name, city, state, country, capacity, address, status, notes) VALUES
('speedway-cafe', 'The Speedway Café', 'Salt Lake City', 'UT', 'USA', 290, '505 W. 500 S.', 'closed',
 'Perhaps the most legendary venue in SLC''s underground history. A 7,000 sq ft former warehouse (1986-1990) that became a refuge for punk, hardcore, and alternative music. Founders Paul Maritsas and Zay Speed obtained a rare ''brown bag'' permit (BYOB) allowing alcohol and under-21 kids at the same time - an ingenious workaround to Utah''s strict liquor laws. Often packed 500-700 people into a space legally meant for 290. Hosted Dead Kennedys (infamous flag burning incident), GWAR, 7 Seconds, Fishbone, Soundgarden, Ministry and more. Closure in 1990 marked ''the end of anarchy in Salt Lake.'''),

('kilby-court', 'Kilby Court', 'Salt Lake City', 'UT', 'USA', 200, NULL, 'active',
 'Established in 1999 by Phil Sherburne in a small garage down an alley. SLC''s longest-running all-ages venue. Legendary for its intimate atmosphere and has hosted early shows by then-unknown artists like Vampire Weekend, Mitski, Mac Miller, Doja Cat, MGMT, My Chemical Romance. Sold to Will Sartain and Lance Saunders (S&S Presents) in 2008. Celebrated 25th anniversary in 2024. Spawned the annual Kilby Block Party festival at Utah State Fairpark.'),

('urban-lounge', 'Urban Lounge', 'Salt Lake City', 'UT', 'USA', 300, NULL, 'active',
 'Founded in 2001. A 21+ downtown SLC bar and music venue fostering local talent and touring acts. Formerly the ''Holy Cow'' bar in the ''90s. S&S Presents venue known for excellent sound. Hosts broad genres: indie acts (Tame Impala, Glass Animals) and hip-hop (Waka Flocka Flame, Big KRIT).'),

('the-depot', 'The Depot', 'Salt Lake City', 'UT', 'USA', 1200, NULL, 'active',
 'Opened in 2006 in the historic Union Pacific Train Station downtown. Four-story layout with professional production. Early years featured indie/alt acts (Sigur Rós, My Morning Jacket, Built to Spill), later expanded to diverse headliners (Robert Plant, Dua Lipa, Snoop Dogg). Part of Live Nation circuit.'),

('metro-music-hall', 'Metro Music Hall', 'Salt Lake City', 'UT', 'USA', 600, NULL, 'active',
 'Formerly ''Club Sound/In The Venue'' in the 2000s, re-launched as Metro in 2017. 21+ (occasionally all-ages). Preferred venue for metal, hardcore, and industrial shows - home for SLC''s heavy music scene.'),

('the-complex', 'The Complex', 'Salt Lake City', 'UT', 'USA', 2500, NULL, 'active',
 'Opened c.2010. Warehouse-style venue complex with four stages (capacities 300-2500). Hosts indie, hip-hop, EDM, K-pop with flexible all-ages configurations. Rockwell room is one of the only indoor spaces in SLC for ~2,000+ attendees.'),

('the-state-room', 'The State Room', 'Salt Lake City', 'UT', 'USA', 300, NULL, 'active',
 'Opened in 2009. 21+, seated, cozy upscale venue known for excellent acoustics. Specializes in Americana, folk, jazz, and singer-songwriters.'),

('soundwell', 'Soundwell', 'Salt Lake City', 'UT', 'USA', 600, NULL, 'active',
 'Opened ~2018. 21+, newer downtown venue with focus on EDM, hip-hop, and dance nights. Modern club atmosphere for local DJs and electronic acts alongside national artists.'),

('liquid-joes', 'Liquid Joe''s', 'Salt Lake City', 'UT', 'USA', NULL, '1249 E 3300 S', 'active',
 'Opened April 1996. Premier SLC club fostering local bands, known for paying and treating musicians fairly. Installed one of the best sound systems in town, becoming ''a haven for local bands.'' Hosts Joe''s Fest and nightly live music with open-mic events.'),

('the-roxy', 'The Roxy', 'Salt Lake City', 'UT', 'USA', NULL, NULL, 'closed',
 'Late 1970s basement club under a bookstore downtown. Allowed underaged punks in through the back door. An early clandestine venue for SLC''s punk scene.'),

('club-dv8', 'Club DV8', 'Salt Lake City', 'UT', 'USA', NULL, 'Pierpont Ave', 'closed',
 'Active late 1980s/early 1990s through mid-1990s (closed ~2004). Alternative dance club that mixed DJ nights with live concerts. Brought in touring industrial, goth, and punk bands. Hosted raves and shows by The Cure''s side projects. Clear played their last show in DV8''s basement in 2000.'),

('the-word', 'The Word (Painted Word)', 'Salt Lake City', 'UT', 'USA', NULL, NULL, 'closed',
 'Mid-1980s all-ages club. Short-lived but important venue for punk shows. Insight ''tore The Word up'' in 1988. Located in the basement of the Raunch Records building.'),

('zephyr-club', 'The Zephyr Club', 'Salt Lake City', 'UT', 'USA', NULL, NULL, 'closed',
 '1990-2003. Famed downtown club that primarily featured jazz, blues, and jam-rock. National jazz legends (Mose Allison, Sonny Rollins) and blues acts played here. Building was demolished, now a parking lot.'),

('in-the-venue', 'In The Venue / Bricks', 'Salt Lake City', 'UT', 'USA', NULL, '600 West', 'closed',
 'Mid-1990s through late 2010s. Venue complex that went by many names (Bricks, In The Venue, Club Sound). Split into ''In the Venue'' (21+) and ''Club Sound'' (under-21) in 2004. Hosted early shows by The Used and Paramore. Important LGBTQ nightlife space. Closed June 2020 due to pandemic and earthquakes.'),

('velour', 'Velour Live Music Gallery', 'Provo', 'UT', 'USA', 270, NULL, 'active',
 'Active since 2006. All-ages venue in Provo (45 miles south of SLC) with outsized influence on Utah''s music landscape. Fostered artists like Neon Trees, Imagine Dragons, and The Aces in their early years.'),

('black-lung-society', 'Black Lung Society', 'Salt Lake City', 'UT', 'USA', NULL, NULL, 'active',
 'New DIY space opened post-COVID to help restart the scene.')
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- IMPORT COMPLETE!
--
-- Results:
-- - 29 Genres
-- - 29 Bands
-- - 16 Venues
-- ========================================
