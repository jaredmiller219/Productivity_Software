#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧹 Freeing up disk space from build artifacts...');

// Function to get directory size
function getDirSize(dirPath) {
  try {
    const result = execSync(`du -sh "${dirPath}" 2>/dev/null | cut -f1`, { encoding: 'utf8' });
    return result.trim();
  } catch {
    return 'not found';
  }
}

// Show current sizes
console.log('\n📊 Current directory sizes:');
const distPath = path.join(__dirname, '..', 'dist');
const buildPath = path.join(__dirname, '..', 'build');
const cachePath = path.join(__dirname, '..', 'node_modules', '.cache');

console.log(`   dist: ${getDirSize(distPath)}`);
console.log(`   build: ${getDirSize(buildPath)}`);
console.log(`   node_modules/.cache: ${getDirSize(cachePath)}`);

let totalFreed = 0;

// Remove all but the most recent dist files
if (fs.existsSync(distPath)) {
  const distContents = fs.readdirSync(distPath);
  
  // Remove all old builds except the most recent .app
  const appDirs = distContents.filter(item => {
    const itemPath = path.join(distPath, item);
    return fs.statSync(itemPath).isDirectory() && item.includes('mac');
  });
  
  if (appDirs.length > 1) {
    const sortedDirs = appDirs.map(dir => ({
      name: dir,
      path: path.join(distPath, dir),
      mtime: fs.statSync(path.join(distPath, dir)).mtime
    })).sort((a, b) => b.mtime - a.mtime);
    
    for (let i = 1; i < sortedDirs.length; i++) {
      console.log(`🗑️  Removing old build: ${sortedDirs[i].name}`);
      fs.rmSync(sortedDirs[i].path, { recursive: true, force: true });
    }
  }
  
  // Remove old archives (keep only the 2 most recent sets)
  const archives = distContents.filter(item => 
    item.endsWith('.zip') || item.endsWith('.dmg')
  ).map(file => ({
    name: file,
    path: path.join(distPath, file),
    mtime: fs.statSync(path.join(distPath, file)).mtime
  })).sort((a, b) => b.mtime - a.mtime);
  
  if (archives.length > 2) {
    for (let i = 2; i < archives.length; i++) {
      console.log(`🗑️  Removing old archive: ${archives[i].name}`);
      fs.rmSync(archives[i].path, { force: true });
    }
  }
  
  // Remove blockmap files for removed archives
  const blockmaps = distContents.filter(item => item.endsWith('.blockmap'));
  blockmaps.forEach(blockmap => {
    const baseFile = blockmap.replace('.blockmap', '');
    if (!fs.existsSync(path.join(distPath, baseFile))) {
      console.log(`🗑️  Removing orphaned blockmap: ${blockmap}`);
      fs.rmSync(path.join(distPath, blockmap), { force: true });
    }
  });
}

// Clean up cache
if (fs.existsSync(cachePath)) {
  console.log('🗑️  Removing node_modules cache...');
  fs.rmSync(cachePath, { recursive: true, force: true });
}

// Clean up temporary files
try {
  console.log('🧹 Cleaning temporary files...');
  execSync('find /tmp -name "*electron*" -user $(whoami) -delete 2>/dev/null || true', { stdio: 'pipe' });
  execSync('find /private/var/folders -name "*electron*" -user $(whoami) -type d -exec rm -rf {} + 2>/dev/null || true', { stdio: 'pipe' });
} catch (e) {
  // Ignore errors
}

// Show final sizes
console.log('\n📊 Final directory sizes:');
console.log(`   dist: ${getDirSize(distPath)}`);
console.log(`   build: ${getDirSize(buildPath)}`);
console.log(`   node_modules/.cache: ${getDirSize(cachePath)}`);

console.log('\n✅ Space cleanup completed!');
console.log('💡 Tip: Run "npm run cleanup" anytime to free up space');
