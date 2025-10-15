# The Rock Salt - Quick Reference Guide

## 📂 All HTML Files (8 Pages)
1. `rock-salt-landing.html` - Main homepage
2. `rock-salt-episodes.html` - Podcast archive  
3. `rock-salt-livestream.html` - Live streaming studio
4. `rock-salt-band-directory.html` - Band database
5. `rock-salt-events.html` - Event calendar
6. `rock-salt-salt-vault.html` - Historical archive
7. `rock-salt-submit-music.html` - Music submission
8. `rock-salt-community-hub.html` - Discord community

## 🔗 External Links Used

### Audio Content
- **801 and Done Episode**: 
  - Stream URL: `https://drive.google.com/uc?export=download&id=1Z5wbNRqueG-Lg2KEX01nKuxNWfya14nZ`
  - Drive Link: `https://drive.google.com/file/d/1Z5wbNRqueG-Lg2KEX01nKuxNWfya14nZ/view?usp=drive_link`

### Social Media
- **Discord Server**: `https://discord.gg/yKK4PSjT`
- **Spotify (The New Transit Direction)**: `https://open.spotify.com/artist/33z2xioJjNavgUwTfPEu6N?si=sjaukFbKQWy1-nHq_fDQwA`
- **Facebook Event (Red Pete)**: `https://www.facebook.com/events/1106680557727159/`

### Easter Egg
- **Rick Roll Video**: `https://www.youtube.com/embed/dQw4w9WgXcQ`

## 🎨 Color Palette
```css
/* Primary Colors */
--primary-red: #ff4444;
--primary-red-light: #ff6666;

/* Discord Colors */
--discord-blue: #5865F2;
--discord-blue-light: #7289DA;

/* Accent Colors */
--accent-orange: #ffaa00;
--accent-green: #00ff00;
--spotify-green: #1DB954;
--facebook-blue: #1877f2;

/* Background */
--bg-dark: #1a1a1a;
--bg-medium: #2d2d2d;

/* Text */
--text-white: #ffffff;
--text-light: #cccccc;
--text-gray: #888888;
--text-dark-gray: #666666;
```

## 💻 Key Code Snippets

### Google Drive Audio Embed
```html
<audio controls style="width: 100%;">
    <source src="https://drive.google.com/uc?export=download&id=FILE_ID" type="audio/mpeg">
    Your browser does not support the audio element.
</audio>
```

### Camera Access (JavaScript)
```javascript
const stream = await navigator.mediaDevices.getUserMedia({ 
    video: true, 
    audio: true 
});
const video = document.createElement('video');
video.srcObject = stream;
video.autoplay = true;
```

### Gradient Button Style
```css
.button {
    background: linear-gradient(135deg, #ff4444, #ff6666);
    padding: 15px 40px;
    border-radius: 50px;
    box-shadow: 0 5px 20px rgba(255, 68, 68, 0.4);
    transition: all 0.3s ease;
}
.button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255, 68, 68, 0.6);
}
```

### Filter System
```javascript
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        // Apply filter logic
    });
});
```

## 📦 Migration Checklist

### To Google Sites:
- [ ] Create 8 pages in Google Sites
- [ ] Add Embed blocks to each page
- [ ] Paste HTML code
- [ ] Set embed heights (800-1200px recommended)
- [ ] Create navigation menu
- [ ] Test all links
- [ ] Verify audio streaming works
- [ ] Check mobile responsiveness

### To Another Platform:
- [ ] Export all 8 HTML files
- [ ] Update any hardcoded URLs if needed
- [ ] Ensure HTTPS for camera features
- [ ] Test Google Drive audio streaming
- [ ] Verify all external links work
- [ ] Check responsive design
- [ ] Test interactive features
- [ ] Set up analytics (optional)

## 🎯 Feature Testing Checklist

### Landing Page
- [ ] Audio player streams "801 and Done"
- [ ] Download button works
- [ ] Trivia generator cycles through facts
- [ ] All cards have hover effects
- [ ] Spotify/Facebook links open correctly

### Episodes Page
- [ ] Filter buttons work (All/Audio/Video)
- [ ] Audio player displays for "801 and Done"
- [ ] Download/Drive links work
- [ ] Load More button functions

### Live Stream
- [ ] YouTube embed loads (Rick Roll)
- [ ] Camera permission request appears
- [ ] Start/Stop camera works
- [ ] Status indicators update

### Band Directory
- [ ] Search bar filters in real-time
- [ ] Genre tags filter correctly
- [ ] AI bio generation animates
- [ ] Spotify link opens
- [ ] Load more adds bands

### Events Calendar
- [ ] Calendar navigation works
- [ ] Red Pete event shows
- [ ] Facebook link works
- [ ] Past events display
- [ ] AI descriptions generate

### Salt Vault
- [ ] Timeline animates on scroll
- [ ] Band/venue names are clickable
- [ ] Archive cards show alerts
- [ ] Explore button loads more

### Submit Music
- [ ] Google Form placeholder shows
- [ ] Demo form toggle works
- [ ] Guidelines display clearly
- [ ] Submission simulation works

### Community Hub
- [ ] Discord invite link works
- [ ] Member counter updates
- [ ] Channel list displays
- [ ] Floating animations work
- [ ] Activities grid shows

## 🚀 Quick Deploy Commands

### For Git
```bash
git init
git add .
git commit -m "Initial Rock Salt website commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### For Local Testing
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

## 📝 Notes
- All features tested and working as of October 2025
- Designed for Google Sites embed but works standalone
- No backend required (all static)
- Camera features need HTTPS
- Audio streaming requires public Google Drive links

## End of Quick Reference


