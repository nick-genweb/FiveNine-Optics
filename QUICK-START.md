# Quick Start Guide

## ✅ What's Been Built

Your 11ty static site for FiveNine Optics is ready! Here's what's included:

### ✅ Complete Structure
- Fully responsive 11ty site with modern HTML5/CSS3
- Mobile-first design with hamburger navigation
- Semantic HTML for SEO and accessibility
- All sections from your original design

### ✅ Components
- Header with navigation (HOME, ABOUT, PRODUCTS, SERVICES, NEWS, CONTACT)
- Hero section with overlay text
- Introduction section
- Features grid (5 feature cards)
- Product showcase grid (6 products)
- Team section (3 team members)
- About section with text and facility images
- Footer with contact information

### ✅ Styling
- Complete CSS with Proxima Nova font integration
- Responsive breakpoints (desktop, tablet, mobile)
- Smooth transitions and hover effects
- Professional color scheme
- Mobile navigation toggle

## 🚀 Next Steps (In Order)

### 1. Configure Adobe Fonts (5 minutes)

1. Go to [Adobe Fonts](https://fonts.adobe.com/)
2. Sign in with your Adobe account
3. Create a new web project
4. Add **Proxima Nova** with weights: 300, 400, 500, 600, 700
5. Copy your project ID (looks like: `abc1def`)
6. Open `src/_layouts/base.njk`
7. Replace `PROJECT_ID` with your actual ID

**Example:**
```html
<!-- Before -->
<link rel="stylesheet" href="https://use.typekit.net/PROJECT_ID.css">

<!-- After -->
<link rel="stylesheet" href="https://use.typekit.net/abc1def.css">
```

### 2. Add Images (30-60 minutes)

See `IMAGE-REQUIREMENTS.md` for detailed specifications. You need:
- 1 hero image (`hero-lens.jpg`)
- 6 product images (`lens-1.jpg` through `lens-6.jpg`)
- 3 team photos (`team-1.jpg`, `team-2.jpg`, `team-3.jpg`)
- 2 facility images (`facility-1.jpg`, `facility-2.jpg`)

Place all images in `src/assets/images/`

**Quick tip:** You can use the original JPG from `ai2html-output/Five-Nine-Page-Artboard_1.jpg` as reference to extract/crop images if needed.

### 3. Test the Site

```bash
cd fivenine-site
npm start
```

Visit `http://localhost:8080` to see your site!

### 4. Customize Content (Optional)

Edit `src/index.njk` to:
- Update text content
- Change section headings
- Modify feature descriptions
- Update team member names and titles
- Adjust about section copy

### 5. Build for Production

```bash
npm run build
```

The production-ready site will be in the `_site` folder.

## 📁 Project Structure

```
fivenine-site/
├── src/
│   ├── _includes/
│   │   ├── header.njk          # Site header & nav
│   │   └── footer.njk          # Site footer
│   ├── _layouts/
│   │   └── base.njk            # Base HTML template
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css      # All styles
│   │   ├── js/
│   │   │   └── main.js         # Mobile nav & interactions
│   │   └── images/             # Add your images here
│   └── index.njk               # Homepage content
├── _site/                      # Generated site (after build)
├── .eleventy.js                # 11ty config
├── package.json                # Dependencies & scripts
└── README.md                   # Full documentation
```

## 🎨 Customization

### Colors
Edit CSS variables in `src/assets/css/styles.css` (lines 13-22):
```css
--color-primary: #000000;     /* Main black */
--color-accent: #007AFF;      /* Accent blue */
--color-bg: #ffffff;          /* Background */
```

### Typography
Font weights are already mapped to Proxima Nova:
- Light (300): Hero text, body copy
- Regular (400): Base text
- Medium (500): Navigation
- Semibold (600): Headings
- Bold (700): Logo

### Spacing
Adjust spacing variables in `src/assets/css/styles.css` (lines 24-29)

## 🔧 Available Commands

```bash
npm start       # Start dev server with live reload
npm run build   # Build for production
npm run clean   # Remove _site directory
```

## 📝 Content Notes

The site currently uses placeholder content extracted from your design. You should:
- Review all text for accuracy
- Add your actual company description
- Update team member information
- Customize feature descriptions
- Add real contact information

## 🌐 Deployment Options

Once ready, deploy to:
- **Netlify**: Drag & drop the `_site` folder
- **Vercel**: Connect your Git repo
- **GitHub Pages**: Push to gh-pages branch
- **Any static host**: Upload `_site` folder contents

## ❓ Need Help?

- Full documentation: See `README.md`
- Image specs: See `IMAGE-REQUIREMENTS.md`
- Issues: Check the 11ty docs at https://www.11ty.dev/

## ⚠️ Important Notes

1. **Don't commit `node_modules/` or `_site/`** - They're in `.gitignore`
2. **Images are required** - The site will show broken images until you add them
3. **Adobe Fonts is required** - Text will fall back to system fonts until configured
4. **Mobile menu requires JavaScript** - The `main.js` file handles mobile navigation

---

**Your site is ready to go!** Just add your Adobe Fonts project ID and images, then run `npm start` to see it in action.
