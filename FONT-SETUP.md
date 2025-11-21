# Font Setup Guide

## Current Setup: Adobe Fonts CDN

Your site is currently configured to use Adobe Fonts (Typekit) CDN. This is the **recommended approach** for Proxima Nova.

### Pros of Adobe Fonts CDN:
✅ Already licensed with your Adobe subscription
✅ No setup required (just add project ID)
✅ Automatic updates
✅ Optimized delivery
✅ No licensing headaches

### To Use Adobe Fonts (Easiest):
1. Visit [Adobe Fonts](https://fonts.adobe.com/)
2. Create web project with Proxima Nova (weights: 300, 400, 500, 600, 700)
3. Copy your project ID (e.g., `abc1def`)
4. In `src/_layouts/base.njk`, replace `PROJECT_ID`:
   ```html
   <link rel="stylesheet" href="https://use.typekit.net/YOUR_ID_HERE.css">
   ```
5. Done! 🎉

---

## Alternative: Self-Hosted Fonts

If you want to serve fonts from your own domain instead:

### Requirements:

1. **Legal License**
   - Adobe Fonts subscription does NOT include self-hosting rights
   - You must purchase web font license separately from:
     - [Mark Simonson Studio](https://www.marksimonson.com/fonts/view/proxima-nova) (official)
     - [MyFonts](https://www.myfonts.com/collections/proxima-nova-font-mark-simonson-studio)
     - Cost: ~$200-400 for web fonts

2. **Font Files**
   - Download `.woff2` and `.woff` formats for these weights:
     - Light (300)
     - Regular (400)
     - Medium (500)
     - Semibold (600)
     - Bold (700)

### Setup Steps:

#### 1. Add Font Files

Place your font files in `src/assets/fonts/` with these names:
```
src/assets/fonts/
├── proximanova-light.woff2
├── proximanova-light.woff
├── proximanova-regular.woff2
├── proximanova-regular.woff
├── proximanova-medium.woff2
├── proximanova-medium.woff
├── proximanova-semibold.woff2
├── proximanova-semibold.woff
├── proximanova-bold.woff2
└── proximanova-bold.woff
```

**Note:** If your font files have different names, update the paths in `fonts.css` accordingly.

#### 2. Update HTML Template

Edit `src/_layouts/base.njk`:

**Replace this line:**
```html
<link rel="stylesheet" href="https://use.typekit.net/PROJECT_ID.css">
```

**With this:**
```html
<link rel="stylesheet" href="/assets/css/fonts.css">
```

#### 3. Update CSS Variables

Edit `src/assets/css/styles.css` (line 11):

**Change from:**
```css
--font-primary: 'proxima-nova', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**To:**
```css
--font-primary: 'Proxima Nova', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

#### 4. Test

```bash
npm start
```

Open browser DevTools → Network tab → Filter by "Font" to verify fonts are loading.

---

## Option 3: Free Alternative Fonts

If you want to avoid licensing costs, here are similar free alternatives:

### 1. **Inter** (Most Similar)
- Modern, clean, professional
- Free and open source
- Great for UI and body text
- [https://fonts.google.com/specimen/Inter](https://fonts.google.com/specimen/Inter)

**Setup:**
```html
<!-- In base.njk -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

```css
/* In styles.css */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### 2. **Montserrat**
- Geometric, clean
- Very popular
- Free from Google Fonts

### 3. **Work Sans**
- Similar structure to Proxima Nova
- Free and open source

### 4. **System Font Stack** (Fastest)
- Uses native OS fonts
- Zero loading time
- Different on Mac/Windows/Linux

```css
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
```

---

## Recommendation

**For your project, I recommend:**

1. **Best: Adobe Fonts CDN** (if you have subscription)
   - Proper licensing ✅
   - Easiest setup ✅
   - No performance concerns ✅

2. **Good: Self-hosted Proxima Nova** (if you buy license)
   - Full control
   - Faster potential (same origin)
   - Works offline

3. **Budget-friendly: Inter from Google Fonts**
   - Free
   - Very similar look
   - Easy setup
   - Google's CDN is very fast

---

## Performance Notes

### CDN Fonts (Adobe/Google):
- Cached across websites
- Optimized delivery
- External DNS lookup required

### Self-Hosted:
- Same-origin (slightly faster)
- Full cache control
- Increases your hosting bandwidth

**Verdict:** Performance difference is negligible. Choose based on licensing and convenience.

---

## Files Reference

- **Adobe Fonts setup:** `src/_layouts/base.njk` (line 9)
- **Self-hosted fonts:** `src/assets/css/fonts.css` (already created for you)
- **Font variables:** `src/assets/css/styles.css` (line 11)

---

## Need Help?

- **Adobe Fonts issues:** [Adobe Fonts Support](https://helpx.adobe.com/fonts.html)
- **Self-hosting questions:** Check your font license terms
- **Free alternatives:** All Google Fonts are free for any use

**Current status:** Your site is set up for Adobe Fonts CDN (recommended). Just add your project ID!
