# Documentation Index

Complete documentation for the FiveNine Optics website project.

## Essential References

### 🎯 Start Here

1. **[Quick Start Guide](QUICK-START.md)**
   - Getting started with development
   - Installation and setup
   - Basic commands

2. **[AI to Web Conversion Reference](AI-TO-WEB-CONVERSION.md)** ⭐ **CRITICAL**
   - Font size conversion formulas
   - Line height calculations
   - Reference tables for all current styles
   - How to convert new design elements from Illustrator
   - **Read this before implementing any new designs**

3. **[Style Guide Instructions](STYLE-GUIDE-INSTRUCTIONS.md)** ⭐ **CRITICAL**
   - How to maintain the style guide
   - When and what to update
   - Complete workflow for design changes
   - **Follow this for every design modification**

## Design & Development

### Design Implementation

- **[AI-TO-WEB-CONVERSION.md](AI-TO-WEB-CONVERSION.md)**
  - Conversion formulas (AI uses 70% UI scaling)
  - Font size and line height calculations
  - Current conversion reference tables
  - Verification checklist

- **[DESIGN-UPDATES.md](DESIGN-UPDATES.md)**
  - Recent design changes
  - Update history
  - Change log

### Style Management

- **[STYLE-GUIDE-INSTRUCTIONS.md](STYLE-GUIDE-INSTRUCTIONS.md)**
  - Maintaining the style guide
  - Update workflow
  - Best practices
  - Examples

### Typography & Fonts

- **[FONT-SETUP.md](FONT-SETUP.md)**
  - Font configuration
  - Adobe Fonts CDN setup
  - Self-hosted fonts (if needed)

- **[FONT-FILES-README.md](FONT-FILES-README.md)**
  - Font files directory information
  - Naming conventions
  - Licensing notes

### Media & Assets

- **[IMAGE-REQUIREMENTS.md](IMAGE-REQUIREMENTS.md)**
  - Image specifications
  - Size requirements
  - Format guidelines

- **[MEDIA-SETUP-COMPLETE.md](MEDIA-SETUP-COMPLETE.md)**
  - Media configuration
  - Asset organization
  - Setup completion notes

## Quick Reference

### Most Used Documents

For daily development work, you'll primarily reference:

1. **AI-TO-WEB-CONVERSION.md** - Every time you implement a design
2. **STYLE-GUIDE-INSTRUCTIONS.md** - Every time you change CSS
3. **QUICK-START.md** - For development commands

### Critical Information

**Adobe Illustrator UI Scaling:** 70%
**Conversion Factor:** 0.70 (multiply all AI values by this)

**Font Size Conversion:**
```
Web px = AI px × 0.70
Web rem = (AI px × 0.70) ÷ 16
```

**Line Height Conversion:**
```
Ratio = AI Leading ÷ AI Font Size
CSS: line-height: [ratio];
```

## Document Organization

```
Documentation/
├── INDEX.md (this file)
│
├── Essential References
│   ├── AI-TO-WEB-CONVERSION.md ⭐
│   ├── STYLE-GUIDE-INSTRUCTIONS.md ⭐
│   └── QUICK-START.md
│
├── Design & Development
│   ├── DESIGN-UPDATES.md
│   ├── FONT-SETUP.md
│   └── FONT-FILES-README.md
│
└── Media & Assets
    ├── IMAGE-REQUIREMENTS.md
    └── MEDIA-SETUP-COMPLETE.md
```

## How to Use This Documentation

### When Starting a New Feature:
1. Read AI-TO-WEB-CONVERSION.md for conversion formulas
2. Implement the CSS with proper conversions
3. Follow STYLE-GUIDE-INSTRUCTIONS.md to update documentation

### When Fixing a Design Issue:
1. Check AI-TO-WEB-CONVERSION.md for correct conversion values
2. Verify calculations using the reference tables
3. Update style guide after fixing

### When Setting Up Development Environment:
1. Start with QUICK-START.md
2. Check FONT-SETUP.md for font configuration
3. Review IMAGE-REQUIREMENTS.md for asset specs

## Best Practices

1. **Always convert AI values** - Never use AI pixel values directly
2. **Always update the style guide** - Keep documentation in sync
3. **Document AI reference values** - Include original AI specs in CSS comments
4. **Test conversions** - Visually compare web to AI mockup

## Getting Help

### Common Issues:

**Fonts don't match AI:**
- Check AI-TO-WEB-CONVERSION.md for correct formula
- Verify 70% UI scaling is accounted for
- Confirm line height ratio is correct

**Style guide out of date:**
- See STYLE-GUIDE-INSTRUCTIONS.md for update workflow
- Always update style guide with CSS changes

**Development setup problems:**
- Check QUICK-START.md for setup instructions
- Verify Node.js and npm are installed

## Maintenance

### Keeping Documentation Current:

1. **After every design change:** Update AI-TO-WEB-CONVERSION.md if new patterns emerge
2. **After every CSS change:** Update STYLE-GUIDE-INSTRUCTIONS.md workflow if needed
3. **Add new sections:** Document new components or patterns as they're created
4. **Update this index:** Add new documents to the appropriate section

## Version History

- **2025-01-22:** Initial documentation organization
  - Created AI-TO-WEB-CONVERSION.md
  - Created STYLE-GUIDE-INSTRUCTIONS.md
  - Organized all .md files into Documentation folder
  - Created comprehensive index

## Notes

- All documentation uses Markdown format (.md)
- Code examples use syntax highlighting
- Tables are used for reference data
- Checklists are included for critical workflows

---

**Need to add a new document?**
Create the .md file in this folder and add it to this INDEX.md for discoverability.
