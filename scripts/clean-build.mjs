#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧹 Performing complete cleanup before build...');
console.log('📦 This will remove ALL previous builds and temporary files');

// Function to get directory size
function getDirSize(dirPath) {
  try {
    const result = execSync(`du -sh "${dirPath}" 2>/dev/null | cut -f1`, { encoding: 'utf8' });
    return result.trim();
  } catch {
    return 'not found';
  }
}

// Function to safely remove directory
function safeRemove(dirPath, description) {
  if (fs.existsSync(dirPath)) {
    const size = getDirSize(dirPath);
    console.log(`🗑️  Removing ${description} (${size})...`);
    fs.rmSync(dirPath, { recursive: true, force: true });
    return true;
  }
  return false;
}

// COMPLETE CLEANUP - Remove ALL previous builds
const distPath = path.join(__dirname, '..', 'dist');
safeRemove(distPath, 'entire dist directory (all previous builds)');

// Remove build directory (gets regenerated)
const buildPath = path.join(__dirname, '..', 'build');
safeRemove(buildPath, 'build directory (React build output)');

// Clean up ALL caches and temporary files
const cachePath = path.join(__dirname, '..', 'node_modules', '.cache');
safeRemove(cachePath, 'node_modules cache');

// Clean up additional cache directories
const additionalCaches = [
  path.join(__dirname, '..', '.cache'),
  path.join(__dirname, '..', 'node_modules', '.vite'),
  path.join(__dirname, '..', 'node_modules', '.babel-cache'),
  path.join(__dirname, '..', 'node_modules', '.eslintcache'),
];

additionalCaches.forEach(cachePath => {
  safeRemove(cachePath, `cache directory: ${path.basename(cachePath)}`);
});

// Clean up system temporary files and electron artifacts
try {
  console.log('🧹 Cleaning system temporary files...');

  // Eject any mounted disk images (best effort)
  try {
    execSync('diskutil list | grep "disk image" | awk \'{print $1}\' | xargs -I {} diskutil eject {} 2>/dev/null || true', { stdio: 'pipe' });
  } catch (e) {
    // Ignore errors
  }

  // Clean up temporary files (best effort)
  const tempCleanupCommands = [
    'find /tmp -name "*electron*" -user $(whoami) -delete 2>/dev/null || true',
    'find /tmp -name "*.dmg" -user $(whoami) -delete 2>/dev/null || true',
    'find /private/var/folders -name "*electron*" -user $(whoami) -type d -exec rm -rf {} + 2>/dev/null || true',
    'find /private/var/folders -name "*.dmg" -user $(whoami) -delete 2>/dev/null || true',
    'find /private/var/folders -name "*react*" -user $(whoami) -type d -exec rm -rf {} + 2>/dev/null || true',
  ];

  tempCleanupCommands.forEach(cmd => {
    try {
      execSync(cmd, { stdio: 'pipe' });
    } catch (e) {
      // Ignore errors - best effort cleanup
    }
  });

  console.log('✅ System temporary files cleaned');
} catch (error) {
  console.log('⚠️  Some system cleanup operations may require additional permissions');
}

// Clean up any leftover files in project root
const projectRoot = path.join(__dirname, '..');
const leftoverFiles = [
  'npm-debug.log*',
  'yarn-debug.log*',
  'yarn-error.log*',
  '.DS_Store',
  'Thumbs.db',
  '*.tgz',
  '*.tar.gz'
];

leftoverFiles.forEach(pattern => {
  try {
    execSync(`find "${projectRoot}" -maxdepth 2 -name "${pattern}" -delete 2>/dev/null || true`, { stdio: 'pipe' });
  } catch (e) {
    // Ignore errors
  }
});

console.log('\n🎯 Complete cleanup finished!');
console.log('📊 All previous builds and temporary files removed');
console.log('🚀 Ready for fresh build...\n');
