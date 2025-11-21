# Fonts Directory

## Self-Hosted Fonts Setup

If you want to self-host your fonts instead of using Adobe Fonts CDN, place your font files here.

### Required Files for Proxima Nova:

```
proximanova-light.woff2
proximanova-light.woff
proximanova-regular.woff2
proximanova-regular.woff
proximanova-medium.woff2
proximanova-medium.woff
proximanova-semibold.woff2
proximanova-semibold.woff
proximanova-bold.woff2
proximanova-bold.woff
```

### File Naming Convention:

The naming should match what's in `src/assets/css/fonts.css`. If your font files have different names (e.g., `ProximaNova-Light.woff2`), you can either:

1. **Rename them** to match the expected names above, OR
2. **Update the paths** in `src/assets/css/fonts.css`

Example from fonts.css:
```css
@font-face {
  font-family: 'Proxima Nova';
  src: url('/assets/fonts/proximanova-light.woff2') format('woff2'),
       url('/assets/fonts/proximanova-light.woff') format('woff');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
```

### Important:

⚠️ Make sure you have the legal right to self-host these fonts. Adobe Fonts subscription does NOT include self-hosting rights for Proxima Nova.

### After Adding Fonts:

1. Update `src/_layouts/base.njk` to use `fonts.css` instead of Adobe Fonts
2. Run `npm start` to test
3. Check browser DevTools → Network → Font to verify they're loading

---

**Currently this directory is empty.** The site is configured to use Adobe Fonts CDN.
