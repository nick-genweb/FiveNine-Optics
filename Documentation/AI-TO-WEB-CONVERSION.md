# Adobe Illustrator to Web Conversion Reference

## Overview

This document provides the conversion formulas and reference values for converting design specifications from Adobe Illustrator to web CSS. This is necessary because of the 70% UI scaling setting in Adobe Illustrator.

## Critical Context

**Illustrator UI Scaling:** 70%
**Conversion Factor:** 0.70

When Illustrator is set to 70% UI scaling, all font sizes and leading values appear visually smaller on screen, but the actual pixel values remain the same. To make the web match what you see visually in Illustrator, we must apply the 0.70 conversion factor to both font sizes and leading values.

## Conversion Formula

### Font Size Conversion
```
Web Font Size (px) = AI Font Size (px) × 0.70
Web Font Size (rem) = (AI Font Size (px) × 0.70) ÷ 16
```

**Example:**
- AI shows: 30px
- Web should be: 30 × 0.70 = 21px = 1.3125rem

### Line Height Conversion

Line height in CSS should maintain the same **ratio** from AI, which automatically accounts for the 70% scaling:

```
AI Line Height Ratio = AI Leading (px) ÷ AI Font Size (px)
Web Line Height = Same ratio (unitless value in CSS)
```

**Example:**
- AI shows: 30px font, 37px leading
- Ratio: 37 ÷ 30 = 1.233
- Web CSS: `line-height: 1.233;`
- Actual web leading: 21px × 1.233 = 25.89px (which equals 37px × 0.70)

### Padding and Spacing Conversion

**CRITICAL:** All padding, margin, and spacing values must also use the 70% scaling factor.

```
Web Padding/Spacing (px) = AI Padding/Spacing (px) × 0.70
```

**Apply to CSS using calc():**
```css
.element {
  padding: calc(62px * 0.70) 0; /* 62px in AI becomes 43.4px on web */
  margin-bottom: calc(37px * 0.70); /* 37px in AI becomes 25.9px on web */
}
```

**Example:**
- AI shows: 62px top/bottom padding
- Web should be: `calc(62px * 0.70)` = 43.4px
- AI shows: 37px spacing between elements
- Web should be: `calc(37px * 0.70)` = 25.9px

**Why use calc():**
- Maintains clear reference to AI source values
- Makes it easy to update if design changes
- Self-documenting code

## Current Font Size Conversions

| Element | AI Size | Web Size (rem) | Web Size (px) |
|---------|---------|----------------|---------------|
| Navigation Text | 20.39px | 0.8922rem | 14.28px |
| Hero Main Text | 55px | 2.4063rem | 38.5px |
| H2 & H3 | 30px | 1.3125rem | 21px |
| Paragraph Text | 32px | 1.4rem | 22.4px |
| Compliance Text | 24px | 1.05rem | 16.8px |
| Industry Icon Titles | 33.6px | 1.47rem | 23.52px |
| Team Description | 53px | 2.3188rem | 37.1px |
| Team Hover/Modal Name | 42px | 1.8375rem | 29.4px |
| Modal Bio | 30px | 1.3125rem | 21px |
| Section Headings (Colored) | 27px | 1.1813rem | 18.9px |
| Carousel Captions | 21.6px | 0.945rem | 15.12px |

## Current Line Height Conversions

| Element | AI Font | AI Leading | Ratio | CSS Value |
|---------|---------|------------|-------|-----------|
| Hero Main Text | 55px | 66px | 1.2 | `line-height: 1.2;` |
| Paragraph Text | 32px | 41px | 1.28125 | `line-height: 1.28125;` |
| H2 & H3 | 30px | 36px | 1.2 | `line-height: 1.2;` |
| Team Description | 53px | 67px | 1.264 | `line-height: 1.264;` |
| Team Hover/Modal Name | 42px | 50.4px | 1.2 | `line-height: 1.2;` |
| Industry Icon Titles | 33.6px | 40.32px | 1.2 | `line-height: 1.2;` |
| Section Headings | 27px | 36px | 1.333 | `line-height: 1.333;` |
| Modal Bio | 30px | 37px | 1.233 | `line-height: 1.233;` |

## How to Use This Reference

### When Adding New Design Elements:

1. **Check AI Character Panel:**
   - Note the Font Size (e.g., 30px)
   - Note the Leading value (e.g., 37px)

2. **Check AI Layout/Spacing:**
   - Note padding values (e.g., 62px)
   - Note margin/spacing between elements (e.g., 37px)
   - Note gap values in grids/flexbox

3. **Calculate Font Size:**
   ```
   Web px = AI px × 0.70
   Web rem = Web px ÷ 16
   ```

4. **Calculate Line Height:**
   ```
   Ratio = AI Leading ÷ AI Font Size
   Use this ratio as unitless value in CSS
   ```

5. **Apply to CSS:**
   ```css
   .element {
     font-size: [calculated rem]rem; /* [calculated px]px (AI [original px]px × 0.70) */
     line-height: [calculated ratio]; /* [AI leading]px leading in AI */
     padding: calc([AI padding]px * 0.70); /* [AI padding]px in AI with 70% scaling */
     margin: calc([AI margin]px * 0.70); /* [AI margin]px in AI with 70% scaling */
   }
   ```

### Example Workflow:

**AI Specifications:**
- Font: Proxima Nova Medium
- Size: 40px
- Leading: 48px
- Top/Bottom Padding: 62px
- Spacing Between Elements: 37px

**Calculations:**
1. Font Size: 40 × 0.70 = 28px = 1.75rem
2. Line Height: 48 ÷ 40 = 1.2
3. Padding: 62px × 0.70 = use `calc(62px * 0.70)`
4. Spacing: 37px × 0.70 = use `calc(37px * 0.70)`

**CSS Output:**
```css
.new-element {
  font-family: var(--font-primary);
  font-size: 1.75rem; /* 28px (40px × 0.70) */
  font-weight: var(--font-medium);
  line-height: 1.2; /* 48px leading in AI */
  padding: calc(62px * 0.70) 0; /* 62px top/bottom in AI with 70% scaling */
  margin-bottom: calc(37px * 0.70); /* 37px spacing in AI with 70% scaling */
}
```

## Important Notes

1. **Always use the 0.70 multiplier** - This is non-negotiable due to the UI scaling setting and applies to ALL measurements
2. **Padding and spacing MUST be scaled** - Use `calc(value * 0.70)` for all padding, margin, gap, and spacing values
3. **Line height is a ratio, not a pixel value** - CSS will automatically calculate the actual leading
4. **Document AI values in comments** - Always include the original AI values in CSS comments for reference
5. **Use calc() for spacing values** - This maintains clarity and makes it easy to reference the original AI measurements
6. **Update the style guide** - See STYLE-GUIDE-INSTRUCTIONS.md for maintaining documentation

## Verification Checklist

When implementing new designs:

- [ ] Checked AI Character panel for exact font size
- [ ] Checked AI Character panel for exact leading value
- [ ] Checked AI for padding, margin, and spacing values
- [ ] Applied 0.70 conversion to font size
- [ ] Calculated line height ratio (leading ÷ font size)
- [ ] Applied 0.70 conversion to all padding/margin/spacing using calc()
- [ ] Added CSS with proper comments documenting AI values
- [ ] Updated style guide (see STYLE-GUIDE-INSTRUCTIONS.md)
- [ ] Visually compared web output to AI mockup

## Common Mistakes to Avoid

1. ❌ **DON'T** use AI pixel values directly without conversion for fonts, padding, or spacing
2. ❌ **DON'T** forget to convert line height values
3. ❌ **DON'T** use fixed pixel values for line height in CSS
4. ❌ **DON'T** forget to apply 70% scaling to padding, margins, and gaps
5. ❌ **DON'T** assume PPI or DPI settings affect text (they only affect raster effects)
6. ✅ **DO** always multiply AI sizes by 0.70 for ALL measurements (fonts, padding, spacing)
7. ✅ **DO** use calc() for padding/spacing to maintain AI reference values
8. ✅ **DO** use unitless line-height ratios
9. ✅ **DO** include AI reference values in CSS comments
10. ✅ **DO** update the style guide after changes

## Reference Files

- **CSS File:** `src/assets/css/styles.css`
- **Style Guide:** `src/styleguide.njk`
- **Style Guide Instructions:** `STYLE-GUIDE-INSTRUCTIONS.md`

## Questions?

If font sizes don't match between AI and web:
1. Verify Illustrator UI scaling is at 70%
2. Check that you're reading the Character panel values (not visual measurements)
3. Confirm you applied the 0.70 conversion to both font size and leading
4. Verify the line height ratio calculation

Last Updated: 2025-01-22
