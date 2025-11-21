# FiveNine Optics - 11ty Static Site

A modern, responsive static website for FiveNine Optics built with Eleventy (11ty).

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Navigate to the project directory:
```bash
cd fivenine-site
```

2. Install dependencies (already done):
```bash
npm install
```

3. **Configure Adobe Fonts:**
   - Go to [Adobe Fonts](https://fonts.adobe.com/)
   - Create a new web project with Proxima Nova
   - Include these font weights: Light (300), Regular (400), Medium (500), Semibold (600), Bold (700)
   - Copy your project ID
   - Open `src/_layouts/base.njk` and replace `PROJECT_ID` with your actual Adobe Fonts project ID

### Development

Start the development server:
```bash
npm start
```

This will:
- Build the site
- Start a local server at http://localhost:8080
- Watch for changes and auto-reload

### Build for Production

Build the site for production:
```bash
npm run build
```

The compiled site will be in the `_site` directory.

### Clean Build Files

Remove the build directory:
```bash
npm run clean
```

## Project Structure

```
fivenine-site/
├── src/
│   ├── _includes/         # Reusable components
│   │   ├── header.njk
│   │   └── footer.njk
│   ├── _layouts/          # Page layouts
│   │   └── base.njk
│   ├── assets/            # Static assets
│   │   ├── css/
│   │   │   └── styles.css
│   │   ├── js/
│   │   └── images/
│   └── index.njk          # Homepage
├── .eleventy.js           # Eleventy configuration
├── package.json
└── README.md
```

## Required Images

The site expects the following images in `src/assets/images/`:

### Hero Section
- `hero-lens.jpg` - Main hero image showing optical lens technology

### Product Showcase (6 images)
- `lens-1.jpg` through `lens-6.jpg` - Product photos of optical lenses

### Team Section (3 images)
- `team-1.jpg`, `team-2.jpg`, `team-3.jpg` - Team member photos (circular crop recommended)

### About Section (2 images)
- `facility-1.jpg` - Manufacturing facility photo
- `facility-2.jpg` - Research laboratory photo

**Note:** Until you add these images, the site will show broken image placeholders. You can extract these from your original design files or use new photos.

## Typography

The site uses **Proxima Nova** from Adobe Fonts with the following weights:
- Light (300) - Hero text, body copy
- Regular (400) - Base text
- Medium (500) - Navigation, subheadings
- Semibold (600) - Headings
- Bold (700) - Logo

## Responsive Breakpoints

- Desktop: 1200px max-width container
- Tablet: < 768px
- Mobile: < 480px

## Features

✅ Fully responsive design
✅ Semantic HTML structure
✅ Accessible navigation with ARIA labels
✅ Mobile-friendly navigation menu
✅ Smooth scrolling
✅ Hover effects and transitions
✅ Optimized for SEO
✅ Fast build times with 11ty

## Customization

### Colors
Edit CSS custom properties in `src/assets/css/styles.css`:
```css
:root {
  --color-primary: #000000;
  --color-accent: #007AFF;
  /* etc. */
}
```

### Content
Edit the content in `src/index.njk` or create new pages in the `src/` directory.

### Navigation
Update navigation links in `src/_includes/header.njk`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

All rights reserved - FiveNine Optics

## Next Steps

1. ✅ Set up Adobe Fonts project ID
2. 📸 Add required images to `src/assets/images/`
3. ✏️ Customize content in `src/index.njk`
4. 🎨 Adjust colors/styling in `src/assets/css/styles.css`
5. 🚀 Deploy to your hosting platform (Netlify, Vercel, GitHub Pages, etc.)
