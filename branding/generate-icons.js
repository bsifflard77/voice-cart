/**
 * VoiceCartz Icon Generator
 *
 * Generates all required icon sizes from the master SVG
 *
 * Usage: node branding/generate-icons.js
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Icon sizes needed for PWA/App
const SIZES = [
  1024, // App Store
  512,  // Android high-res
  384,  // PWA large
  192,  // PWA standard
  152,  // iOS iPad
  144,  // Windows tile
  128,  // Standard
  96,   // Medium
  72,   // Small
  64,   // Favicon
  32,   // Small favicon
  16    // Tiny favicon
];

const SOURCE_SVG = path.join(__dirname, 'icons', 'voicecartz-icon.svg');
const OUTPUT_DIR = path.join(__dirname, 'icons');
const FRONTEND_ICONS_DIR = path.join(__dirname, '..', 'frontend', 'public', 'icons');

async function generateIcons() {
  console.log('🎨 VoiceCartz Icon Generator\n');

  // Check if source SVG exists
  try {
    await fs.access(SOURCE_SVG);
    console.log(`✅ Source SVG found: ${SOURCE_SVG}\n`);
  } catch (error) {
    console.error(`❌ Source SVG not found: ${SOURCE_SVG}`);
    process.exit(1);
  }

  // Ensure output directories exist
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(FRONTEND_ICONS_DIR, { recursive: true });

  console.log('Generating icon sizes:\n');

  // Generate each size
  for (const size of SIZES) {
    const filename = `icon-${size}x${size}.png`;
    const outputPath = path.join(OUTPUT_DIR, filename);
    const frontendPath = path.join(FRONTEND_ICONS_DIR, filename);

    try {
      // Generate PNG at specified size
      await sharp(SOURCE_SVG)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png({
          compressionLevel: 9,
          quality: 100
        })
        .toFile(outputPath);

      // Copy to frontend directory
      await fs.copyFile(outputPath, frontendPath);

      console.log(`✅ ${size}x${size} → ${filename}`);
    } catch (error) {
      console.error(`❌ Failed to generate ${size}x${size}:`, error.message);
    }
  }

  // Copy SVG to frontend as well
  const frontendSVG = path.join(FRONTEND_ICONS_DIR, 'icon.svg');
  await fs.copyFile(SOURCE_SVG, frontendSVG);
  console.log(`✅ SVG copied to frontend`);

  console.log('\n🎉 Icon generation complete!');
  console.log(`\n📁 Icons saved to:`);
  console.log(`   - ${OUTPUT_DIR}`);
  console.log(`   - ${FRONTEND_ICONS_DIR}`);
}

// Run the generator
generateIcons().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
