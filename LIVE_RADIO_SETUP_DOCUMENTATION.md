# The Rock Salt - Live Radio Setup Documentation

**Date:** November 6, 2025
**Status:** ✅ Live and Broadcasting

## Overview

The Rock Salt now has a fully functional live radio streaming system with:
- Live DJ broadcasting via Mixxx
- AzuraCast streaming server
- Real-time "Now Playing" widget on the website
- Clean, minimal homepage design

---

## 🎵 Streaming Infrastructure

### AzuraCast Server
- **URL:** https://a8.asurahosting.com
- **Station ID:** 1
- **Station Name:** TheRockSalt
- **Streaming Protocol:** Icecast 2

### Stream URLs
- **Live Stream:** `https://a8.asurahosting.com:9130/radio.mp3`
- **Bitrate:** 192 kbps MP3
- **Now Playing API:** `https://a8.asurahosting.com/api/station/1/nowplaying`

### Broadcasting Configuration
- **Port:** 9130
- **Mount Point:** `/radio.mp3`
- **Max Sources:** 2 (allows AutoDJ + Live DJ simultaneously)

---

## 🎧 Mixxx DJ Software Setup

### Connection Settings
- **Type:** Icecast 2
- **Host:** a8.asurahosting.com
- **Port:** 9130
- **Login:** source
- **Password:** Sonny2Jackets
- **Mount:** /radio.mp3

### Important Notes
- AutoDJ must be stopped OR max sources must be set to 2+ in AzuraCast
- The station MUST be running in AzuraCast before connecting
- Use the "source" credentials, not DJ-specific credentials (unless configured separately)

---

## 🔑 API Credentials

### AzuraCast API Key
```
57d979c6a7ba6cb7:9bc9173e1ad3904e851a16e8266deac5
```

### DJ Credentials
- **Username:** Manlyman
- **Password:** 38iVGBftdKMiuU4

### Source Credentials
- **Username:** source
- **Password:** Sonny2Jackets

---

## 🌐 Website Configuration

### Environment Variables (Vercel)

**Required for Production:**

1. **NEXT_PUBLIC_STREAM_URL**
   - Value: `https://a8.asurahosting.com:9130/radio.mp3`
   - Environments: Production, Preview, Development
   - Purpose: URL for the live audio stream

2. **X_API_Key**
   - Value: `57d979c6a7ba6cb7:9bc9173e1ad3904e851a16e8266deac5`
   - Environments: Production, Preview, Development
   - Purpose: Access to AzuraCast Now Playing API

### Content Security Policy Updates

Added to `next.config.ts`:

```typescript
"connect-src 'self' https://*.supabase.co https://api.unsplash.com https://a8.asurahosting.com",
"media-src 'self' blob: https://*.supabase.co https://a8.asurahosting.com:9130",
```

This allows:
- API calls to AzuraCast server
- Audio streaming from port 9130

---

## 📱 Homepage Features

### Current Components (in order)
1. **Logo** - The Rock Salt branding
2. **Radio Player** - Live stream with play/pause controls
3. **Now Playing Widget** - Real-time track information
4. **Submit Your Music** - Google Form link
5. **Discord Link** - Community invite
6. **Email Capture** - Newsletter signup

### Hidden Components
- Header navigation (commented out)
- Footer (commented out)

To restore navigation, edit `src/app/layout.tsx`:
```typescript
// Uncomment these lines:
<Header />
<Footer />
```

---

## 🔧 API Endpoints

### `/api/now-playing`

**Purpose:** Fetches current track info from AzuraCast

**Response Format:**
```json
{
  "song": {
    "title": "Track Title",
    "artist": "Artist Name",
    "album": "Album Name",
    "art": "https://..."
  },
  "live": {
    "is_live": true,
    "streamer_name": "Manlyman"
  }
}
```

**Update Frequency:** Every 15 seconds (client-side)

---

## 🚀 Deployment Process

### Quick Deploy
```bash
vercel --prod --yes
```

### Full Process
```bash
git add .
git commit -m "Your commit message"
vercel --prod --yes
```

### Current Git Status
- **Repository:** https://github.com/WasatchWise/therocksalt.git
- **Branch:** main
- **Deployment Platform:** Vercel
- **Live URL:** https://www.therocksalt.com

---

## 🐛 Troubleshooting

### Issue: Stream Won't Play

**Possible Causes:**
1. Environment variables not set in Vercel
2. Content Security Policy blocking the stream
3. AzuraCast station not running
4. Mixxx not connected

**Solutions:**
- Verify env vars in Vercel dashboard
- Check CSP in `next.config.ts`
- Start the station in AzuraCast
- Check Mixxx connection status

### Issue: "Mountpoint in Use" Error in Mixxx

**Cause:** AutoDJ is already connected to `/radio.mp3`

**Solutions:**
1. Stop AutoDJ in AzuraCast, OR
2. Increase max sources to 2+ in station settings

### Issue: Now Playing Not Updating

**Check:**
1. API key is set in Vercel
2. API endpoint is using correct AzuraCast URL (not localhost)
3. Browser console for errors
4. AzuraCast API is responding: https://a8.asurahosting.com/api/station/1/nowplaying

---

## 📂 Key Files Modified

### Frontend Components
- `src/app/page.tsx` - Homepage with radio player
- `src/components/LiveStreamPlayer.tsx` - Radio player component
- `src/app/layout.tsx` - Navigation hidden

### API Routes
- `src/app/api/now-playing/route.ts` - Now Playing endpoint

### Configuration
- `next.config.ts` - Content Security Policy
- `.env.local` - Local environment variables

---

## 📋 Pre-Launch Checklist

- [x] AzuraCast station configured
- [x] Mixxx connection tested
- [x] Stream URL working
- [x] Now Playing API functional
- [x] Environment variables set in Vercel
- [x] Content Security Policy updated
- [x] Homepage design simplified
- [x] Navigation hidden
- [x] Google Form link updated
- [x] Discord invite link updated
- [x] Email capture form added
- [x] Site deployed to production

---

## 🎯 Next Steps

### Immediate
- [ ] Test email capture backend integration
- [ ] Monitor stream stability
- [ ] Gather user feedback

### Future Enhancements
- [ ] Restore full navigation when ready
- [ ] Add chat widget for live shows
- [ ] Create DJ schedule page
- [ ] Build track request system
- [ ] Add listener statistics

---

## 📞 Support Resources

### AzuraCast
- Dashboard: https://a8.asurahosting.com
- Documentation: https://docs.azuracast.com

### Mixxx
- Download: https://mixxx.org
- Manual: https://manual.mixxx.org

### Vercel
- Dashboard: https://vercel.com/wasatch-wises-projects/the-rock-salt
- Docs: https://vercel.com/docs

---

## 🎉 Success Metrics

**Launch Status:**
- ✅ Website live at therocksalt.com
- ✅ Radio streaming at 192 kbps
- ✅ Now Playing widget functional
- ✅ All forms and links working
- ✅ Clean, minimal user experience

**Technical Stack:**
- Frontend: Next.js 14 + React
- Hosting: Vercel
- Streaming: AzuraCast (Icecast 2)
- DJ Software: Mixxx
- Database: Supabase (for future features)

---

*Documentation generated on November 6, 2025*
*Last updated: Initial setup complete*
