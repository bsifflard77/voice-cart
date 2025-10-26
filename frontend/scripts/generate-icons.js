import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const svgPath = path.join(__dirname, '../public/icons/icon.svg')
const outputDir = path.join(__dirname, '../public/icons')

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// Read SVG file
const svgBuffer = fs.readFileSync(svgPath)

// Generate PNG icons
const promises = sizes.map(size => {
  const outputPath = path.join(outputDir, `icon-${size}x${size}.png`)

  return sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(outputPath)
    .then(() => console.log(`✓ Generated ${size}x${size} icon`))
    .catch(err => console.error(`✗ Failed to generate ${size}x${size} icon:`, err))
})

Promise.all(promises)
  .then(() => {
    console.log('\n✅ All icons generated successfully!')
  })
  .catch(err => {
    console.error('❌ Error generating icons:', err)
    process.exit(1)
  })
