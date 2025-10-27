# VoiceCartz Gradient Color Specifications

**Updated:** October 26, 2025

---

## Primary Gradient

The VoiceCartz brand uses a vibrant blue gradient that flows from deep blue to light cyan.

### Gradient Definition

**Direction:** Top-left to bottom-right (diagonal)

**Color Stops:**
```css
/* CSS Gradient */
background: linear-gradient(135deg, #0066FF 0%, #38BDF8 100%);

/* Alternative: Top to bottom */
background: linear-gradient(to bottom, #0066FF 0%, #38BDF8 100%);

/* Alternative: Left to right */
background: linear-gradient(to right, #0066FF 0%, #38BDF8 100%);
```

### Color Values

| Position | Color Name | Hex Code | RGB | Description |
|----------|------------|----------|-----|-------------|
| Start (0%) | Deep Blue | #0066FF | rgb(0, 102, 255) | Rich, vibrant blue |
| End (100%) | Light Cyan | #38BDF8 | rgb(56, 189, 248) | Bright, sky blue |

---

## CSS Implementation

### Background Gradient
```css
.voicecartz-gradient {
  background: linear-gradient(135deg, #0066FF 0%, #38BDF8 100%);
}
```

### Text Gradient
```css
.voicecartz-text-gradient {
  background: linear-gradient(135deg, #0066FF 0%, #38BDF8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### SVG Gradient
```svg
<defs>
  <linearGradient id="voicecartzGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#0066FF;stop-opacity:1" />
    <stop offset="100%" style="stop-color:#38BDF8;stop-opacity:1" />
  </linearGradient>
</defs>

<!-- Usage -->
<rect fill="url(#voicecartzGradient)" />
```

---

## Usage Guidelines

### Primary Uses
- ✅ App icon background (circular)
- ✅ Splash screens
- ✅ Hero sections on website
- ✅ Buttons and CTAs
- ✅ Loading screens
- ✅ Brand presentation backgrounds

### Secondary Uses
- ✅ Text highlights (gradient text)
- ✅ Borders and dividers
- ✅ Hover effects
- ✅ Progress indicators
- ✅ Notification badges

### Don't Use For
- ❌ Large blocks of body text
- ❌ Small icons (use solid color)
- ❌ Reversed/inverted scenarios

---

## Accessibility Notes

**Contrast Ratios:**
- Deep Blue (#0066FF) on white: 4.5:1 (AA compliant)
- Light Cyan (#38BDF8) on white: 2.5:1 (Use for accents only)
- White text on gradient: 4.5:1+ (Excellent)

**Recommendations:**
- Always use white or very light text over the gradient
- For small text, use the darker blue (#0066FF) solid
- Test gradient visibility on different screen types

---

## Brand Identity Update

### Updated Tagline
**New:** "Talk. Shop. Done."
**Previous:** "Talk. Shop. Done."

**Rationale:** "Talk" is more conversational and natural than "Speak"

### Icon Background
- Circular shape
- Gradient fill (deep blue to light cyan)
- White cart and sound wave elements
- Maintains excellent contrast

---

## Tailwind CSS Configuration

Add to `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        'voicecartz-gradient': 'linear-gradient(135deg, #0066FF 0%, #38BDF8 100%)',
      },
      colors: {
        'voicecartz': {
          'blue-deep': '#0066FF',
          'blue-light': '#38BDF8',
          'blue-mid': '#1E90FF', // Midpoint color
        }
      }
    }
  }
}
```

Usage:
```jsx
<div className="bg-voicecartz-gradient">
  VoiceCartz
</div>
```

---

## React/React Native

```jsx
// React with styled-components
const GradientBackground = styled.div`
  background: linear-gradient(135deg, #0066FF 0%, #38BDF8 100%);
`;

// React Native
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={['#0066FF', '#38BDF8']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.gradient}
/>
```

---

## Figma/Design Tools

**Linear Gradient Settings:**
- Type: Linear
- Angle: 135° (or -45°)
- Color 1: #0066FF at 0%
- Color 2: #38BDF8 at 100%
- Opacity: 100% both stops

---

## Print Colors (CMYK Approximation)

| Color | CMYK Values | Pantone Closest Match |
|-------|-------------|----------------------|
| Deep Blue (#0066FF) | C:100, M:60, Y:0, K:0 | Pantone 2728 C |
| Light Cyan (#38BDF8) | C:70, M:15, Y:0, K:0 | Pantone 298 C |

**Note:** Always test print colors before production

---

## Color Variations

### Lighter Version (for backgrounds)
```css
background: linear-gradient(135deg, #3385FF 0%, #60D0FF 100%);
opacity: 0.5;
```

### Darker Version (for emphasis)
```css
background: linear-gradient(135deg, #0052CC 0%, #0EA5E9 100%);
```

### Monochrome Version (accessibility mode)
```css
background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%);
```

---

## Animation Examples

### Animated Gradient
```css
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animated-gradient {
  background: linear-gradient(135deg, #0066FF, #38BDF8, #0066FF);
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
```

---

**Version:** 2.0
**Date:** October 26, 2025
**Status:** ✅ Approved for use
