# FiveNine Optics Website

Official website for FiveNine Optics - World leaders in designing and manufacturing IBS coatings.

## Quick Start

```bash
npm install
npm start
```

Visit: `http://localhost:8080`

## Documentation

All project documentation is located in the `/Documentation` folder:

- **[Quick Start Guide](Documentation/QUICK-START.md)** - Getting started with development
- **[AI to Web Conversion Reference](Documentation/AI-TO-WEB-CONVERSION.md)** - Essential conversion formulas for implementing designs
- **[Style Guide Instructions](Documentation/STYLE-GUIDE-INSTRUCTIONS.md)** - How to maintain the style guide
- **[Design Updates](Documentation/DESIGN-UPDATES.md)** - Recent design changes
- **[Font Setup](Documentation/FONT-SETUP.md)** - Font configuration details
- **[Image Requirements](Documentation/IMAGE-REQUIREMENTS.md)** - Image specifications
- **[Media Setup](Documentation/MEDIA-SETUP-COMPLETE.md)** - Media configuration

## Important Notes

### Adobe Illustrator UI Scaling
This project uses designs from Adobe Illustrator with **70% UI scaling**. All font sizes and spacing must be converted using a **0.70 multiplier**. See [AI-TO-WEB-CONVERSION.md](Documentation/AI-TO-WEB-CONVERSION.md) for details.

### Style Guide
View the live style guide at `/styleguide` when running the development server. **Always update the style guide** when making design changes. See [STYLE-GUIDE-INSTRUCTIONS.md](Documentation/STYLE-GUIDE-INSTRUCTIONS.md).

## Technology Stack

- **Static Site Generator:** Eleventy (11ty)
- **Template Engine:** Nunjucks
- **Carousel:** Swiper.js
- **Fonts:** Proxima Nova (Adobe Fonts CDN)

## Project Structure

```
fivenine-site/
├── src/
│   ├── _layouts/          # Page templates
│   ├── _includes/         # Reusable components
│   ├── assets/
│   │   ├── css/          # Stylesheets
│   │   ├── js/           # JavaScript
│   │   ├── images/       # Images
│   │   └── fonts/        # Font files (currently using CDN)
│   ├── index.njk         # Homepage
│   └── styleguide.njk    # Style guide page
├── _site/                # Built output (git ignored)
└── Documentation/        # All project documentation
```

## Development

```bash
npm start    # Start development server with hot reload
npm run build # Build for production
```

## Key Files

- **Main CSS:** `src/assets/css/styles.css`
- **Main JS:** `src/assets/js/main.js`
- **Style Guide:** `src/styleguide.njk`
- **Base Template:** `src/_layouts/base.njk`

## License

Copyright © FiveNine Optics. All rights reserved.
