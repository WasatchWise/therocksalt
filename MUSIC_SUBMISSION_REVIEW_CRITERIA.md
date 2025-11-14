# Music Submission Review Criteria

**Last Updated:** 2025-10-15
**Purpose:** Ensure consistent, fair, and quality-focused evaluation of all band submissions to The Rock Salt

---

## Quick Reference Checklist

Use this checklist when reviewing each music submission in the admin panel (`/admin/music-submissions`):

### ✅ Accept Criteria

A submission should be **ACCEPTED** if it meets **ALL** of these requirements:

- [ ] **Salt Lake City Connection** – Band is based in SLC or regularly plays SLC venues
- [ ] **Complete Profile** – Includes band name, bio (50+ chars), hometown, and contact info
- [ ] **Genre Fit** – Primary genre aligns with Rock Salt's focus (Rock, Punk, Metal, Indie, Alternative, Folk, Hip-Hop, Electronic, Hardcore, Emo, Experimental)
- [ ] **Quality Assets** – Band photo (if provided) is clear and professional; music sample (if provided) is listenable quality
- [ ] **Active Band** – Evidence the band is currently active (recent social media, upcoming shows, or stated booking availability)
- [ ] **Appropriate Content** – Music/imagery contains no hate speech, illegal content, or explicit material without warning

---

### ⚠️ Needs Review / Request Edits

Mark as **REVIEWED** and provide feedback if the submission has potential but needs improvement:

#### Common "Needs Edits" Scenarios:

1. **Incomplete Bio**
   - Bio is <50 characters or too vague
   - **Feedback template:** "Your submission looks promising! Please expand your bio to include: your band's origin story, musical style, and what makes you unique (minimum 50 characters)."

2. **Low-Quality Photo**
   - Photo is pixelated, poorly lit, or unprofessional
   - **Feedback template:** "We'd love to feature you, but we need a higher-resolution band photo. Please upload a clear, well-lit image (landscape format preferred, minimum 1200px wide)."

3. **Genre Mismatch**
   - Band doesn't fit any of The Rock Salt's featured genres
   - **Feedback template:** "Thanks for your interest! The Rock Salt primarily features [list genres]. Your music seems to lean more toward [their genre], which may not be the best fit for our platform. Consider submitting to [alternative platform suggestion]."

4. **Unclear SLC Connection**
   - Hometown is outside SLC area, and no local booking history mentioned
   - **Feedback template:** "We focus on Salt Lake City local music. Can you confirm your band plays SLC venues or is relocating to the area? If so, please update your submission with that info."

5. **Inactive Band**
   - Social media hasn't been updated in 2+ years, no upcoming shows, booking unavailable
   - **Feedback template:** "It looks like your band may be on hiatus. If you're planning to reactivate or have upcoming shows, please resubmit with updated info!"

---

### ❌ Decline Criteria

A submission should be **DECLINED** if it has any of these issues:

- [ ] **Spam/Fake** – Obvious test submission, fake band name, nonsense text
- [ ] **No SLC Connection** – Band is based outside Utah with no plans to play locally
- [ ] **Inappropriate Content** – Contains hate speech, illegal material, or explicit content without warnings
- [ ] **Not Music-Related** – Submission is a DJ set, podcast, comedy act, or non-band entity (unless explicitly expanding scope)
- [ ] **Duplicate Submission** – Band already exists in database
- [ ] **Commercial/Promotional** – Submission is an ad for a venue, label, or service (not a band)

**Decline Feedback Template:**
"Thank you for your submission. Unfortunately, [brief reason: e.g., 'we focus on local SLC bands' or 'this content doesn't fit our music platform']. We appreciate your interest in The Rock Salt!"

---

## Detailed Review Process

### Step 1: Open Submission in Admin Panel

Navigate to `/admin/music-submissions` and filter by **Pending** to see unreviewed submissions.

### Step 2: Evaluate Core Requirements

#### **A. SLC Connection (Required)**

- Check `hometown` field – Should mention Salt Lake City, Utah, or nearby areas (Provo, Ogden acceptable if they play SLC venues)
- Check `notes` section for mentions of local venues, SLC shows, or "booking available"
- Check social media links (if provided) for recent SLC event posts

**If unclear:** Mark as "Reviewed" and ask for clarification in feedback.

#### **B. Profile Completeness (Required)**

| Field | Requirement | How to Check |
|-------|-------------|--------------|
| Band Name | Present | Always required |
| Bio | 50-300 characters | Length shown in notes |
| Contact Email | Valid format | Check for @domain.com |
| Primary Genre | Selected | Shows as first genre tag |
| Hometown | Present | Should mention city/state |

**If incomplete:** Decline with specific feedback on what's missing.

#### **C. Genre Fit (Required)**

The Rock Salt focuses on these genres:

✅ **Accept:** Rock, Punk, Indie, Metal, Alternative, Folk, Hip-Hop, Electronic, Hardcore, Emo, Experimental, Pop, Country
❌ **Decline:** Classical, Jazz, Smooth Jazz, Easy Listening, Children's Music, Spoken Word (unless explicitly expanding)

**If borderline:** Check "For Fans Of" field or listen to music sample to confirm style.

#### **D. Asset Quality (Review if Provided)**

**Band Photo:**
- Click photo thumbnail to view full size
- ✅ Accept: Clear, in-focus, decent lighting, recognizable faces/instruments
- ❌ Request edit: Blurry, dark, pixelated, cropped awkwardly
- ℹ️ Note: Photo is optional – don't decline for missing photo

**Music Sample:**
- Click audio player to listen (at least 30 seconds)
- ✅ Accept: Clean audio, represents band's style, listenable on any device
- ❌ Request edit: Distorted, inaudible, poor recording quality (unless lo-fi is intentional aesthetic)
- ℹ️ Note: Music file is optional – don't decline for missing sample

#### **E. Band Activity Status (Required)**

Check social media links or "Booking Available" field:

- ✅ **Active:** Recent posts (within 6 months), upcoming shows, or "yes" to booking
- ⚠️ **Unclear:** No social media or last post 6-12 months ago → Request update
- ❌ **Inactive:** Social media dead 2+ years, booking "no", or explicit hiatus mention → Decline

---

### Step 3: Make Decision

#### **✅ ACCEPT**
1. Click **"Accept"** button
2. Submission status changes to "Accepted"
3. Band will be added to database (admin must manually create band profile in `/admin/bands` if auto-creation isn't enabled)
4. Submitter receives email: "Congratulations! Your band [Band Name] has been accepted..."

#### **⚠️ NEEDS EDITS**
1. Click **"Decline with Feedback"** button
2. In feedback modal, write specific, actionable feedback (see templates above)
3. Click **"Send Feedback & Decline"**
4. Status changes to "Declined" with feedback visible in submission card
5. Submitter receives email with your feedback

#### **❌ DECLINE**
1. Click **"Decline with Feedback"** button
2. Provide brief, polite reason (see templates above)
3. Click **"Send Feedback & Decline"**
4. Submission archived in "Declined" filter

---

### Step 4: Bulk Actions (Optional)

If reviewing multiple similar submissions (e.g., 5 SLC rock bands all meeting criteria):

1. Check the checkbox next to each submission
2. Click **"Bulk Accept"** or **"Bulk Decline"**
3. Confirm the action

**⚠️ Warning:** Bulk actions do NOT allow custom feedback. Only use for clear accept/decline cases.

---

## Edge Cases & Judgment Calls

### Scenario 1: Band from Outside SLC but Touring Through

**Decision:** Accept if they mention SLC tour dates or booking availability.
**Feedback (if unclear):** "We focus on local SLC bands. If you're touring through Salt Lake, please update your submission with show dates!"

### Scenario 2: Solo Artist (Not a "Band")

**Decision:** Accept – The Rock Salt features solo musicians.
**Note:** Update band profile to clarify it's a solo project if needed.

### Scenario 3: Side Project of Famous Band Member

**Decision:** Accept if they meet all criteria (local, active, etc.). Don't give preferential treatment.

### Scenario 4: Band Has Explicit Lyrics

**Decision:** Accept if content warnings are present and genre is appropriate (e.g., Hardcore, Punk).
**Action:** Add note in admin panel: "Explicit content – ensure marked on profile."

### Scenario 5: Submission Missing Social Links but Has Streaming Links

**Decision:** Accept – Social media is optional if they provide Spotify/Bandcamp.

### Scenario 6: Band Disbanded but Wants Archive Page

**Decision:** Mark as "Reviewed" and consult team lead – may accept as legacy/archive profile.

---

## Quality Standards by Genre

Different genres have different expectations. Use these as guidelines:

| Genre | Photo Expectations | Audio Expectations | Bio Expectations |
|-------|-------------------|-------------------|------------------|
| **Punk/Hardcore** | DIY, candid, live show OK | Raw, energetic, lo-fi acceptable | Short, punchy, attitude |
| **Metal** | Dark, moody, high contrast OK | Heavy, aggressive, tight production | Intense, descriptive |
| **Indie/Folk** | Artistic, moody, portrait-style | Clean, melodic, acoustic OK | Narrative, thoughtful |
| **Hip-Hop** | Professional, styled, branding | Polished beats, clear vocals | Storytelling, local references |
| **Electronic** | Abstract, minimal, logo OK | Experimental, clean mix | Technical, influences |

**Key:** Don't reject a punk band for having a grainy DIY photo if it fits their aesthetic. Context matters.

---

## Email Notification Templates

When accepting or declining, the following emails are auto-sent:

### ✅ Acceptance Email

**Subject:** Your Band Has Been Accepted to The Rock Salt!

**Body:**
```
Hi [Contact Name],

Great news! Your band [Band Name] has been accepted to The Rock Salt.

Your band profile will be live within 24 hours at:
https://therocksalt.com/bands/[slug]

What's next?
1. Claim your profile to edit details and add more content
2. Submit events when you have upcoming shows
3. Join our Discord to connect with other local musicians

Welcome to the Salt Lake City music community!

– The Rock Salt Team
```

### ❌ Decline Email (with Feedback)

**Subject:** Update Needed on Your Rock Salt Submission

**Body:**
```
Hi [Contact Name],

Thanks for submitting [Band Name] to The Rock Salt.

We've reviewed your submission and need some updates before we can feature you:

[Admin Feedback Here]

Once you've made these changes, feel free to resubmit at:
https://therocksalt.com/submit

Questions? Reply to this email or join our Discord.

– The Rock Salt Team
```

---

## Admin Notes Best Practices

- **Be specific:** Don't say "Bio needs work" – say "Please add details about your band's formation and musical influences."
- **Be encouraging:** Frame feedback as "We'd love to feature you, but..." not "Your submission is rejected because..."
- **Provide examples:** If asking for better photos, link to good examples from existing profiles.
- **Offer alternatives:** If declining due to genre mismatch, suggest other platforms.
- **Be consistent:** Use the templates above to ensure all admins give similar feedback.

---

## Metrics to Track

Admin panel should display:

- **Total Pending:** How many submissions need review
- **Acceptance Rate:** % of submissions accepted vs. declined (aim for 60-80%)
- **Average Review Time:** Time from submission to decision (target: <48 hours)
- **Top Decline Reasons:** Track why submissions fail to improve submission form

---

## When to Escalate

If unsure about a submission, escalate to team lead for:

- Boundary cases (e.g., band based in SLC but genre is classical)
- High-profile bands or artists
- Submissions with potential legal/copyright issues
- Duplicate submissions where one is clearly better

**Escalation Process:**
1. Mark submission as "Reviewed" (not Accepted or Declined)
2. Add admin note: "Escalated to [Team Lead] – [Reason]"
3. Tag team lead in Discord or email

---

## Revision History

| Date | Change | Author |
|------|--------|--------|
| 2025-10-15 | Initial criteria document created | HCI Engineer |

---

## Quick Reference: Keyboard Shortcuts (Future Feature)

- `A` – Accept selected submission
- `D` – Decline with feedback
- `R` – Mark as reviewed
- `Space` – Toggle checkbox
- `↓/↑` – Navigate between submissions

*Note: Keyboard shortcuts not yet implemented in admin UI*

---

For questions about review criteria, contact the admin team lead or post in #admin-support on Discord.
