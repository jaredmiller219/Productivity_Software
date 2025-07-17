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
└── docs/                     # Documentation files
    ├── project_structure.md  # This file
    └── updates_changelog.md  # Feature updates and enhancements
```

## 📁 Source Code Architecture (`src/`)

### Core Application Layer

```
src/
├── core/                     # Core application infrastructure
│   ├── App.js               # Main application component
│   └── App.css              # Global application styles
├── shared/                   # Shared components and utilities
│   ├── components/          # Reusable UI components
│   │   ├── Sidebar.js       # Main navigation sidebar
│   │   ├── Sidebar.css      # Sidebar styles
│   │   ├── Workspace.js     # Main workspace container
│   │   └── Workspace.css    # Workspace styles
│   ├── hooks/               # Shared hooks
│   │   └── useGlobalState.js # Global state management
│   ├── utils/               # Shared utility functions
│   ├── constants/           # Shared constants
│   └── types/               # TypeScript type definitions
├── index.js                 # Application entry point
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

## 📝 Notes Module

```
modules/Notes/
├── Notes.js                 # Main notes interface with theme support
├── components/              # Notes components organized by subdomain
│   ├── editor/             # Note editing components
│   │   ├── NoteEditor.js   # Rich text note editor
│   │   ├── NoteEditor.css  # Note editor styles
│   │   ├── RichTextEditor.js # Rich text editing with markdown
│   │   └── RichTextEditor.css # Rich text editor styles
│   ├── list/               # Note list and management components
│   │   ├── NotesList.js    # Notes list with search and sorting
│   │   └── NotesList.css   # Notes list styles with seamless theme transitions
│   ├── search/             # Search functionality components
│   │   ├── NotesSearch.js  # Advanced search component
│   │   └── NotesSearch.css # Search component styles
│   └── sticky/             # Sticky notes components
│       ├── StickyNote.js   # Sticky note component
│       └── StickyNote.css  # Sticky note styles
├── hooks/                  # Notes-specific hooks
│   ├── useNotes.js         # Main notes management hook
│   └── useNotesTheme.js    # Theme management hook
└── styles/                 # Notes styling
    └── Notes.css           # Main notes styles with dark/light themes
```

## ⚡ Terminal Module

```
modules/Terminal/
├── Terminal.js              # Main terminal interface with multi-tab support
├── Terminal.css             # Terminal module styles with futuristic design
├── SimpleTerminal.js        # Simple terminal implementation
├── SimpleTerminal.css       # Simple terminal styles
├── RealTerminal.js          # Real system terminal implementation
├── TestTerminal.js          # Test terminal for development
├── components/              # Terminal components
│   ├── TabSettings/        # Per-tab settings components
│   │   ├── TabSettings.js  # Tab settings component
│   │   └── TabSettings.css # Tab settings styles
│   ├── TerminalAutocomplete/ # Command autocomplete functionality
│   │   ├── TerminalAutocomplete.js # Autocomplete component
│   │   └── TerminalAutocomplete.css # Autocomplete styles
│   ├── TerminalDisplay/    # Terminal output display
│   │   ├── TerminalDisplay.js # Command output rendering
│   │   └── TerminalDisplay.css # Display styles (no animations)
│   ├── TerminalHeader/     # Terminal header with stats
│   │   ├── TerminalHeader.js # Header component
│   │   └── TerminalHeader.css # Header styles
│   ├── TerminalInput/      # Command input handling
│   │   ├── TerminalInput.js # Input component
│   │   └── TerminalInput.css # Input styles
│   ├── TerminalSettings/   # Terminal configuration
│   │   ├── TerminalSettings.js # Settings component
│   │   └── TerminalSettings.css # Settings styles
│   ├── TerminalSplitPane/  # Split pane functionality
│   │   ├── TerminalSplitPane.js # Split pane component
│   │   └── TerminalSplitPane.css # Split pane styles
│   ├── TerminalThemes/     # Theme management components
│   │   ├── TerminalThemes.js # Theme management component
│   │   └── TerminalThemes.css # Theme styles
│   └── ThemeSelector/      # Theme selection interface
│       ├── ThemeSelector.js # Theme selector component
│       └── ThemeSelector.css # Theme selector styles
└── hooks/                  # Terminal-specific hooks
    └── useTerminal.js      # Terminal state management
```

## 🎨 3D Modeling Module

```
modules/Modeling/
├── Modeling.js              # Main 3D modeling interface
├── Modeling.css             # Modeling module styles
├── components/              # Modeling components by domain
│   ├── ui/                 # Core UI components
│   │   ├── BlenderMenuBar.js # Professional menu bar
│   │   ├── BlenderMenuBar.css # Menu bar styles
│   │   ├── ModelingSidebar.js # Properties sidebar
│   │   ├── ModelingSidebar.css # Sidebar styles
│   │   ├── ModelingToolbar.js # Dropdown-based toolbar
│   │   └── ModelingToolbar.css # Toolbar styles
│   ├── animation/          # Animation system components
│   │   ├── AnimationCurves.js # Curve editor
│   │   ├── AnimationCurves.css # Curve editor styles
│   │   ├── AnimationTimeline.js # Keyframe timeline
│   │   └── AnimationTimeline.css # Timeline styles
│   ├── materials/          # Material and shading components
│   │   ├── MaterialEditor.js # Basic material editor
│   │   ├── MaterialEditor.css # Material editor styles
│   │   ├── AdvancedMaterialEditor.js # Advanced PBR material editor
│   │   └── AdvancedMaterialEditor.css # Advanced editor styles
│   ├── modifiers/          # Modifier stack components
│   │   ├── ModifierStack.js # Basic modifier stack
│   │   ├── ModifierStack.css # Modifier stack styles
│   │   ├── EnhancedModifierStack.js # Enhanced non-destructive modifiers
│   │   └── EnhancedModifierStack.css # Enhanced modifier styles
│   ├── rigging/            # Rigging and armature components
│   │   ├── RiggingSystem.js # Bone and constraint system
│   │   └── RiggingSystem.css # Rigging system styles
│   └── viewport/           # 3D viewport components
│       ├── ViewportControls.js # 3D viewport controls
│       └── ViewportControls.css # Viewport control styles
├── hooks/                  # Modeling-specific hooks
│   └── useModelingScene.js # Main 3D scene management
└── utils/                  # Modeling utilities by domain
    ├── animation/          # Animation system utilities
    ├── rigging/            # Rigging system utilities
    └── viewport/           # 3D rendering utilities
```

## 💻 IDE Module

```
modules/IDE/
├── IDE.js                  # Main IDE interface with resize functionality
├── IDE.css                 # IDE styles with futuristic design and resize handles
├── components/             # IDE components
│   ├── AdvancedCodeEditor.js   # Advanced code editor implementation
│   ├── AdvancedCodeEditor.css  # Advanced editor styles
│   ├── DebugPanel.js          # Debug panel component
│   ├── IDEToolbar/            # IDE toolbar with search
│   │   ├── IDEToolbar.js      # Toolbar component with undo/redo buttons
│   │   └── IDEToolbar.css     # Toolbar styles with button styling
│   ├── FileExplorer/          # File navigation system with rename support
│   │   ├── FileExplorer.js    # File tree with double-click rename and context menus
│   │   └── FileExplorer.css   # Explorer styles with rename input styling
│   ├── CodeEditor/            # Code editor components
│   │   ├── CodeEditor.js      # Editor with undo/redo and header rename
│   │   └── CodeEditor.css     # Editor styles with rename input styling
│   └── SearchPanel/           # Advanced search functionality
│       ├── SearchPanel.js     # Search component
│       └── SearchPanel.css    # Search styles
└── hooks/                     # IDE hooks
    └── useIDE.js             # Enhanced with file rename functionality
```

## 🌐 Browser Module

```
modules/Browser/
├── Browser.js              # Main browser interface
├── components/             # Browser components organized by subdomain
│   ├── bookmarks/         # Bookmark management components
│   │   ├── BookmarksPanel.js # Bookmarks panel component
│   │   └── BookmarksPanel.css # Bookmarks panel styles
│   ├── content/           # Web content display components
│   │   ├── BrowserContent.js # Web content display component
│   │   └── BrowserContent.css # Content display styles
│   ├── navigation/        # Navigation and toolbar components
│   │   ├── BrowserTabs.js    # Tab management system
│   │   ├── BrowserTabs.css   # Tab styles
│   │   ├── BrowserToolbar.js # Navigation toolbar with URL input
│   │   └── BrowserToolbar.css # Toolbar styles
│   ├── settings/          # Browser settings components
│   │   ├── BrowserSettings.js # Browser settings panel
│   │   └── BrowserSettings.css # Settings styles
│   └── themes/            # Theme customization components
│       ├── BrowserThemes.js   # Theme customization system
│       └── BrowserThemes.css  # Theme editor styles
├── hooks/                 # Browser hooks
│   └── useBrowser.js      # Main browser state management
└── styles/                # Browser styling
    └── Browser.css        # Main browser styles with futuristic design
```

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

This architecture ensures maintainability, scalability, and professional-grade code organization suitable for a comprehensive productivity suite.

---

For detailed feature updates, enhancements, and implementation details, see [updates_changelog.md](./updates_changelog.md).
