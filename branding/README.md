# VoiceCartz Assets Pack

This bundle contains all icons, vectors, and a sample PWA `manifest.json` for quick integration.

## Structure
```
/frontend/public/icons/
  voicecartz.ico
  /transparent/        # blue mark on transparent background (16–1024)
  /blue-circle/        # white mark on solid blue circle (16–1024)
  /gradient-circle/    # white mark on blue gradient circle (16–1024)
  /maskable/           # PWA maskable icons (192, 512, 1024)
/source/
  voicecartz-mark.svg
  voicecartz-mark-white.svg
/manifest/
  manifest.json
```

## How to Use (Web/PWA)
1. Copy `/frontend/public/icons/` into your project’s public assets folder.
2. Copy `/manifest/manifest.json` into your project and adjust paths if needed.
3. Link the manifest in your HTML `<head>`:
   <link rel="manifest" href="/manifest.json" />
   <link rel="icon" type="image/x-icon" href="/icons/voicecartz.ico" />
4. Make sure your server serves the manifest and icons from the correct paths.

## Notes
- Use **transparent** icons for web favicons and general UI.
- Use **blue-circle** or **gradient-circle** for app store listings and marketing visuals.
- Use **maskable** icons for Android PWAs (adaptive icons).

## Recommended Sizes in `manifest.json`
- 192x192 and 512x512 (standard)
- Maskable: 192x192 and 512x512

## Brand Colors
- Primary: #0EA5E9
- Deep Blue: #3B82F6
- White: #FFFFFF
