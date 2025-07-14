# Dev Productivity Suite - Project Structure

This document outlines the comprehensive structure of the Dev Productivity Suite project, a professional-grade desktop application with advanced 3D modeling, IDE, and productivity tools.

## 🏗️ Root Directory

```
/
├── public/                    # Static assets and Electron main process
│   ├── electron.js           # Electron main process
│   ├── index.html            # HTML template
│   └── assets/               # Static images, icons, etc.
├── src/                      # Source code (organized by domain)
├── dist/                     # Built application files
├── scripts/                  # Build and utility scripts
├── package.json              # Dependencies and scripts
├── README.md                 # Project documentation
└── PROJECT_STRUCTURE.md      # This file
```

## 📁 Source Code Architecture (`src/`)

### Core Application Layer

```
src/
├── core/                     # Core application infrastructure
│   ├── components/           # Core UI components
│   │   ├── App.js           # Main application component
│   │   └── App.css          # Global application styles
│   ├── utils/               # Core utility functions
│   ├── hooks/               # Core React hooks
│   └── constants/           # Global constants
├── shared/                   # Shared components and utilities
│   ├── components/          # Reusable UI components
│   │   ├── Sidebar.js       # Main navigation sidebar
│   │   ├── Sidebar.css      # Sidebar styles
│   │   ├── Workspace.js     # Main workspace container
│   │   └── Workspace.css    # Workspace styles
│   ├── utils/               # Shared utility functions
│   ├── constants/           # Shared constants
│   └── types/               # TypeScript type definitions
└── modules/                 # Feature modules (domain-specific)
```

### Module Architecture

Each module follows a clean, domain-driven architecture:

```
modules/
├── ModuleName/              # Feature module (e.g., Modeling, IDE, Notes)
│   ├── ModuleName.js        # Main module component
│   ├── ModuleName.css       # Module-specific styles
│   ├── components/          # Module components organized by subdomain
│   │   ├── ui/             # UI components (toolbars, panels, etc.)
│   │   ├── [subdomain]/    # Domain-specific components
│   │   └── ...
│   ├── hooks/              # Module-specific React hooks
│   ├── utils/              # Module utility functions
│   │   ├── [subdomain]/    # Domain-specific utilities
│   │   └── ...
│   ├── constants/          # Module constants
│   └── types/              # Module type definitions
```

## 📝 Notes Module (Enhanced)

```
modules/Notes/
├── Notes.js                 # Main notes interface with theme support
├── Notes.css                # Notes module styles with dark/light themes
├── components/              # Notes components
│   ├── NotesList.js        # Notes list with search and sorting
│   ├── NotesList.css       # Notes list styles
│   ├── NoteEditor.js       # Rich text note editor
│   ├── NoteEditor.css      # Note editor styles
│   ├── NotesSearch.js      # Advanced search component
│   ├── NotesSearch.css     # Search component styles
│   ├── RichTextEditor.js   # Rich text editing with markdown
│   └── RichTextEditor.css  # Rich text editor styles
├── hooks/                  # Notes-specific hooks
│   ├── useNotes.js         # Main notes management hook
│   └── useNotesTheme.js    # Theme management hook
├── utils/                  # Notes utilities
└── constants/              # Notes constants
```

## ⚡ Terminal Module (Enhanced)

```
modules/Terminal/
├── SimpleTerminal.js        # Main terminal interface
├── SimpleTerminal.css       # Terminal module styles
├── components/              # Terminal components
│   ├── TerminalDisplay/    # Terminal output display
│   │   ├── TerminalDisplay.js    # Command output rendering
│   │   └── TerminalDisplay.css   # Display styles (no animations)
│   ├── TerminalInput/      # Command input handling
│   │   ├── TerminalInput.js      # Input component
│   │   └── TerminalInput.css     # Input styles
│   └── TerminalHeader/     # Terminal header with stats
│       ├── TerminalHeader.js     # Header component
│       └── TerminalHeader.css    # Header styles
├── hooks/                  # Terminal-specific hooks
│   └── useTerminal.js      # Terminal state management
├── utils/                  # Terminal utilities
│   └── commandProcessor.js # Command processing logic
└── constants/              # Terminal constants
```

## 🎨 3D Modeling Module (Advanced)

```
modules/Modeling/
├── Modeling.js              # Main 3D modeling interface
├── Modeling.css             # Modeling module styles
├── components/              # Modeling components by domain
│   ├── ui/                 # Core UI components
│   │   ├── BlenderMenuBar.js        # Professional menu bar
│   │   ├── ModelingToolbar.js       # Dropdown-based toolbar
│   │   ├── ModelingSidebar.js       # Properties sidebar
│   │   └── *.css                    # Component styles
│   ├── animation/          # Animation system components
│   │   ├── AnimationTimeline.js     # Keyframe timeline
│   │   ├── AnimationCurves.js       # Curve editor
│   │   └── *.css
│   ├── rigging/            # Rigging and armature components
│   │   ├── RiggingSystem.js         # Bone and constraint system
│   │   └── *.css
│   ├── materials/          # Material and shading components
│   │   ├── MaterialEditor.js        # PBR material editor
│   │   └── *.css
│   ├── modifiers/          # Modifier stack components
│   │   ├── ModifierStack.js         # Non-destructive modifiers
│   │   └── *.css
│   └── viewport/           # 3D viewport components
├── hooks/                  # Modeling-specific hooks
│   └── useModelingScene.js # Main 3D scene management
├── utils/                  # Modeling utilities by domain
│   ├── viewport/           # 3D rendering utilities
│   │   └── threeUtils.js   # Three.js utilities
│   ├── animation/          # Animation system utilities
│   │   └── animationUtils.js # Keyframe and interpolation
│   ├── rigging/            # Rigging system utilities
│   │   └── riggingUtils.js # Armature and bone management
│   └── materials/          # Material utilities
├── constants/              # Modeling constants
└── types/                  # Modeling type definitions
```

## 💻 IDE Module (Enhanced)

```
modules/IDE/
├── IDE.js                  # Main IDE interface
├── IDE.css                 # IDE styles
├── components/             # IDE components
│   ├── editor/            # Code editor components
│   ├── syntax/            # Syntax highlighting
│   ├── themes/            # Editor themes
│   ├── plugins/           # IDE plugins
│   └── IDEToolbar/        # IDE toolbar with search
│       ├── IDEToolbar.js  # Toolbar component with search functionality
│       └── IDEToolbar.css # Toolbar styles
├── hooks/                 # IDE hooks
├── utils/                 # IDE utilities
├── constants/             # IDE constants
└── types/                 # IDE types
```

## 🌐 Browser Module

```
modules/Browser/
├── Browser.js              # Main browser interface
├── Browser.css             # Browser styles
├── components/             # Browser components
│   ├── AddressBar/        # URL input and navigation
│   ├── TabManager/        # Tab management
│   └── WebView/           # Web content display
├── hooks/                 # Browser hooks
├── utils/                 # Browser utilities
└── constants/             # Browser constants
```

## 🔧 Key Features by Module

### Notes Module

- **Advanced Search**: Multi-field search with filters, tags, categories, date ranges
- **Rich Text Editor**: Markdown support, formatting toolbar, keyboard shortcuts
- **Theme Support**: Light/dark mode toggle
- **Flexible Layout**: Main area or right panel positioning
- **Organization**: Search, sort, duplicate, and categorize notes

### Terminal Module

- **Clean Output**: No animations, customizable indentation
- **Command History**: Persistent command history and statistics
- **Header Stats**: Command count and uptime tracking
- **Welcome Messages**: Indented initial messages for better UX

### 3D Modeling Module

- **Professional UI**: Blender-like interface with menu bar and dropdown toolbar
- **Advanced Animation**: Keyframe timeline, curve editor, interpolation modes
- **Rigging System**: Armatures, bones, IK constraints, weight painting
- **Material System**: PBR materials, texture mapping, shader editor
- **Modifier Stack**: 50+ non-destructive modifiers
- **Viewport**: Multiple view modes, shading options, camera controls

### IDE Module

- **Code Editor**: Monaco-based editor with syntax highlighting
- **Advanced Search**: File and content search with dropdown results
- **Multi-language Support**: JavaScript, Python, C++, and more
- **Project Management**: File explorer, search, and navigation
- **Debugging**: Integrated debugging tools

### Browser Module

- **Web Browsing**: Full-featured web browser
- **Tab Management**: Multiple tabs with navigation
- **Bookmarks**: Bookmark management and organization
- **Developer Tools**: Integrated web development tools

## 🛠️ Technology Stack

### Frontend

- **React 18+**: Modern React with hooks and concurrent features
- **Three.js**: Advanced 3D graphics and WebGL rendering
- **Monaco Editor**: VS Code editor component
- **CSS3**: Modern styling with CSS Grid and Flexbox

### Desktop

- **Electron**: Cross-platform desktop application framework
- **Node.js**: Backend services and file system access

### Build & Development

- **Create React App**: Development and build tooling
- **Electron Builder**: Desktop application packaging
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting

## 📦 Build System

### Development

```bash
npm start          # Start development server
npm run electron   # Start Electron in development
```

### Production

```bash
npm run build           # Build React application
npm run electron:build # Build Electron application (recommended)
npm run dist           # Create distribution packages
npm run cleanup        # Clean old builds and cache
```

### Build Scripts

```
scripts/
├── build-info.mjs      # Build system information
├── clean-build.mjs     # Clean build process
├── cleanup-space.mjs   # Cleanup utility
├── verify-build.mjs    # Build verification
└── notarize.cjs        # macOS notarization
```

### Output

```
dist/
├── mac-arm64/                    # macOS ARM64 build
│   └── Dev Productivity Suite.app
├── Dev Productivity Suite-0.1.0-arm64.dmg  # macOS installer
└── Dev Productivity Suite-0.1.0-arm64-mac.zip  # macOS archive
```

## 🎯 Architecture Principles

1. **Domain-Driven Design**: Modules organized by business domain
2. **Component Composition**: Reusable, composable UI components
3. **Separation of Concerns**: Clear separation between UI, logic, and data
4. **Performance**: Optimized rendering and memory management
5. **Accessibility**: WCAG-compliant UI with keyboard navigation
6. **Responsive Design**: Adaptive layouts for different screen sizes
7. **Professional Quality**: Industry-standard code organization and practices
8. **Theme Support**: Consistent light/dark mode across modules
9. **Flexible Layouts**: Adaptive UI for different panel configurations

## 🔄 Data Flow

1. **App.js** manages global application state and panel positioning
2. **Sidebar.js** handles module navigation with context menus
3. **Workspace.js** renders the active module with conditional layouts
4. **Module components** manage domain-specific state and themes
5. **Hooks** encapsulate complex logic and side effects
6. **Utils** provide pure functions and utilities

## 🎨 UI/UX Features

- **Flexible Panel System**: Notes can be positioned in main area, right panel, or hidden
- **Context Menus**: Right-click functionality for enhanced navigation
- **Theme Consistency**: Unified theming across all modules
- **Responsive Design**: Adaptive layouts for different screen sizes
- **Professional Styling**: Clean, modern interface with consistent spacing
- **Keyboard Shortcuts**: Comprehensive keyboard navigation support

This architecture ensures maintainability, scalability, and professional-grade code organization suitable for a comprehensive productivity suite with advanced search, theming, and layout flexibility.
