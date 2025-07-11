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

## 💻 IDE Module

```
modules/IDE/
├── IDE.js                  # Main IDE interface
├── IDE.css                 # IDE styles
├── components/             # IDE components
│   ├── editor/            # Code editor components
│   ├── syntax/            # Syntax highlighting
│   ├── themes/            # Editor themes
│   └── plugins/           # IDE plugins
├── hooks/                 # IDE hooks
├── utils/                 # IDE utilities
├── constants/             # IDE constants
└── types/                 # IDE types
```

## 📝 Other Modules

```
modules/
├── Notes/                 # Note-taking system
│   ├── Notes.js          # Rich text editor
│   ├── components/       # Note components
│   └── utils/            # Note utilities
├── Browser/              # Web browser
│   ├── Browser.js        # Browser interface
│   ├── components/       # Browser components
│   └── utils/            # Browser utilities
└── Terminal/             # Terminal emulator
    ├── SimpleTerminal.js # Terminal interface
    ├── components/       # Terminal components
    └── utils/            # Terminal utilities
```

## 🔧 Key Features by Module

### 3D Modeling Module

- **Professional UI**: Blender-like interface with menu bar and dropdown toolbar
- **Advanced Animation**: Keyframe timeline, curve editor, interpolation modes
- **Rigging System**: Armatures, bones, IK constraints, weight painting
- **Material System**: PBR materials, texture mapping, shader editor
- **Modifier Stack**: 50+ non-destructive modifiers
- **Viewport**: Multiple view modes, shading options, camera controls

### IDE Module

- **Code Editor**: Monaco-based editor with syntax highlighting
- **Multi-language Support**: JavaScript, Python, C++, and more
- **Project Management**: File explorer, search, and navigation
- **Debugging**: Integrated debugging tools
- **Extensions**: Plugin system for additional functionality

### Notes Module

- **Rich Text**: Advanced text editing with formatting
- **Organization**: Folders, tags, and search
- **Collaboration**: Real-time editing and sharing
- **Export**: Multiple export formats

### Browser Module

- **Web Browsing**: Full-featured web browser
- **Bookmarks**: Bookmark management and organization
- **History**: Browsing history and search
- **Developer Tools**: Integrated web development tools

### Terminal Module

- **Command Execution**: Full terminal emulator
- **Multiple Shells**: Support for various shell environments
- **Customization**: Themes and configuration options

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
npm run electron:build # Build Electron application
npm run dist           # Create distribution packages
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

## 🔄 Data Flow

1. **App.js** manages global application state
2. **Sidebar.js** handles module navigation
3. **Workspace.js** renders the active module
4. **Module components** manage domain-specific state
5. **Hooks** encapsulate complex logic and side effects
6. **Utils** provide pure functions and utilities

This architecture ensures maintainability, scalability, and professional-grade code organization suitable for a comprehensive productivity suite.
