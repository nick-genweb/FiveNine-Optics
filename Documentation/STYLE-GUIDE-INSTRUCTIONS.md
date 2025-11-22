# Style Guide Maintenance Instructions

## Overview

The style guide (`src/styleguide.njk`) is a living document that MUST be kept up-to-date with all design changes. This document provides instructions for maintaining the style guide.

## Critical Rule

**⚠️ ALWAYS UPDATE THE STYLE GUIDE WHEN MAKING DESIGN CHANGES ⚠️**

Any modification to typography, colors, spacing, or other design elements in the CSS MUST be immediately reflected in the style guide.

## Style Guide Location

**File:** `src/styleguide.njk`
**Web URL:** `/styleguide` (when server is running)

## What to Update in the Style Guide

### 1. Typography Changes

When you modify any font-related CSS properties, update the corresponding section in the style guide:

#### Font Size
```html
<div class="sg-spec">
  <span class="sg-spec-label">Font Size:</span>
  <span class="sg-spec-value">1.3125rem (21px)</span>
</div>
```

#### Font Weight
```html
<div class="sg-spec">
  <span class="sg-spec-label">Font Weight:</span>
  <span class="sg-spec-value">500 (Medium)</span>
</div>
```

#### Line Height
```html
<div class="sg-spec">
  <span class="sg-spec-label">Line Height:</span>
  <span class="sg-spec-value">1.233 (37px leading in AI)</span>
</div>
```

**Important:** Include the AI reference value in parentheses!

### 2. Color Changes

When adding or modifying colors:

```html
<div class="color-swatch">
  <div class="color-preview" style="background-color: #4B80EA;"></div>
  <div class="color-info">
    <div class="color-name">Blue</div>
    <div class="color-hex">#4B80EA</div>
    <div class="color-usage">Used for: Spotlight section heading, team section headings</div>
  </div>
</div>
```

### 3. Inline Styles for Examples

The style guide uses inline styles in examples to show visual representation. These must match the actual CSS:

```html
<!-- Example: Hero Main Text -->
<p style="font-size: 2.4063rem; font-weight: 500; line-height: 1.2; color: #ffffff; background: #000; padding: 2rem;">
  Trusted. Proven. World-leaders in designing and manufacturing IBS coatings.
</p>
```

## Complete Update Workflow

### When Adding a New Typography Style:

1. **Create the CSS** in `src/assets/css/styles.css`:
   ```css
   .new-element {
     font-size: 1.75rem; /* 28px (40px × 0.70) */
     font-weight: var(--font-medium);
     line-height: 1.2; /* 48px leading in AI */
     color: var(--color-text);
   }
   ```

2. **Add to Style Guide** in `src/styleguide.njk`:
   ```html
   <div class="sg-subsection">
     <div class="sg-label">New Element Description</div>
     <p style="font-size: 1.75rem; font-weight: 500; line-height: 1.2;">Sample text</p>
     <div class="sg-specs">
       <div class="sg-spec">
         <span class="sg-spec-label">Font Size:</span>
         <span class="sg-spec-value">1.75rem (28px)</span>
       </div>
       <div class="sg-spec">
         <span class="sg-spec-label">Font Weight:</span>
         <span class="sg-spec-value">500 (Medium)</span>
       </div>
       <div class="sg-spec">
         <span class="sg-spec-label">Line Height:</span>
         <span class="sg-spec-value">1.2 (48px leading in AI)</span>
       </div>
       <div class="sg-spec">
         <span class="sg-spec-label">Color:</span>
         <span class="sg-spec-value">#333333</span>
       </div>
     </div>
   </div>
   ```

### When Modifying an Existing Style:

1. **Update the CSS** in `src/assets/css/styles.css`
2. **Find the matching section** in `src/styleguide.njk`
3. **Update both:**
   - The inline style in the example element
   - The specification values in the `sg-specs` section

### When Adding a New Color:

1. **Add to CSS variables** (if applicable):
   ```css
   :root {
     --color-new: #FF5733;
   }
   ```

2. **Add to Style Guide** under Color Palette section:
   ```html
   <div class="color-swatch">
     <div class="color-preview" style="background-color: #FF5733;"></div>
     <div class="color-info">
       <div class="color-name">New Color Name</div>
       <div class="color-hex">#FF5733</div>
       <div class="color-usage">Used for: Description of where this color is used</div>
     </div>
   </div>
   ```

## Style Guide Structure

The style guide is organized into sections:

### 1. Typography Section
- Heading 1 (H1)
- Heading 2 (H2)
- Heading 3 (H3)
- Paragraph Text
- Hero Main Text
- Hero Compliance Text
- Section Headings (Colored)
- Navigation Text
- Industry Icon Titles
- Team Section - Description Text
- Team Member Hover Info (Desktop)
- Modal - Name & Title
- Modal - Bio Text

### 2. Color Palette Section
- Brand Colors
- Neutral Colors

### 3. Spacing Scale Section
- All spacing variables

### 4. Layout Section
- Container settings
- Transitions

### 5. Font Weights Section
- Visual examples of all weights

### 6. UI Components Section
- Navigation dots
- Section heading dots

## Checklist for Style Guide Updates

Use this checklist when making design changes:

- [ ] Updated CSS in `src/assets/css/styles.css`
- [ ] Found corresponding section in `src/styleguide.njk`
- [ ] Updated inline styles in example elements
- [ ] Updated specification values in `sg-specs` div
- [ ] Included AI reference values for font size and line height
- [ ] Tested style guide page loads without errors
- [ ] Visually verified example matches actual implementation
- [ ] Committed both CSS and style guide changes together

## Testing the Style Guide

After making changes:

1. **Start the development server** (if not running):
   ```bash
   npm start
   ```

2. **Navigate to the style guide:**
   ```
   http://localhost:8080/styleguide
   ```

3. **Verify:**
   - All examples render correctly
   - Specifications match the CSS
   - No broken styles or missing values
   - Examples visually match the actual implementation

## Common Sections to Update

### Most Frequently Updated:

1. **Typography** - Font sizes, weights, line heights
2. **Colors** - New brand colors, UI element colors
3. **Spacing** - If spacing scale changes

### Less Frequently Updated:

1. **Layout** - Container widths, etc.
2. **UI Components** - Specific component examples
3. **Font Weights** - Only if changing font family

## Best Practices

1. **Update Together:** Always update CSS and style guide in the same commit
2. **Include AI Values:** Always document the original AI specification values
3. **Use Inline Styles:** Style guide examples use inline styles to show exact values
4. **Be Descriptive:** Use clear labels and descriptions
5. **Test Before Commit:** Always view the style guide page before committing
6. **Document Usage:** Explain where colors and styles are used

## Example: Complete Update

**Scenario:** Changing paragraph text from 32px to 28px

### Step 1: Update CSS
```css
/* Before */
p {
  font-size: 2rem; /* 32px */
  line-height: 1.28125; /* 41px leading in AI */
}

/* After */
p {
  font-size: 1.4rem; /* 22.4px (32px × 0.70) */
  line-height: 1.28125; /* 41px leading in AI */
}
```

### Step 2: Update Style Guide
```html
<!-- Before -->
<div class="sg-spec">
  <span class="sg-spec-label">Font Size:</span>
  <span class="sg-spec-value">2rem (32px)</span>
</div>

<!-- After -->
<div class="sg-spec">
  <span class="sg-spec-label">Font Size:</span>
  <span class="sg-spec-value">1.4rem (22.4px)</span>
</div>
```

### Step 3: Update Inline Style Example
```html
<!-- Before -->
<p>Sample text...</p>

<!-- After (add/update inline style) -->
<p style="font-size: 1.4rem;">Sample text...</p>
```

## Troubleshooting

### Issue: Style guide doesn't match CSS
**Solution:** Search for the class name in both files and compare values

### Issue: Example doesn't render correctly
**Solution:** Check inline styles match CSS and verify there are no syntax errors

### Issue: New style not showing
**Solution:** Ensure you're viewing `/styleguide` URL and refresh with cache clear (Cmd+Shift+R)

## Reference Files

- **Style Guide Source:** `src/styleguide.njk`
- **Main CSS:** `src/assets/css/styles.css`
- **Conversion Reference:** `AI-TO-WEB-CONVERSION.md`

## Automation Note

The style guide is **manually maintained**. There is no automatic sync between CSS and the style guide. You must update both files when making changes.

## Questions?

If you're unsure what to update in the style guide:
1. Check if there's already a similar element documented
2. Follow the same structure and format
3. Include all relevant specifications (font-size, weight, line-height, color)
4. Test the page before committing

**Remember:** An out-of-date style guide is worse than no style guide. Keep it current!

Last Updated: 2025-01-22
