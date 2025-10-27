
# Mobile Icon Integration

## iOS (Xcode)
- Drag the entire `AppIcon.appiconset` folder into `Assets.xcassets` in your Xcode project.
- Ensure `AppIcon` is selected as the App Icon set in your Target > General > App Icons and Launch Images.
- The set includes all required sizes plus the 1024 App Store icon. No transparency is used.

## Android (Android Studio)
- Copy the `android/` folders into your project `app/src/main/res/` (merge with existing mipmap folders).
- Legacy launchers are provided in: `mipmap-*/ic_launcher.png` and `ic_launcher_round.png`.
- Play Store icon in `android/play/ic_play_store_512.png`.
- Adaptive icons:
  - `android/adaptive/ic_background.png` and `ic_foreground.png` are 432x432.
  - XML templates in `mipmap-anydpi-v26/ic_launcher.xml` and `ic_launcher_round.xml` reference `@drawable/ic_background` and `@drawable/ic_foreground` — adjust paths if you place them under `drawable/`.
- If your project expects different resource names, rename files accordingly and update XML references.

## PWA (Web)
- You already have web icons and `manifest/manifest.json` in the pack.
- Use transparent + maskable sets for the best results on Android Chrome PWAs.

## Notes
- iOS and Android round the corners or mask icons at runtime; supply full-bleed squares (done here).
- Keep foreground graphics within safe padding (we used ~18%).
