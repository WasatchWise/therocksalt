'use client'

import { useState } from 'react'

export default function EventsCalendarClient() {
  const [genreFilter, setGenreFilter] = useState('ALL')
  const [regionFilter, setRegionFilter] = useState('ALL')

  const handleGenreFilter = (genre: string) => {
    setGenreFilter(genre)
    // Add filter logic here when backend is ready
    console.log('Genre filter clicked:', genre)
  }

  const handleRegionFilter = (region: string) => {
    setRegionFilter(region)
    // Add filter logic here when backend is ready
    console.log('Region filter clicked:', region)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] border-b-[3px] border-[#ff3366] py-8 mb-10">
        <div className="max-w-[1200px] mx-auto px-5">
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tight mb-2 drop-shadow-[2px_2px_4px_rgba(255,51,102,0.3)]">
            🎸 December 2025
          </h1>
          <div className="text-[#ff3366] text-xl font-semibold uppercase tracking-wide">
            Local Show Calendar
          </div>
          <div className="text-[#888] text-sm mt-2">
            Documenting Utah Music Since 2002 • Updated 12/11/25
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-5">
        {/* Filters */}
        <div className="mb-8 p-5 bg-[#1a1a1a] rounded-lg border border-[#333]">
          <span className="text-[#ff3366] font-bold text-sm uppercase mb-2 block">
            Filter by Genre
          </span>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'PUNK/HARDCORE', 'METAL', 'INDIE/ALT', 'FOLK/AMERICANA', 'COUNTRY', 'EDM/ELECTRONIC', 'BLUES/ROCK'].map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreFilter(genre)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${
                  genreFilter === genre
                    ? 'bg-[#ff3366] text-black border-white'
                    : 'bg-[#2d2d2d] text-[#e0e0e0] border-transparent hover:bg-[#ff3366] hover:text-black hover:-translate-y-0.5'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 p-5 bg-[#1a1a1a] rounded-lg border border-[#333]">
          <span className="text-[#ff3366] font-bold text-sm uppercase mb-2 block">
            Filter by Region
          </span>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'SALT LAKE VALLEY', 'UTAH COUNTY', 'OGDEN/WEBER', 'RURAL'].map((region) => (
              <button
                key={region}
                onClick={() => handleRegionFilter(region)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${
                  regionFilter === region
                    ? 'bg-[#ff3366] text-black border-white'
                    : 'bg-[#2d2d2d] text-[#e0e0e0] border-transparent hover:bg-[#ff3366] hover:text-black hover:-translate-y-0.5'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Don't Sleep On */}
        <div className="mb-12 bg-gradient-to-br from-[#2d1a1a] to-[#1a1a2d] border-2 border-[#ff3366] rounded-xl p-8">
          <div className="text-3xl font-black text-[#ff3366] uppercase mb-5">
            🔥 Don't Sleep On
          </div>
          <div className="space-y-4">
            <div className="bg-[rgba(255,51,102,0.1)] p-4 rounded-lg border-l-4 border-[#ff3366]">
              <strong className="text-[#ff6633]">TONIGHT (Dec 12)</strong> — 12 Bands of Christmas @ Urban Lounge (FREE w/ RSVP, 12 local acts)
            </div>
            <div className="bg-[rgba(255,51,102,0.1)] p-4 rounded-lg border-l-4 border-[#ff3366]">
              <strong className="text-[#ff6633]">TOMORROW (Dec 13)</strong> — Murphy & the Giant @ Piper Down (Jamie's farewell show)
            </div>
            <div className="bg-[rgba(255,51,102,0.1)] p-4 rounded-lg border-l-4 border-[#ff3366]">
              <strong className="text-[#ff6633]">TOMORROW (Dec 13)</strong> — Velour BOTB Finals + Cattle Decapitation @ Urban + Prik-Mas 2 @ Aces High
            </div>
            <div className="bg-[rgba(255,51,102,0.1)] p-4 rounded-lg border-l-4 border-[#ff3366]">
              <strong className="text-[#ff6633]">Dec 20</strong> — Royal Bliss @ Kamikazes (Ogden's biggest rock night)
            </div>
            <div className="bg-[rgba(255,51,102,0.1)] p-4 rounded-lg border-l-4 border-[#ff3366]">
              <strong className="text-[#ff6633]">NYE (Dec 31)</strong> — SLC has 8+ NYE shows across all genres
            </div>
          </div>
        </div>

        {/* THIS WEEK */}
        <div className="mb-12 bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-xl p-8 border border-[#333] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <h2 className="text-3xl font-extrabold text-[#ff3366] uppercase mb-6 pb-4 border-b-2 border-[#333] tracking-tight">
            This Week: Dec 12–14
          </h2>

          <div className="bg-gradient-to-r from-[#ff3366] to-[#ff6633] text-black p-4 my-6 rounded-lg text-xl font-extrabold uppercase tracking-wide flex items-center gap-2">
            ⚠️ FRI 12/12 — STACKED NIGHT
          </div>

          <ShowCard
            venue="Velour"
            location="Provo"
            lineup={<><span className="text-[#ff6633] font-semibold">BOTB #5:</span> Bleacher Babe, Loafa, Late For What, Hatchback</>}
          />

          <ShowCard
            venue="Kilby Court"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">Seaslak, The Painted Roses, Sweet Tangerine</span>}
            meta={[{ label: 'Time', value: '6:00 PM' }]}
          />

          <ShowCard
            venue="Urban Lounge"
            location="SLC"
            lineup={<><span className="text-[#ff6633] font-semibold">12 BANDS OF CHRISTMAS!</span> Blue Rain Boots, Bad Luck Brigade, Swerved By, Body-Double + 8 more</>}
            badges={[{ text: 'FREE w/ RSVP', type: 'special' }]}
            meta={[{ label: 'Time', value: '6:00 PM' }]}
            genreBadge="LOCAL SHOWCASE"
          />

          <ShowCard
            venue="Aces High Saloon"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">DJ Skadiorka</span>}
            meta={[
              { label: 'Time', value: '8:00 PM' },
              { label: 'Cost', value: 'FREE' }
            ]}
          />

          <ShowCard
            venue="Barbary Coast Saloon"
            location="Murray"
            lineup={<><span className="text-[#ff6633] font-semibold">Ho-Ho Down w/ Raccoon Rodeo</span></>}
            meta={[{ label: 'Time', value: '9:00 PM' }]}
            genreBadge="COUNTRY/ROCK"
          />

          <ShowCard
            venue="Piper Down Pub"
            location="SLC"
            lineup={<><span className="text-[#ff6633] font-semibold">River Trip, The Flower Babes</span></>}
            meta={[
              { label: 'Time', value: '9:00 PM' },
              { label: 'Cost', value: '$5' }
            ]}
          />

          <ShowCard
            venue="Hog Wallow"
            location="Cottonwood Heights"
            lineup={<span className="text-[#ff6633] font-semibold">The Pickpockets</span>}
            meta={[{ label: 'Time', value: '9:30 PM' }]}
          />

          <ShowCard
            venue="Soundwell"
            location="SLC"
            lineup={<><span className="text-[#ff6633] font-semibold">Markus Schulz</span> w/ Quincy Weigert B2B Ryckie Elis</>}
            meta={[
              { label: 'Time', value: '9:00 PM' },
              { label: 'Age', value: '21+' }
            ]}
            genreBadge="TRANCE/EDM"
          />

          <ShowCard
            venue="State Room"
            location="SLC"
            lineup={<><span className="text-[#ff6633] font-semibold">Honky Tonkin' Holidays</span> Triggers & Slips, Kate LeDeuce, Highball Train</>}
            meta={[{ label: 'Time', value: '8:00 PM' }]}
            genreBadge="HONKY TONK"
          />

          <ShowCard
            venue="Metro Music Hall"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">Jolly Holiday DIVA Show!</span>}
            meta={[{ label: 'Time', value: '7:30 PM' }]}
          />

          <div className="bg-gradient-to-r from-[#ff3366] to-[#ff6633] text-black p-4 my-6 rounded-lg text-xl font-extrabold uppercase tracking-wide flex items-center gap-2">
            ⚠️ SAT 12/13 — BIGGEST NIGHT OF THE MONTH
          </div>

          <ShowCard
            venue="Velour"
            location="Provo"
            lineup={<><span className="text-[#ff6633] font-semibold">WINTER 2025 BOTB FINALS</span> (Mon–Fri Winners)</>}
          />

          <ShowCard
            venue="Kilby Court"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">Bleacher Babe</span>}
            meta={[{ label: 'Time', value: '6:00 PM' }]}
          />

          <ShowCard
            venue="Urban Lounge"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">CATTLE DECAPITATION</span>}
            meta={[{ label: 'Time', value: '6:00 PM' }]}
            genreBadge="DEATH METAL"
          />

          <ShowCard
            venue="Aces High Saloon"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">PRIK-MAS 2 ~ X-MAS MASSACRE</span>}
            meta={[
              { label: 'Time', value: '3:00 PM' },
              { label: 'Cost', value: '$20' }
            ]}
            genreBadge="METAL/PUNK HOLIDAY FEST"
          />

          <ShowCard
            venue="Barbary Coast Saloon"
            location="Murray"
            lineup={<span className="text-[#ff6633] font-semibold">Louder Than Hell</span>}
            meta={[{ label: 'Time', value: '9:00 PM' }]}
            genreBadge="METAL"
          />

          <ShowCard
            venue="Piper Down Pub"
            location="SLC"
            lineup={<><span className="text-[#ff6633] font-semibold">Murphy & the Giant</span> w/ Nellie & the Swillers</>}
            badges={[{ text: "JAMIE'S FAREWELL SHOW", type: 'warning' }]}
            meta={[
              { label: 'Time', value: '9:00 PM' },
              { label: 'Cost', value: '$5' }
            ]}
            genreBadge="FOLK-PUNK"
          />

          <ShowCard
            venue="Hog Wallow"
            location="Cottonwood Heights"
            lineup={<><span className="text-[#ff6633] font-semibold">Stonefed</span> (Whiteout Party – wear white!)</>}
            meta={[{ label: 'Time', value: '9:30 PM' }]}
          />

          <ShowCard
            venue="Soundwell"
            location="SLC"
            lineup={<><span className="text-[#ff6633] font-semibold">VASTIVE</span> (New Levels, New Devils tour)</>}
            meta={[{ label: 'Time', value: '9:00 PM' }]}
          />
        </div>

        {/* DEC 15-21 */}
        <div className="mb-12 bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-xl p-8 border border-[#333] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <h2 className="text-3xl font-extrabold text-[#ff3366] uppercase mb-6 pb-4 border-b-2 border-[#333] tracking-tight">
            Dec 15–21: Holiday Ramp-Up
          </h2>

          <DayHeader day="SUN 12/15" />
          <ShowCard
            venue="Kilby Court"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">Chanpan</span>}
            badges={[{ text: 'SOLD OUT', type: 'default' }]}
            meta={[{ label: 'Time', value: '7:00 PM' }]}
          />

          <DayHeader day="MON 12/15" />
          <ShowCard
            venue="Tailgate Tavern"
            location="S. Salt Lake"
            lineup={<><span className="text-[#ff6633] font-semibold">Renee Mackin</span> Country Music Mondays</>}
            meta={[
              { label: 'Time', value: '8:00 PM – 10:00 PM' },
              { label: 'Cost', value: 'FREE' }
            ]}
          />

          <DayHeader day="TUE 12/16" />
          <ShowCard
            venue="Velour"
            location="Provo"
            lineup={<><span className="text-[#ff6633] font-semibold">Utah Ladies Songwriters Round:</span> Emily Bea, Emily Hicks, Amy Geis, Alicia Stockman</>}
          />
          <ShowCard
            venue="Aces High Saloon"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">OMG! Karaoke</span>}
            meta={[
              { label: 'Time', value: '8:00 PM' },
              { label: 'Cost', value: 'FREE' }
            ]}
          />

          <DayHeader day="WED 12/17" />
          <ShowCard
            venue="Velour"
            location="Provo"
            lineup={<><span className="text-[#ff6633] font-semibold">X-MAS Open-Mic</span> (Holiday Songs Encouraged)</>}
          />
          <ShowCard
            venue="Aces High Saloon"
            location="SLC"
            lineup={<><span className="text-[#ff6633] font-semibold">MOVIE NIGHT:</span> Dumb & Dumber / How the Grinch Stole Christmas</>}
            meta={[{ label: 'Time', value: '7:00 PM' }]}
          />
          <ShowCard
            venue="State Room"
            location="SLC"
            lineup={<><span className="text-[#ff6633] font-semibold">Cinema Club:</span> Bill & Ted's Excellent Adventure / School of Rock</>}
            meta={[{ label: 'Time', value: '7:00 PM' }]}
          />

          <DayHeader day="THU 12/18" />
          <ShowCard
            venue="Velour"
            location="Provo"
            lineup="No Show (X-Mas Special Prep)"
          />
          <ShowCard
            venue="Aces High Saloon"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">OMG! Karaoke</span>}
            meta={[
              { label: 'Time', value: '8:00 PM' },
              { label: 'Cost', value: 'FREE' }
            ]}
          />

          <DayHeader day="FRI 12/19" />
          <ShowCard
            venue="Velour"
            location="Provo"
            lineup={<span className="text-[#ff6633] font-semibold">2025 VELOUR ALL-STAR CHRISTMAS SPECIAL (Night #1)</span>}
          />
          <ShowCard
            venue="Kilby Court"
            location="SLC"
            lineup={<><span className="text-[#ff6633] font-semibold">GLARE</span> (S&S Presents)</>}
          />
          <ShowCard
            venue="Urban Lounge"
            location="SLC"
            lineup={<><span className="text-[#ff6633] font-semibold">JINGLE JAM</span> (Equality Utah holiday bash)</>}
            meta={[{ label: 'Time', value: '7:00 PM' }]}
          />
          <ShowCard
            venue="Aces High Saloon"
            location="SLC"
            lineup="Honey Stomach, Kirk Dath, Sindar, Bakal"
            meta={[
              { label: 'Time', value: '7:00 PM' },
              { label: 'Cost', value: '$10' }
            ]}
            genreBadge="HARDCORE"
          />
          <ShowCard
            venue="Barbary Coast Saloon"
            location="Murray"
            lineup={<span className="text-[#ff6633] font-semibold">End of Year Rocks</span>}
            meta={[{ label: 'Time', value: '9:00 PM' }]}
          />
          <ShowCard
            venue="Ice Haus"
            location="Murray"
            lineup={<span className="text-[#ff6633] font-semibold">The Alpines</span>}
            meta={[{ label: 'Time', value: '9:00 PM' }]}
            genreBadge="INDIE"
          />
          <ShowCard
            venue="Redemption Bar & Grill"
            location="Herriman"
            lineup={<span className="text-[#ff6633] font-semibold">Dueling Pianos</span>}
            meta={[{ label: 'Time', value: '8:00 PM' }]}
          />
          <ShowCard
            venue="Metro Music Hall"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">Marrlo Suzzanne & The Galaxxy Band Christmas Drag Show</span>}
          />

          <DayHeader day="SAT 12/20" />
          <ShowCard
            venue="Velour"
            location="Provo"
            lineup={<span className="text-[#ff6633] font-semibold">2025 VELOUR ALL-STAR CHRISTMAS SPECIAL (Night #2)</span>}
          />
          <ShowCard
            venue="Kilby Court"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">sammy rash - one night only!</span>}
            meta={[{ label: 'Time', value: '5:00 PM' }]}
          />
          <ShowCard
            venue="Aces High Saloon"
            location="SLC"
            lineup={<><span className="text-[#ff6633] font-semibold">ASPF Benefit Show 2026:</span> Powerbeer, Captain Daniels & The Sunnybrook Sailors, Ribbons, The Delphic Quorum, Paramecium</>}
            meta={[
              { label: 'Time', value: '7:00 PM' },
              { label: 'Cost', value: '$15' }
            ]}
            genreBadge="PUNK/SKA BENEFIT"
          />
          <ShowCard
            venue="Kamikazes"
            location="Ogden"
            lineup={<><span className="text-[#ff6633] font-semibold">MERRY BLISSMAS – Royal Bliss</span> w/ Jordan Matthew Young, Paige and the Overtones</>}
            meta={[
              { label: 'Time', value: '8:00 PM' },
              { label: 'Cost', value: '$15–20' }
            ]}
            genreBadge="UTAH ROCK ROYALTY"
          />
          <ShowCard
            venue="Soundwell"
            location="SLC"
            lineup={<><span className="text-[#ff6633] font-semibold">Friendsmas (360º)</span> Yes Chef, Maplo, Abigail, Sammi Morris</>}
            meta={[{ label: 'Time', value: '9:00 PM' }]}
          />
          <ShowCard
            venue="Leatherheads Sports Bar"
            location="Draper"
            lineup={<span className="text-[#ff6633] font-semibold">Werk! Divas Drag Brunch - Holiday Edition</span>}
            meta={[
              { label: 'Time', value: '12:00 PM' },
              { label: 'Cost', value: '$42+' }
            ]}
          />

          <DayHeader day="SUN 12/21" />
          <ShowCard
            venue="Kilby Court"
            location="SLC"
            lineup={<><span className="text-[#ff6633] font-semibold">chokecherry</span> w/ The Sewing Club, Anime Girlfriend</>}
            meta={[{ label: 'Time', value: '7:00 PM' }]}
          />
        </div>

        {/* DEC 22-31 */}
        <div className="mb-12 bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-xl p-8 border border-[#333] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <h2 className="text-3xl font-extrabold text-[#ff3366] uppercase mb-6 pb-4 border-b-2 border-[#333] tracking-tight">
            Dec 22–31: Holiday Week + New Year's Eve
          </h2>

          <DayHeader day="MON 12/22" />
          <ShowCard
            venue="Aces High Saloon"
            location="SLC"
            lineup="CLOSED (Employee Appreciation)"
          />
          <ShowCard
            venue="Tailgate Tavern"
            location="S. Salt Lake"
            lineup={<><span className="text-[#ff6633] font-semibold">Reckless Rooster</span> Country Music Mondays</>}
            meta={[
              { label: 'Time', value: '8:00 PM – 10:00 PM' },
              { label: 'Cost', value: 'FREE' }
            ]}
          />

          <DayHeader day="TUE 12/23" />
          <ShowCard
            venue="Aces High Saloon"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">OMG! Karaoke</span>}
            meta={[
              { label: 'Time', value: '8:00 PM' },
              { label: 'Cost', value: 'FREE' }
            ]}
          />

          <DayHeader day="WED 12/24 (Christmas Eve)" />
          <ShowCard
            venue="Aces High Saloon"
            location="SLC"
            lineup="Open @ 7:00 PM"
          />

          <DayHeader day="THU 12/25 (Christmas)" />
          <ShowCard
            venue="Aces High Saloon"
            location="SLC"
            lineup="Open @ 7:00 PM"
          />
          <ShowCard
            venue="Velour"
            location="Provo"
            lineup="CLOSED (through Jan 1)"
          />

          <DayHeader day="FRI 12/26" />
          <ShowCard
            venue="Aces High Saloon"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">OMG! Karaoke</span>}
            meta={[
              { label: 'Time', value: '8:00 PM' },
              { label: 'Cost', value: 'FREE' }
            ]}
          />
          <ShowCard
            venue="Piper Down Pub"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">Rise Up Revival</span>}
            meta={[
              { label: 'Time', value: '9:00 PM – 1:00 AM' },
              { label: 'Cost', value: '$5' }
            ]}
          />
          <ShowCard
            venue="Hog Wallow"
            location="Cottonwood Heights"
            lineup={<span className="text-[#ff6633] font-semibold">Triggers & Slips</span>}
            meta={[{ label: 'Time', value: '9:30 PM' }]}
          />
          <ShowCard
            venue="Metro Music Hall"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">UNHOLY - CABARET - MEGA-SHOW!</span>}
            meta={[{ label: 'Time', value: '9:00 PM' }]}
          />

          <DayHeader day="SAT 12/27" />
          <ShowCard
            venue="Aces High Saloon"
            location="SLC"
            lineup={<><span className="text-[#ff6633] font-semibold">MOTORHEAD TRIVIA NITE w/ Haley Dahmer</span></>}
            meta={[{ label: 'Time', value: '8:00 PM' }]}
          />
          <ShowCard
            venue="Piper Down Pub"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">STK (Smarter Than Katie)</span>}
            meta={[
              { label: 'Time', value: '10:30 PM' },
              { label: 'Cost', value: '$5' }
            ]}
          />
          <ShowCard
            venue="Hog Wallow"
            location="Cottonwood Heights"
            lineup="Rick Gerber and the Black Daises"
            meta={[{ label: 'Time', value: '9:30 PM' }]}
          />
          <ShowCard
            venue="Metro Music Hall"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">Steel and Seduction</span>}
            meta={[{ label: 'Time', value: '7:00 PM' }]}
          />

          <DayHeader day="TUE 12/30" />
          <ShowCard
            venue="Aces High Saloon"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">OMG! Karaoke</span>}
            meta={[
              { label: 'Time', value: '8:00 PM' },
              { label: 'Cost', value: 'FREE' }
            ]}
          />

          <div className="bg-gradient-to-r from-[#ff3366] to-[#ff6633] text-black p-4 my-6 rounded-lg text-xl font-extrabold uppercase tracking-wide flex items-center gap-2">
            ⚠️ WED 12/31 (New Year's Eve) — NYE BLOWOUT
          </div>

          <ShowCard
            venue="The Complex"
            location="SLC"
            lineup={<><span className="text-[#ff6633] font-semibold">SLC NYE with SLANDER + Sara Landry</span></>}
            meta={[{ label: 'Age', value: '18+' }]}
            genreBadge="EDM MEGA-SHOW"
          />
          <ShowCard
            venue="The Depot"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">Club 90s Presents 2000's Night</span>}
            meta={[
              { label: 'Time', value: '9:00 PM' },
              { label: 'Age', value: '18+' }
            ]}
            genreBadge="THROWBACK PARTY"
          />
          <ShowCard
            venue="Urban Lounge"
            location="SLC"
            lineup={<><span className="text-[#ff6633] font-semibold">New Year's Eve with Flash & Flare, blessed1, Spaz!</span></>}
            meta={[{ label: 'Time', value: '9:00 PM' }]}
          />
          <ShowCard
            venue="Soundwell"
            location="SLC"
            lineup={<><span className="text-[#ff6633] font-semibold">The Motet</span> w/ League of Sound Disciples (Jason Hann of String Cheese Incident)</>}
            meta={[
              { label: 'Time', value: '7:30 PM' },
              { label: 'Age', value: '21+' }
            ]}
            genreBadge="FUNK"
          />
          <ShowCard
            venue="Aces High Saloon"
            location="SLC"
            lineup="Exclusionist, Stench Descent, Monstrology"
            meta={[
              { label: 'Time', value: '7:00 PM' },
              { label: 'Cost', value: '$10' }
            ]}
            genreBadge="METAL NYE"
          />
          <ShowCard
            venue="Barbary Coast Saloon"
            location="Murray"
            lineup={<><span className="text-[#ff6633] font-semibold">NYE with Moose Knuckle / JT Bevy</span></>}
            meta={[{ label: 'Time', value: '8:30 PM' }]}
          />
          <ShowCard
            venue="Redemption Bar & Grill"
            location="Herriman"
            lineup={<><span className="text-[#ff6633] font-semibold">PettyMac</span> – A Tribute to Fleetwood Mac / Tom Petty</>}
            meta={[{ label: 'Time', value: '9:00 PM' }]}
          />
          <ShowCard
            venue="Leatherheads Sports Bar"
            location="Draper"
            lineup={<><span className="text-[#ff6633] font-semibold">The Spazmatics + DJ Vision</span></>}
            meta={[{ label: 'Time', value: '8:00 PM' }]}
          />
          <ShowCard
            venue="Metro Music Hall"
            location="SLC"
            lineup={<span className="text-[#ff6633] font-semibold">Viva La Diva: New Year's Eve Diva</span>}
          />
        </div>

        {/* Venue Table */}
        <div className="mb-12 bg-[#1a1a1a] rounded-xl p-8 overflow-x-auto">
          <h2 className="text-3xl font-extrabold text-[#ff3366] mb-5">
            Venue Quick Reference
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-[#2d2d2d] text-[#ff3366] p-4 text-left font-bold uppercase text-sm border-b-2 border-[#ff3366]">Venue</th>
                  <th className="bg-[#2d2d2d] text-[#ff3366] p-4 text-left font-bold uppercase text-sm border-b-2 border-[#ff3366]">Location</th>
                  <th className="bg-[#2d2d2d] text-[#ff3366] p-4 text-left font-bold uppercase text-sm border-b-2 border-[#ff3366]">Genre Focus</th>
                  <th className="bg-[#2d2d2d] text-[#ff3366] p-4 text-left font-bold uppercase text-sm border-b-2 border-[#ff3366]">Notes</th>
                </tr>
              </thead>
              <tbody>
                {venueData.map((venue, idx) => (
                  <tr key={idx} className="hover:bg-[rgba(255,51,102,0.05)]">
                    <td className="p-4 border-b border-[#333]"><strong>{venue.name}</strong></td>
                    <td className="p-4 border-b border-[#333]">{venue.location}</td>
                    <td className="p-4 border-b border-[#333]">{venue.genre}</td>
                    <td className="p-4 border-b border-[#333]">{venue.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] py-10 text-center border-t-[3px] border-[#ff3366] mt-12">
        <div className="flex justify-center gap-8 mb-5 flex-wrap">
          <a href="https://therocksalt.com" className="text-[#ff3366] font-semibold hover:text-[#ff6633] transition-colors">TheRockSalt.com</a>
          <a href="https://therocksalt.com/live" className="text-[#ff3366] font-semibold hover:text-[#ff6633] transition-colors">Listen Live</a>
          <a href="https://forms.gle/ZkniH6q2HZdEUJbo9" className="text-[#ff3366] font-semibold hover:text-[#ff6633] transition-colors">Submit Your Show</a>
          <a href="https://discord.gg/2kA7ctt5" className="text-[#ff3366] font-semibold hover:text-[#ff6633] transition-colors">Join Discord</a>
        </div>
        <p className="text-[#666] text-sm">Documenting Utah Music Since 2002 • Updated 12/11/25</p>
        <p className="text-[#444] text-xs mt-2">© 2025 The RockSalt. All rights reserved.</p>
      </footer>
    </div>
  )
}

// Helper Components
function DayHeader({ day }: { day: string }) {
  return (
    <div className="bg-gradient-to-r from-[#ff3366] to-[#ff6633] text-black p-4 my-6 rounded-lg text-xl font-extrabold uppercase tracking-wide">
      {day}
    </div>
  )
}

interface ShowCardProps {
  venue: string
  location: string
  lineup: React.ReactNode | string
  badges?: Array<{ text: string; type: 'default' | 'special' | 'warning' }>
  meta?: Array<{ label: string; value: string }>
  genreBadge?: string
}

function ShowCard({ venue, location, lineup, badges = [], meta = [], genreBadge }: ShowCardProps) {
  return (
    <div className="bg-[#222] p-5 mb-4 rounded-lg border-l-4 border-[#ff3366] transition-all duration-300 hover:bg-[#2a2a2a] hover:border-l-[6px] hover:translate-x-1 hover:shadow-[0_5px_20px_rgba(255,51,102,0.3)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#ff3366] to-[#ff6633]"></div>
      <div className="font-extrabold text-white text-lg mb-2">
        {venue} <span className="text-[#888] text-sm ml-2">{location}</span>
        {badges.map((badge, idx) => (
          <span
            key={idx}
            className={`inline-block ml-2 px-2.5 py-1 rounded text-xs font-bold uppercase ${
              badge.type === 'special'
                ? 'bg-[#00ff88] text-black'
                : badge.type === 'warning'
                ? 'bg-[#ffaa00] text-black'
                : 'bg-[#ff3366] text-black'
            }`}
          >
            {badge.text}
          </span>
        ))}
      </div>
      <div className="text-[#e0e0e0] mb-2 text-sm">
        {typeof lineup === 'string' ? lineup : lineup}
      </div>
      <div className="flex flex-wrap gap-4 mt-2 text-xs">
        {meta.map((item, idx) => (
          <span key={idx} className="text-[#aaa]">
            <strong className="text-white">{item.label}:</strong> {item.value}
          </span>
        ))}
        {genreBadge && (
          <span className="inline-block bg-[#6633ff] text-white px-2.5 py-1 rounded text-xs font-bold uppercase">
            {genreBadge}
          </span>
        )}
      </div>
    </div>
  )
}

// Venue data
const venueData = [
  { name: 'Kilby Court', location: 'SLC (Granary)', genre: 'Indie, alt, punk', notes: 'All-ages, backyard shows' },
  { name: 'Urban Lounge', location: 'SLC (Sugar House)', genre: 'Rock, metal, indie', notes: '21+ after 9 PM' },
  { name: 'Aces High Saloon', location: 'SLC (Central)', genre: 'Punk, metal, hardcore', notes: 'Dive bar legend' },
  { name: 'Velour', location: 'Provo', genre: 'All-ages indie, alt', notes: 'Battle of the Bands hub' },
  { name: 'Piper Down Pub', location: 'SLC (Ballpark)', genre: 'Folk-punk, Irish', notes: '$5 cover standard' },
  { name: 'Barbary Coast Saloon', location: 'Murray', genre: 'Blues, hard rock', notes: 'Biker-friendly' },
  { name: 'Ice Haus', location: 'Murray', genre: 'Rock, indie', notes: 'Trivia/karaoke midweek' },
  { name: 'Soundwell', location: 'SLC (Downtown)', genre: 'EDM, indie, jam', notes: '21+ / All Ages varies' },
  { name: 'State Room', location: 'SLC (Downtown)', genre: 'Americana, honky-tonk, indie', notes: 'Seated venue' },
  { name: 'Hog Wallow', location: 'Cottonwood Heights', genre: 'Acoustic, jam, rock', notes: 'Canyon vibes, 21+' },
  { name: 'Tailgate Tavern', location: 'S. Salt Lake', genre: 'Country, honky-tonk', notes: 'Country Music Mondays' },
  { name: 'Redemption Bar & Grill', location: 'Herriman', genre: 'Tributes, covers', notes: 'Sports bar vibes' },
  { name: 'Kamikazes', location: 'Ogden', genre: 'Rock, punk, touring acts', notes: 'House of Rock' },
  { name: 'Metro Music Hall', location: 'SLC (Downtown)', genre: 'Drag, touring acts, metal', notes: 'Large capacity' },
  { name: 'The Depot', location: 'SLC (Downtown)', genre: 'Touring acts, dance parties', notes: '18+ / 21+ varies' },
  { name: 'The Complex', location: 'SLC (West Side)', genre: 'EDM, hip-hop, festivals', notes: 'Multi-room mega-venue' },
]
