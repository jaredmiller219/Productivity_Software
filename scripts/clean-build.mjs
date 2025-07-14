#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧹 Cleaning up build artifacts and temporary files...');

// Function to get directory size
function getDirSize(dirPath) {
  try {
    const result = execSync(`du -sh "${dirPath}" 2>/dev/null | cut -f1`, { encoding: 'utf8' });
    return result.trim();
  } catch {
    return 'unknown';
  }
}

// Clean up dist directory but preserve the most recent build
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  const distSize = getDirSize(distPath);
  console.log(`📁 Current dist directory size: ${distSize}`);

  // Get all files and directories in dist
  const distContents = fs.readdirSync(distPath);
  const appDirs = distContents.filter(item => {
    const itemPath = path.join(distPath, item);
    return fs.statSync(itemPath).isDirectory() && item.includes('mac');
  });

  // Keep only the most recent app directory, remove others
  if (appDirs.length > 1) {
    const sortedDirs = appDirs.map(dir => ({
      name: dir,
      path: path.join(distPath, dir),
      mtime: fs.statSync(path.join(distPath, dir)).mtime
    })).sort((a, b) => b.mtime - a.mtime);

    // Keep the most recent, remove the rest
    for (let i = 1; i < sortedDirs.length; i++) {
      console.log(`Removing old build: ${sortedDirs[i].name}`);
      fs.rmSync(sortedDirs[i].path, { recursive: true, force: true });
    }
  }

  // Remove old zip and dmg files (keep only the most recent)
  const archives = distContents.filter(item =>
    item.endsWith('.zip') || item.endsWith('.dmg') || item.endsWith('.blockmap')
  );

  if (archives.length > 4) { // Keep 2 files (zip + dmg) + 2 blockmap files
    const sortedArchives = archives.map(file => ({
      name: file,
      path: path.join(distPath, file),
      mtime: fs.statSync(path.join(distPath, file)).mtime
    })).sort((a, b) => b.mtime - a.mtime);

    // Keep the 4 most recent files, remove the rest
    for (let i = 4; i < sortedArchives.length; i++) {
      console.log(`Removing old archive: ${sortedArchives[i].name}`);
      fs.rmSync(sortedArchives[i].path, { force: true });
    }
  }
}

// Clean up build directory (this gets regenerated anyway)
const buildPath = path.join(__dirname, '..', 'build');
if (fs.existsSync(buildPath)) {
  const buildSize = getDirSize(buildPath);
  console.log(`📁 Removing build directory (${buildSize})...`);
  fs.rmSync(buildPath, { recursive: true, force: true });
}

// Clean up node_modules/.cache
const cachePath = path.join(__dirname, '..', 'node_modules', '.cache');
if (fs.existsSync(cachePath)) {
  const cacheSize = getDirSize(cachePath);
  console.log(`📁 Removing node_modules cache (${cacheSize})...`);
  fs.rmSync(cachePath, { recursive: true, force: true });
}

// Clean up macOS temporary files and disk images
try {
  console.log('🧹 Cleaning up macOS temporary files...');

  // Eject any mounted disk images
  try {
    execSync('diskutil list | grep "disk image" | awk \'{print $1}\' | xargs -I {} diskutil eject {} 2>/dev/null || true', { stdio: 'pipe' });
  } catch (e) {
    // Ignore errors - this is best effort
  }

  // Clean up temporary DMG files
  try {
    execSync('find /private/var/folders -name "*.dmg" -user $(whoami) -delete 2>/dev/null || true', { stdio: 'pipe' });
    execSync('find /tmp -name "*.dmg" -user $(whoami) -delete 2>/dev/null || true', { stdio: 'pipe' });
    execSync('find /private/var/folders -name "*electron*" -user $(whoami) -type d -exec rm -rf {} + 2>/dev/null || true', { stdio: 'pipe' });
  } catch (e) {
    // Ignore errors - this is best effort
  }

  console.log('🧹 Temporary files cleaned');
} catch (error) {
  console.log('Note: Some cleanup operations may require additional permissions');
}

// Show final sizes
console.log('\n📊 Final directory sizes:');
if (fs.existsSync(distPath)) {
  console.log(`   dist: ${getDirSize(distPath)}`);
}
if (fs.existsSync(path.join(__dirname, '..', 'node_modules'))) {
  console.log(`   node_modules: ${getDirSize(path.join(__dirname, '..', 'node_modules'))}`);
}

console.log('✅ Cleanup completed!');
