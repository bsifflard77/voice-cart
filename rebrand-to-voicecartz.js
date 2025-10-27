/**
 * VoiceCart → VoiceCartz Rebranding Script
 *
 * Updates all references from VoiceCart to VoiceCartz throughout the codebase
 *
 * Usage: node rebrand-to-voicecartz.js
 */

const fs = require('fs').promises;
const path = require('path');

// Files to update
const FILES_TO_UPDATE = [
  // Frontend
  'frontend/src/App.tsx',
  'frontend/src/components/Login.tsx',
  'frontend/src/components/Register.tsx',
  'frontend/package.json',

  // Backend
  'backend/src/server.js',
  'backend/package.json',
  'backend/README.md',

  // Root files
  'README.md',
  'TRACKING.md',
  'DEPLOYMENT-STRATEGY.md',
  'RAILWAY-DEPLOYMENT-GUIDE.md',
  'QUICK-START.md',

  // Documentation
  'docs/TECHNICAL-DOCS.md',
  'docs/USER-GUIDE.md',
  'docs/HOSTING-OPTIONS.md',
  'docs/SESSION-SUMMARY-2025-10-26.md',
];

// Replacement pairs
const REPLACEMENTS = [
  { from: /VoiceCart/g, to: 'VoiceCartz' },
  { from: /voiceCart/g, to: 'voiceCartz' },
  { from: /voicecart/g, to: 'voicecartz' },
  { from: /voice-cart/g, to: 'voicecartz' },
];

async function updateFile(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);

    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch {
      console.log(`⏭️  Skipping ${filePath} (doesn't exist)`);
      return;
    }

    // Read file
    let content = await fs.readFile(fullPath, 'utf8');
    let updated = false;

    // Apply all replacements
    for (const { from, to } of REPLACEMENTS) {
      if (from.test(content)) {
        content = content.replace(from, to);
        updated = true;
      }
    }

    if (updated) {
      // Write updated content
      await fs.writeFile(fullPath, content, 'utf8');
      console.log(`✅ Updated ${filePath}`);
    } else {
      console.log(`⏭️  No changes needed in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

async function rebrand() {
  console.log('🎨 VoiceCart → VoiceCartz Rebranding\n');
  console.log('Updating files...\n');

  for (const file of FILES_TO_UPDATE) {
    await updateFile(file);
  }

  console.log('\n🎉 Rebranding complete!');
  console.log('\nNext steps:');
  console.log('1. Test the app: cd frontend && npm run dev');
  console.log('2. Test the backend: cd backend && npm run dev');
  console.log('3. Review changes: git diff');
  console.log('4. Commit: git add . && git commit -m "Rebrand to VoiceCartz"');
}

rebrand().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
