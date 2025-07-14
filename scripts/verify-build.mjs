#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Verifying build completeness...');

// Function to get directory size
function getDirSize(dirPath) {
  try {
    const result = execSync(`du -sh "${dirPath}" 2>/dev/null | cut -f1`, { encoding: 'utf8' });
    return result.trim();
  } catch {
    return 'not found';
  }
}

// Function to check if file exists and get size
function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const size = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`✅ ${description}: ${size}MB`);
    return true;
  } else {
    console.log(`❌ ${description}: Missing`);
    return false;
  }
}

// Check build artifacts
const projectRoot = path.join(__dirname, '..');
const distPath = path.join(projectRoot, 'dist');
const buildPath = path.join(projectRoot, 'build');

console.log('\n📦 Build Artifacts:');

// Check if dist directory exists and has content
if (fs.existsSync(distPath)) {
  console.log(`✅ dist directory: ${getDirSize(distPath)}`);
  
  // Check for specific build files
  const distContents = fs.readdirSync(distPath);
  const hasApp = distContents.some(item => item.includes('.app'));
  const hasZip = distContents.some(item => item.endsWith('.zip'));
  const hasDmg = distContents.some(item => item.endsWith('.dmg'));
  
  console.log(`   ${hasApp ? '✅' : '❌'} Application bundle (.app)`);
  console.log(`   ${hasZip ? '✅' : '❌'} ZIP distribution`);
  console.log(`   ${hasDmg ? '✅' : '❌'} DMG distribution`);
} else {
  console.log('❌ dist directory: Missing');
}

// Check build directory
if (fs.existsSync(buildPath)) {
  console.log(`✅ build directory: ${getDirSize(buildPath)}`);
  
  // Check for required files
  checkFile(path.join(buildPath, 'index.html'), 'React build index.html');
  checkFile(path.join(buildPath, 'electron.js'), 'Electron main process');
  checkFile(path.join(buildPath, 'preload.js'), 'Electron preload script');
  
  // Check for static assets
  const staticPath = path.join(buildPath, 'static');
  if (fs.existsSync(staticPath)) {
    console.log(`✅ Static assets: ${getDirSize(staticPath)}`);
  } else {
    console.log('❌ Static assets: Missing');
  }
} else {
  console.log('❌ build directory: Missing');
}

console.log('\n🧹 Cleanup Verification:');

// Check that old artifacts are gone
const shouldNotExist = [
  path.join(projectRoot, 'node_modules', '.cache'),
  path.join(projectRoot, '.cache'),
  path.join(projectRoot, 'npm-debug.log'),
  path.join(projectRoot, 'yarn-debug.log'),
  path.join(projectRoot, 'yarn-error.log'),
];

shouldNotExist.forEach(filePath => {
  const exists = fs.existsSync(filePath);
  const name = path.basename(filePath);
  console.log(`${exists ? '⚠️ ' : '✅'} ${name}: ${exists ? 'Still exists' : 'Cleaned'}`);
});

console.log('\n📊 Final Summary:');
console.log(`   Project size: ${getDirSize(projectRoot)}`);
console.log(`   Node modules: ${getDirSize(path.join(projectRoot, 'node_modules'))}`);

console.log('\n✅ Build verification completed!');
