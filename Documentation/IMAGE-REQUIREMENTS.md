# Image Requirements for FiveNine Optics Site

## Overview
All images should be placed in `src/assets/images/` directory. The site is designed to work best with high-quality, optimized images.

## Required Images

### 1. Hero Section
**Filename:** `hero-lens.jpg`
- **Subject:** Optical lens with dramatic lighting (similar to the original design)
- **Dimensions:** 1920x1080px minimum (16:9 ratio)
- **Format:** JPG
- **Quality:** High quality, compressed to < 500KB
- **Notes:** This image will be overlaid with dark opacity, so bright/light images work best

### 2. Product Showcase (6 images)
**Filenames:** `lens-1.jpg` through `lens-6.jpg`
- **Subject:** Individual optical lens products in various colors/styles
- **Dimensions:** 800x800px (1:1 square ratio)
- **Format:** JPG
- **Quality:** Medium-high, compressed to < 200KB each
- **Notes:** Images will be displayed in a grid, automatically cropped to square

### 3. Team Members (3 images)
**Filenames:** `team-1.jpg`, `team-2.jpg`, `team-3.jpg`
- **Subject:** Professional headshots of team members
- **Dimensions:** 400x400px minimum (1:1 square ratio)
- **Format:** JPG
- **Quality:** High quality, compressed to < 150KB each
- **Notes:** Images will be displayed as circles, so headshots should be centered

**Suggested Team Members (from design):**
- Dr. Sarah Chen - Chief Optical Engineer
- Dr. Michael Torres - Research Director
- Dr. Emily Wang - Quality Assurance Lead

### 4. About/Facility Images (2 images)
**Filenames:** `facility-1.jpg`, `facility-2.jpg`
- **Subject:**
  - `facility-1.jpg`: Manufacturing facility interior
  - `facility-2.jpg`: Research laboratory or quality control area
- **Dimensions:** 1200x800px minimum (3:2 ratio)
- **Format:** JPG
- **Quality:** High quality, compressed to < 400KB each
- **Notes:** These images showcase your company's facilities and capabilities

## Image Optimization Tips

1. **Resize images** to the recommended dimensions before uploading
2. **Compress images** using tools like:
   - [TinyPNG](https://tinypng.com/)
   - [ImageOptim](https://imageoptim.com/) (Mac)
   - [Squoosh](https://squoosh.app/) (Web)
3. **Use JPG format** for photographs
4. **Consider WebP format** for even better compression (requires updating HTML)

## Where to Source Images

### Option 1: Extract from Original Design
If you have the original Illustrator file or design assets, you can extract the images from there.

### Option 2: Photography
- Take professional photos of your actual products and facility
- Hire a photographer for team headshots

### Option 3: Stock Photos (Temporary)
For initial development, you can use stock photos:
- [Unsplash](https://unsplash.com/)
- [Pexels](https://pexels.com/)
- Search terms: "optical lens", "laboratory", "manufacturing facility", "professional headshot"

## Alternative: Create Placeholder Images

If you want to test the site before adding real images, you can create placeholder images at [Placeholder.com](https://placeholder.com/):

```bash
# Example URLs for placeholders:
# Hero: https://via.placeholder.com/1920x1080/000000/FFFFFF/?text=Hero+Image
# Product: https://via.placeholder.com/800x800/CCCCCC/333333/?text=Lens+1
# Team: https://via.placeholder.com/400x400/007AFF/FFFFFF/?text=Dr.+Chen
```

## Next Steps

1. Gather or create all required images
2. Optimize images for web
3. Rename files according to the naming convention above
4. Place all images in `src/assets/images/`
5. Run `npm start` to verify images display correctly
