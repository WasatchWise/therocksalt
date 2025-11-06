# The Rock Salt - Live Stream Setup Guide

## Overview

The Rock Salt now has a complete live streaming system integrated into the website. Users can listen to live broadcasts at **therocksalt.com/live**, and DJs can connect using Mixxx or other streaming software.

---

## For Listeners

### How to Listen Live

1. Visit **https://therocksalt.com/live** (or http://localhost:3000/live for local dev)
2. Click the **Play** button on the live stream player
3. Enjoy Salt Lake City's independent music radio!

### Features

- **🔴 LIVE Indicator**: Shows when stream is active
- **One-Click Playback**: Simple play/pause controls
- **Mobile-Friendly**: Works on all devices
- **Auto-Reconnect**: Handles network interruptions gracefully
- **Quality**: 192 kbps MP3 streaming

### Troubleshooting

- **No sound?** The stream may be offline if no DJ is broadcasting
- **Buffering?** Check your internet connection
- **Still issues?** Refresh the page and try again
- **Browser compatibility**: Best results with Chrome, Firefox, or Safari

---

## For DJs & Broadcasters

### Icecast Server Details

Your Icecast streaming server is running and ready to accept connections:

```
Server: localhost (or your-domain.com in production)
Port: 8000
Mount Point: /rocksalt.mp3
Type: Icecast 2
Username: source
Password: rocksalt-source
Format: MP3 @ 192 kbps
```

### Connecting with Mixxx (Recommended)

Mixxx is free, open-source DJ software perfect for live streaming.

1. **Download Mixxx**: https://mixxx.org/download/
2. **Open Preferences** → **Live Broadcasting**
3. **Create New Connection** with these settings:
   - **Type**: Icecast 2
   - **Host**: localhost (or your domain)
   - **Port**: 8000
   - **Mount**: /rocksalt.mp3
   - **Login**: source
   - **Password**: rocksalt-source
   - **Stream Info**:
     - Stream Name: The Rock Salt Live
     - Website: https://therocksalt.com
     - Description: Salt Lake City's Independent Music Radio
   - **Encoding**:
     - Bitrate: 192 kbps
     - Format: MP3
     - Channels: Stereo

4. **Enable Broadcasting**: Click "Enable Live Broadcasting" in Mixxx
5. **Start DJing**: Your stream is now live at therocksalt.com/live!

### Alternative: OBS Studio

You can also stream with OBS Studio:

1. Add an **Audio Input Capture** source
2. Go to **Settings** → **Stream**
3. Select **Custom Streaming Server**
4. Server: `http://localhost:8000/rocksalt.mp3`
5. Stream Key: `source:rocksalt-source`

### Alternative: Direct URL Streaming

For simple audio file streaming, use:
```bash
ffmpeg -re -i your-audio-file.mp3 -c:a libmp3lame -b:a 192k \
  -content_type audio/mpeg \
  icecast://source:rocksalt-source@localhost:8000/rocksalt.mp3
```

---

## Server Administration

### Icecast Configuration

Location: `/opt/homebrew/etc/icecast.xml`

Key settings:
- **Admin password**: rocksalt-admin (change in production!)
- **Relay password**: rocksalt-relay
- **Max clients**: 100 (increase for more listeners)
- **Log directory**: `/opt/homebrew/var/log/icecast`

### Managing the Icecast Service

**Start Icecast:**
```bash
icecast -c /opt/homebrew/etc/icecast.xml
```

**Stop Icecast:**
```bash
# Find the process ID
lsof -i :8000 | grep icecast

# Kill the process
kill <PID>
```

**Check Status:**
```bash
lsof -i :8000
```

**View Logs:**
```bash
tail -f /opt/homebrew/var/log/icecast/error.log
tail -f /opt/homebrew/var/log/icecast/access.log
```

### Admin Web Interface

Access the Icecast admin panel:
- URL: http://localhost:8000/admin/
- Username: admin
- Password: rocksalt-admin

Features:
- View active streams and listeners
- Kick listeners
- Reload configuration
- View statistics

---

## Production Deployment

### Security Checklist

Before deploying to production:

1. **Change passwords** in `/opt/homebrew/etc/icecast.xml`:
   - source-password
   - relay-password
   - admin-password

2. **Update stream URL** in the website:
   - Add to `.env.production`:
     ```
     NEXT_PUBLIC_STREAM_URL=https://stream.therocksalt.com/rocksalt.mp3
     ```

3. **Configure firewall** to allow port 8000 (or use reverse proxy)

4. **Set up SSL/TLS** for HTTPS streaming (required for modern browsers)

5. **Enable authentication** for broadcasting (already done via source password)

### Reverse Proxy Setup (Recommended)

Use Nginx or Caddy to proxy Icecast through your main domain:

**Nginx Example:**
```nginx
location /stream/ {
    proxy_pass http://localhost:8000/;
    proxy_set_header Host $host;
    proxy_buffering off;
}
```

**Caddy Example:**
```
stream.therocksalt.com {
    reverse_proxy localhost:8000
}
```

### Monitoring

Set up monitoring for:
- Icecast process uptime
- Stream availability
- Listener counts
- Bandwidth usage
- Error logs

---

## Technical Architecture

### Components

1. **Icecast Server** (Port 8000)
   - Handles incoming streams from DJs
   - Distributes to multiple listeners
   - Manages mountpoints and metadata

2. **Next.js Website** (Port 3000 dev, 80/443 prod)
   - `/live` page with LiveStreamPlayer component
   - "Listen Live" button in header navigation
   - Responsive design for all devices

3. **LiveStreamPlayer Component**
   - React component wrapping HTML5 Audio element
   - Handles play/pause, loading states, errors
   - Visual feedback with LIVE indicator

### Stream Flow

```
DJ (Mixxx) → Icecast Server → Website Player → Listeners
               (Port 8000)     (/live page)
```

### File Locations

**Website Code:**
- Component: `src/components/LiveStreamPlayer.tsx`
- Page: `src/app/live/page.tsx`
- Header: `src/components/Header.tsx` (navigation link)

**Icecast:**
- Config: `/opt/homebrew/etc/icecast.xml`
- Logs: `/opt/homebrew/var/log/icecast/`
- PID File: `/opt/homebrew/var/run/icecast.pid`
- MIME Types: `/opt/homebrew/etc/mime.types`

---

## Testing Checklist

### Pre-Launch Testing

- [ ] Icecast starts without errors
- [ ] Admin panel accessible at http://localhost:8000/admin/
- [ ] Mixxx can connect successfully
- [ ] Stream appears in Icecast admin when Mixxx is broadcasting
- [ ] Website `/live` page loads correctly
- [ ] "Listen Live" button visible in header navigation
- [ ] Audio player shows loading state when connecting
- [ ] Audio playback works when stream is active
- [ ] LIVE indicator appears when streaming
- [ ] Mobile responsive design works
- [ ] Error messages display when stream is offline
- [ ] Multiple listeners can connect simultaneously

### Production Testing

- [ ] HTTPS streaming works
- [ ] Public URL resolves correctly
- [ ] Cross-origin headers configured
- [ ] CDN/caching bypassed for stream
- [ ] Firewall allows port 8000 (or reverse proxy works)
- [ ] SSL certificates valid
- [ ] DNS configured for stream subdomain

---

## Troubleshooting

### Issue: "Stream not available"

**Causes:**
- No DJ is currently broadcasting
- Icecast server is down
- Network connectivity issues

**Solutions:**
1. Check if Icecast is running: `lsof -i :8000`
2. Check if a source is connected: Visit admin panel
3. Restart Icecast if needed

### Issue: "Connection refused"

**Causes:**
- Icecast not running
- Wrong port or hostname
- Firewall blocking connection

**Solutions:**
1. Start Icecast: `icecast -c /opt/homebrew/etc/icecast.xml`
2. Verify port 8000 is open
3. Check firewall settings

### Issue: "Authentication failed" (Mixxx)

**Causes:**
- Wrong password
- Wrong username (should be "source")
- Wrong mount point

**Solutions:**
1. Verify password in `/opt/homebrew/etc/icecast.xml` under `<source-password>`
2. Ensure username is exactly "source" (case-sensitive)
3. Check mount point is `/rocksalt.mp3` (with leading slash)

### Issue: Audio cuts out / buffering

**Causes:**
- Unstable network connection (DJ side)
- Bitrate too high for connection
- Server resource constraints

**Solutions:**
1. Lower bitrate in Mixxx (try 128 kbps)
2. Check DJ's upload speed
3. Monitor server CPU/memory usage

---

## Future Enhancements

### Planned Features

- **Schedule Integration**: Show upcoming DJ sets on /live page
- **Now Playing**: Display current track metadata
- **Chat Integration**: Discord embed for live chat during broadcasts
- **Archive**: Auto-record shows and publish to episodes page
- **Analytics**: Track listener counts and popular shows
- **Multi-Stream**: Support multiple simultaneous channels
- **DJ Dashboard**: Web interface for DJs to manage their shows

### Database Integration

Consider adding livestream management via Supabase:

**Table: livestreams**
- id, title, description, dj_name, start_time, end_time, status
- youtube_url, stream_url, backup_stream_url, chat_enabled

This would enable:
- Scheduled show listings
- DJ profiles and show pages
- Listener notifications
- Show archives

---

## Support

### Getting Help

- **Website Issues**: https://github.com/therocksalt/issues
- **Icecast Docs**: https://icecast.org/docs/
- **Mixxx Support**: https://mixxx.org/wiki/

### Contact

- Email: music@therocksalt.com
- Discord: https://discord.gg/aPDxxnPb

---

## Quick Reference

**Start Everything:**
```bash
# Start Icecast
icecast -c /opt/homebrew/etc/icecast.xml

# Start website (dev)
cd /path/to/the-rock-salt
yarn dev

# Connect Mixxx with the settings above

# Visit http://localhost:3000/live
```

**Check Status:**
```bash
# Icecast running?
lsof -i :8000

# Website running?
lsof -i :3000

# View logs
tail -f /opt/homebrew/var/log/icecast/error.log
```

**Stop Everything:**
```bash
# Stop Icecast
killall icecast

# Stop Next.js
Ctrl+C in terminal or: killall node
```

---

🎸 **Rock on, Salt Lake City!** 🎸
