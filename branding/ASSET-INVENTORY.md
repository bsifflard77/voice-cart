# VoiceCartz Asset Inventory

**Date Created:** October 26, 2025
**Source:** AI-generated logo designs

---

## 🎨 Original Logo Files Provided

### Image 1: Circular Icon (Blue Background)
- **Filename:** voicecartz-icon-circle-blue.png
- **Description:** Shopping cart with sound waves inside blue circle
- **Text:** "VoiceCartz" below icon in dark text
- **Background:** Blue gradient circle (#0EA5E9 to lighter blue)
- **Icon Elements:** White shopping cart, white sound waves
- **Use Case:** Primary app icon
- **Size:** ~1000x1000px (to be confirmed)

### Image 2: Logo Variations Layout
- **Filename:** voicecartz-logo-variations.png
- **Description:** Four logo variations shown together
- **Includes:**
  1. Horizontal logo (light background)
  2. Horizontal logo with icon (top right)
  3. Vertical stacked logo (bottom left)
  4. Icon showcase with emojis (bottom right)
- **Use Case:** Brand presentation, design reference
- **Size:** ~1024x1024px composite

---

## 📋 Assets to Generate

### Required Icon Sizes (PNG)
- [ ] 1024x1024 - App Store, high-res
- [ ] 512x512 - Android high-res, web
- [ ] 192x192 - PWA standard
- [ ] 144x144 - Windows tiles
- [ ] 128x128 - Standard web
- [ ] 96x96 - Medium web
- [ ] 72x72 - Small devices
- [ ] 64x64 - Favicons
- [ ] 32x32 - Favicon
- [ ] 16x16 - Tiny favicon

### Logo Variations Needed
- [ ] Horizontal logo (icon + text) - SVG
- [ ] Horizontal logo (icon + text) - PNG
- [ ] Vertical logo (icon over text) - SVG
- [ ] Vertical logo (icon over text) - PNG
- [ ] Icon only (no text) - SVG
- [ ] Icon only (no text) - PNG all sizes

### Background Variations
- [ ] Transparent background (all icons)
- [ ] Blue circle background (current design)
- [ ] White background version
- [ ] Dark background version

---

## 🔄 Generation Process

### Step 1: Extract Source Images
✅ Save original logo files to `branding/source-files/`

### Step 2: Create Master SVG
- [ ] Recreate logo as vector in SVG format
- [ ] Ensure all elements are scalable
- [ ] Save as `voicecartz-icon.svg`

### Step 3: Generate All Sizes
- [ ] Use image processing to create all PNG sizes
- [ ] Maintain aspect ratio and quality
- [ ] Add to `branding/icons/` folder

### Step 4: Create Logo Variations
- [ ] Horizontal layout (icon + text)
- [ ] Vertical layout (icon over text)
- [ ] Text variations for different uses

### Step 5: Replace Old Assets
- [ ] Update `frontend/public/icons/` folder
- [ ] Update manifest.json
- [ ] Update browserconfig.xml
- [ ] Test all sizes

---

## 🎨 Design Specifications

### Icon Design
**Shopping Cart:**
- Simple cart outline
- Two wheels at bottom
- Basket/container shape
- Line weight: Medium (consistent)

**Sound Waves:**
- 7 vertical bars
- Centered above cart
- Varying heights (audio waveform pattern)
- Bars: Short-Medium-Tall-Tallest-Tall-Medium-Short

**Colors:**
- **Background Circle:** #0EA5E9 (Sky Blue)
- **Icon Elements:** #FFFFFF (White)
- **Text:** #1E293B (Dark slate)

### Typography
- **Font:** Inter Bold or similar
- **Text:** "VoiceCartz" (with capital V and C)
- **Size:** Proportional to icon
- **Color:** Dark on light, white on dark

---

## 📁 File Naming Convention

### Icons (Square, No Text)
```
icon-{size}.png
Examples:
- icon-1024x1024.png
- icon-512x512.png
- icon-192x192.png
```

### Logos (With Text)
```
logo-{variation}-{background}.{format}
Examples:
- logo-horizontal-light.svg
- logo-vertical-dark.png
- logo-icon-only-transparent.svg
```

### Source Files
```
voicecartz-{description}-{date}.{format}
Examples:
- voicecartz-original-20251026.png
- voicecartz-master-icon.svg
- voicecartz-design-variations.fig
```

---

## ✅ Quality Checklist

Before finalizing assets:
- [ ] All icons scale cleanly (no pixelation)
- [ ] Sound waves are visible at 72x72
- [ ] Cart shape is recognizable at small sizes
- [ ] Colors match brand palette exactly
- [ ] Transparent backgrounds have no artifacts
- [ ] Text is legible in all logo variations
- [ ] Icons work on light and dark backgrounds
- [ ] Files are optimized (smallest size without quality loss)

---

## 🔧 Tools Needed

### For Vector Creation:
- Figma (recommended - free)
- Adobe Illustrator
- Inkscape (free alternative)

### For Image Resizing:
- Node.js + Sharp library (automated)
- Online tools (manual)
- Photoshop (if available)

### For Optimization:
- ImageOptim (Mac)
- TinyPNG (online)
- Squoosh (web app)

---

## 📝 Next Steps

1. **Save Original Files**
   - Download/save the two logo images provided
   - Place in `branding/source-files/`

2. **Create Vector Version**
   - Recreate in SVG for perfect scaling
   - Or trace/vectorize existing images

3. **Generate All Sizes**
   - Use script or tool to batch generate
   - Test each size for quality

4. **Update App**
   - Replace all icon files in frontend
   - Update manifest and config files
   - Test in browser and on devices

5. **Update Documentation**
   - Replace screenshots with new branding
   - Update all text references
   - Change VoiceCart → VoiceCartz everywhere

---

**Status:** In Progress
**Priority:** High
**Assigned To:** Development Team
