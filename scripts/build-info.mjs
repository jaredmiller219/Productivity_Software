#!/usr/bin/env node

console.log(`
🚀 Productivity Suite Build System
==================================

📋 Available Build Commands:

🔥 npm run electron:build
   → Complete clean build (RECOMMENDED)
   → Removes ALL previous builds and temp files
   → Builds fresh React app
   → Packages Electron app
   → Creates ZIP and DMG distributions
   → Verifies build completeness

🧹 npm run cleanup
   → Quick cleanup of old builds and cache
   → Keeps most recent build
   → Frees up disk space

🔍 npm run electron:build:verify
   → Verifies existing build without rebuilding
   → Checks all required files are present

⚡ npm run electron:build:dirty
   → Fast build without cleanup (for development)
   → Keeps existing files
   → Only use when testing

📊 What gets cleaned during build:
   ✅ Entire dist/ directory (all previous builds)
   ✅ build/ directory (React build output)
   ✅ node_modules/.cache (build cache)
   ✅ System temporary files
   ✅ Electron artifacts
   ✅ Log files and debug artifacts

🎯 What gets created:
   ✅ Fresh React production build
   ✅ Electron application bundle (.app)
   ✅ ZIP distribution file
   ✅ DMG installer
   ✅ Verification report

💡 Tips:
   • Always use 'npm run electron:build' for releases
   • Use 'npm run cleanup' to free space between builds
   • Check verification output for any issues
   • Build artifacts are in dist/ directory

`);
