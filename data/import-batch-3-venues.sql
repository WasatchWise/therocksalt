-- Import Batch 3: Venues from notebook-output-9.json

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
