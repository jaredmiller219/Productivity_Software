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
│   ├── NotesList.css       # Notes list styles with seamless theme transitions
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
├── Terminal.js              # Main terminal interface with multi-tab support
├── Terminal.css             # Terminal module styles with futuristic design
├── SimpleTerminal.js        # Simple terminal implementation
├── SimpleTerminal.css       # Simple terminal styles
├── components/              # Terminal components
│   ├── TerminalDisplay/    # Terminal output display
│   │   ├── TerminalDisplay.js    # Command output rendering
│   │   └── TerminalDisplay.css   # Display styles (no animations)
│   ├── TerminalInput/      # Command input handling
│   │   ├── TerminalInput.js      # Input component
│   │   └── TerminalInput.css     # Input styles
│   ├── TerminalHeader/     # Terminal header with stats
│   │   ├── TerminalHeader.js     # Header component
│   │   └── TerminalHeader.css    # Header styles
│   └── TerminalTabs/       # Multi-tab functionality
│       ├── TerminalTabs.js       # Tab management component
│       └── TerminalTabs.css      # Tab styles
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
├── IDE.css                 # IDE styles with futuristic design
├── components/             # IDE components
│   ├── IDEToolbar/        # IDE toolbar with search
│   │   ├── IDEToolbar.js  # Toolbar component with search functionality
│   │   └── IDEToolbar.css # Toolbar styles
│   ├── FileExplorer/      # File navigation system
│   │   ├── FileExplorer.js    # File tree component
│   │   └── FileExplorer.css   # Explorer styles
│   ├── SearchPanel/       # Advanced search functionality
│   │   ├── SearchPanel.js     # Search component
│   │   └── SearchPanel.css    # Search styles
│   ├── editor/            # Code editor components
│   ├── syntax/            # Syntax highlighting
│   ├── themes/            # Editor themes
│   └── plugins/           # IDE plugins
├── hooks/                 # IDE hooks
├── utils/                 # IDE utilities
├── constants/             # IDE constants
└── types/                 # IDE types
```

## 🌐 Browser Module (Enhanced)

```
modules/Browser/
├── Browser.js              # Main browser interface
├── Browser.css             # Browser styles with futuristic design
├── components/             # Browser components
│   ├── BrowserToolbar.js   # Navigation toolbar with URL input
│   ├── BrowserToolbar.css  # Toolbar styles
│   ├── BrowserTabs.js      # Tab management system
│   ├── BrowserTabs.css     # Tab styles
│   ├── BrowserSettings.js  # Browser settings panel
│   ├── BrowserSettings.css # Settings styles
│   ├── BrowserThemes.js    # Theme customization system
│   ├── BrowserThemes.css   # Theme editor styles
│   └── WebView/           # Web content display
├── hooks/                 # Browser hooks
├── utils/                 # Browser utilities
└── constants/             # Browser constants
```

## 🔧 Key Features by Module

### Notes Module

- **Advanced Search**: Multi-field search with filters, tags, categories, date ranges
- **Rich Text Editor**: Markdown support, formatting toolbar, keyboard shortcuts
- **Seamless Theme Support**: Light/dark mode toggle with instant transitions (no blinking)
- **Flexible Layout**: Main area or right panel positioning with context menus
- **Organization**: Search, sort, duplicate, and categorize notes
- **Enhanced UI**: Rounded corners, proper spacing, theme-specific button colors

### Terminal Module

- **Multi-Tab Support**: Multiple terminal instances with tab management
- **Clean Output**: No animations, customizable indentation
- **Command History**: Persistent command history and statistics
- **Header Stats**: Command count and uptime tracking
- **Welcome Messages**: Indented initial messages for better UX
- **Theme Controls**: Comprehensive theme customization with popup windows
- **Per-Tab Settings**: Individual font size, family, and color settings

### 3D Modeling Module

- **Professional UI**: Blender-like interface with menu bar and dropdown toolbar
- **Advanced Animation**: Keyframe timeline, curve editor, interpolation modes
- **Rigging System**: Armatures, bones, IK constraints, weight painting
- **Material System**: PBR materials, texture mapping, shader editor
- **Modifier Stack**: 50+ non-destructive modifiers
- **Viewport**: Multiple view modes, shading options, camera controls

### IDE Module

- **Code Editor**: Monaco-based editor with syntax highlighting
- **Advanced Search**: File and content search with dropdown/sidebar toggle options
- **Multi-language Support**: JavaScript, Python, C++, and more
- **Project Management**: Enhanced file explorer with visual flair and proper spacing
- **Debugging**: Integrated debugging tools
- **Modern UI**: Centered search bars, thin top bars, and improved button styling
- **Statistics Display**: Project stats in bottom status bar

### Browser Module

- **Web Browsing**: Full-featured web browser with modern interface
- **Tab Management**: Multiple tabs with navigation and close functionality
- **Theme System**: Comprehensive theme editor with predefined and custom themes
- **Settings Panel**: Advanced browser configuration options
- **Responsive Design**: Clean, futuristic UI with proper spacing
- **Loading States**: Visual feedback with stop/reload button transformations

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
- **Seamless Theme Transitions**: Instant theme switching without blinking or animations
- **Rounded Corner Design**: Consistent 12px border radius across all modules and sidebar
- **Perfect Alignment**: Sidebar and main content with matching spacing and margins
- **Responsive Design**: Adaptive layouts for different screen sizes
- **Professional Styling**: Clean, modern interface with consistent spacing
- **Futuristic Aesthetics**: Terminal-inspired design language throughout
- **Keyboard Shortcuts**: Comprehensive keyboard navigation support
- **Visual Feedback**: Proper loading states, hover effects, and interactive elements

This architecture ensures maintainability, scalability, and professional-grade code organization suitable for a comprehensive productivity suite with advanced search, seamless theming, layout flexibility, and modern UI/UX design principles.

## 🎯 Recent Enhancements

### UI/UX Improvements

- **Seamless Theme Transitions**: Eliminated blinking animations across all modules
- **Rounded Corner Design**: Consistent 12px border radius for modern appearance
- **Perfect Sidebar Alignment**: Matching margins and spacing with main content
- **Enhanced Button Styling**: Theme-specific colors and instant transitions

### Notes Module Enhancements

- **Theme-Specific Button Colors**: Light blue for light mode, green for dark mode
- **Search Bar Theming**: Proper white/dark background switching
- **Transition Removal**: No more blinking during theme changes

### Terminal Module Improvements

- **Multi-Tab Functionality**: Full tab management system
- **Theme Controls**: Comprehensive popup-based theme customization
- **Per-Tab Settings**: Individual customization options

### Browser Module Features

- **Theme System**: Advanced theme editor with custom color schemes
- **Loading States**: Dynamic button transformations during page loads
- **Settings Panel**: Comprehensive browser configuration

### IDE Module Enhancements

- **Search Interface**: Toggle between dropdown and sidebar modes
- **File Explorer**: Enhanced visual design with better spacing
- **Status Bar**: Project statistics display

### General Improvements

- **Consistent Spacing**: 8px margins across all modules
- **Futuristic Design**: Terminal-inspired aesthetic throughout
- **Performance**: Optimized rendering and reduced animations

## 🚀 Recent Major Enhancements (Latest Updates)

### Global State Management System

```
shared/hooks/useGlobalState.js    # Advanced persistent state management
```

**Features:**

- **Cross-Session Persistence**: All tab states preserved across app restarts
- **Environment-Aware**: Production vs development mode handling
- **Module State Tracking**: IDE files, Terminal history, Notes content, Browser tabs, 3D scenes
- **Smart State Recovery**: Automatic restoration of previous work sessions
- **Debug Controls**: Development-only state management tools

### Enhanced Core Application

```
core/components/
├── App.js                       # Updated with global state integration
└── App.css                      # State management dialog styling
```

**New Features:**

- **State Persistence Dialog**: Beautiful option-box confirmation system
- **Keyboard Shortcut Management**: Cmd+R prevention in production
- **Environment Detection**: Automatic production/development behavior
- **Progressive Dialog Styling**: Gradient-based confirmation dialogs

### Sidebar Enhancements

```
shared/components/
├── Sidebar.js                   # Enhanced with status controls
└── Sidebar.css                  # Status button styling
```

**Improvements:**

- **Status Toggle Button**: Sideways state persistence control at bottom
- **Development Module**: Debug terminal (dev-only)
- **Context Menu System**: Notes positioning controls
- **Visual Hierarchy**: Improved spacing and module organization

### IDE Module Major Updates

```
modules/IDE/
├── IDE.js                       # Keyboard shortcuts and persistence
├── components/
│   ├── FileExplorer/
│   │   ├── FileExplorer.js     # Smart context menus
│   │   └── FileExplorer.css    # Context menu positioning
│   └── CodeEditor/
│       └── CodeEditor.js       # File persistence and stats
└── hooks/
    └── useIDE.js               # localStorage integration
```

**New Capabilities:**

- **File Persistence**: All saved files preserved across sessions
- **Smart Context Menus**: File-aligned dropdown menus
- **Keyboard Shortcuts**: Cmd+S/Ctrl+S save support
- **Sequential Right-Click**: Switch between file menus seamlessly
- **Project Statistics**: Comprehensive file and project metrics

### Terminal Module Enhancements

```
modules/Terminal/components/
└── TerminalInput/
    ├── TerminalInput.js        # Enhanced input handling
    └── TerminalInput.css       # VSCode-style cursor effects
```

**Improvements:**

- **Enhanced Cursor**: 2px width with VSCode-style expand animation
- **Clean Focus States**: No border selection, cursor-only focus
- **Smooth Transitions**: 0.15s ease-out animations
- **Placeholder Handling**: Glow effects only on actual text

### Notes Module Updates

```
modules/Notes/components/
└── NotesList.css               # Search icon positioning
```

**Features:**

- **Search Icon Positioning**: Right-side internal positioning
- **Horizontal Text Flip**: 180-degree rotated search elements
- **Responsive Design**: Proper scaling across different panel sizes

### Cross-Platform Compatibility

- **Mac Support**: Cmd+S keyboard shortcuts
- **Windows/Linux**: Ctrl+S keyboard shortcuts
- **Environment Detection**: Automatic platform-specific behavior
- **Production Safety**: State persistence always enabled in builds

### Development vs Production Modes

**Development Mode:**

- Debug terminal module available
- State persistence toggleable
- Cmd+R refresh allowed
- Full debug controls accessible

**Production Mode:**

- State persistence always enabled
- Cmd+R refresh prevented (menu-only refresh)
- Debug features hidden
- Optimized for end-user experience
