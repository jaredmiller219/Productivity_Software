import React, { useState, useRef } from 'react';
import './IDEMenuBar.css';

const IDEMenuBar = ({
  onNewFile,
  onOpenFile,
  onSaveFile,
  onSaveAsFile,
  onCloseFile,
  onUndo,
  onRedo,
  onCut,
  onCopy,
  onPaste,
  onFind,
  onReplace,
  onRevert,
  onSearch,
  onToggleSearch,
  onToggleFileExplorer,
  onToggleTerminal,
  onToggleFullscreen,
  onShowSettings,
  onRunCode,
  onDebugCode,
  activeFile,
  projectStats,
  theme,
  isSearchVisible
}) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleMenuClick = (menuName, event) => {
    if (activeMenu === menuName) {
      setActiveMenu(null);
      setDropdownPosition({});
    } else {
      setActiveMenu(menuName);

      // Calculate dropdown position to keep it in viewport
      const buttonRect = event.currentTarget.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const dropdownWidth = 280; // max-width from CSS

      let position = {};

      // Check if dropdown would go off the right edge
      if (buttonRect.left + dropdownWidth > viewportWidth - 20) {
        position.right = 0;
        position.left = 'auto';
      } else {
        position.left = 0;
        position.right = 'auto';
      }

      // For mobile, center the dropdown
      if (viewportWidth <= 480) {
        position.left = '50%';
        position.right = 'auto';
        position.transform = 'translateX(-50%)';
      }

      setDropdownPosition({ [menuName]: position });
    }
  };

  const handleMenuItemClick = (action) => {
    if (action) {
      action();
    }
    setActiveMenu(null);
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  // Search handlers
  const handleSearch = (query, openPanel = false) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    if (onSearch) {
      const results = onSearch(query);
      setSearchResults(results);
      setShowSearchResults(results.length > 0 && !openPanel);

      // Only open the search panel if explicitly requested
      if (openPanel && results.length > 0 && onToggleSearch && !isSearchVisible) {
        onToggleSearch();
      }
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debounced search - search as user types (with a small delay)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
    }, 300);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      handleSearch(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleToggleSearchPanel = () => {
    if (onToggleSearch) {
      // Always toggle the search panel regardless of current state
      onToggleSearch();

      // If we're opening the panel and have a search query, perform the search
      if (!isSearchVisible && searchQuery.trim()) {
        handleSearch(searchQuery, true);
      }

      // Hide dropdown when opening the panel
      if (!isSearchVisible) {
        setShowSearchResults(false);
      }
    }
  };

  const handleResultClick = (result) => {
    // Hide the dropdown
    setShowSearchResults(false);

    // You could add logic here to jump to the specific line in the file
    // For now, we'll just open the search panel with the current query
    handleSearch(searchQuery, true);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (activeMenu) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenu]);

  const menuItems = {
    file: [
      { label: 'New File', action: onNewFile, shortcut: 'Ctrl+N', icon: '📄' },
      { label: 'Open File', action: onOpenFile, shortcut: 'Ctrl+O', icon: '📁' },
      { type: 'separator' },
      { label: 'Save', action: onSaveFile, shortcut: 'Ctrl+S', icon: '💾', disabled: !activeFile },
      { label: 'Save As...', action: onSaveAsFile, shortcut: 'Ctrl+Shift+S', icon: '💾', disabled: !activeFile },
      { type: 'separator' },
      { label: 'Close File', action: onCloseFile, shortcut: 'Ctrl+W', icon: '✕', disabled: !activeFile }
    ],
    edit: [
      { label: 'Undo', action: onUndo, shortcut: 'Ctrl+Z', icon: '↩️' },
      { label: 'Redo', action: onRedo, shortcut: 'Ctrl+Y', icon: '↪️' },
      { type: 'separator' },
      { label: 'Cut', action: onCut, shortcut: 'Ctrl+X', icon: '✂️' },
      { label: 'Copy', action: onCopy, shortcut: 'Ctrl+C', icon: '📋' },
      { label: 'Paste', action: onPaste, shortcut: 'Ctrl+V', icon: '📄' },
      { type: 'separator' },
      { label: 'Revert File', action: onRevert, shortcut: 'Ctrl+R', icon: '↶', disabled: !activeFile || !activeFile.isModified },
      { type: 'separator' },
      { label: 'Find', action: onFind, shortcut: 'Ctrl+F', icon: '🔍' },
      { label: 'Replace', action: onReplace, shortcut: 'Ctrl+H', icon: '🔄' }
    ],
    view: [
      { label: 'Toggle Search', action: onToggleSearch, shortcut: 'Ctrl+Shift+F', icon: '🔍' },
      { label: 'Toggle File Explorer', action: onToggleFileExplorer, shortcut: 'Ctrl+Shift+E', icon: '📁' },
      { label: 'Toggle Terminal', action: onToggleTerminal, shortcut: 'Ctrl+`', icon: '💻' },
      { type: 'separator' },
      { label: 'Fullscreen', action: onToggleFullscreen, shortcut: 'F11', icon: '⛶' },
      { type: 'separator' },
      { label: 'Settings', action: onShowSettings, shortcut: 'Ctrl+,', icon: '⚙️' }
    ],
    run: [
      { label: 'Run Code', action: onRunCode, shortcut: 'F5', icon: '▶️', disabled: !activeFile },
      { label: 'Debug Code', action: onDebugCode, shortcut: 'F9', icon: '🐛', disabled: !activeFile },
      { type: 'separator' },
      { label: 'Stop Execution', action: () => console.log('Stop execution'), shortcut: 'Shift+F5', icon: '⏹️' }
    ],
    help: [
      { label: 'Keyboard Shortcuts', action: () => alert('Keyboard shortcuts help coming soon!'), shortcut: 'F1', icon: '⌨️' },
      { label: 'About IDE', action: () => alert(`IDE\n\nFiles: ${projectStats?.totalFiles || 0}\nLines: ${projectStats?.totalLines || 0}`), icon: 'ℹ️' }
    ]
  };

  return (
    <div className="ide-menu-bar" onClick={(e) => e.stopPropagation()}>
      <div className="menu-items">
        {Object.entries(menuItems).map(([menuName, items]) => (
          <div key={menuName} className="menu-item">
            <button
              className={`menu-button ${activeMenu === menuName ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleMenuClick(menuName, e);
              }}
            >
              {menuName.charAt(0).toUpperCase() + menuName.slice(1)}
            </button>

            {activeMenu === menuName && (
              <div
                className="dropdown-menu"
                style={dropdownPosition[menuName] || {}}
              >
                {items.map((item, index) => {
                  if (item.type === 'separator') {
                    return <div key={index} className="menu-separator" />;
                  }

                  return (
                    <button
                      key={index}
                      className={`dropdown-item ${item.disabled ? 'disabled' : ''} ${item.danger ? 'danger' : ''}`}
                      onClick={() => !item.disabled && handleMenuItemClick(item.action)}
                      disabled={item.disabled}
                    >
                      <span className="item-icon">{item.icon}</span>
                      <span className="item-label">{item.label}</span>
                      {item.shortcut && (
                        <span className="item-shortcut">{item.shortcut}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Search bar in the center */}
      <div className="menu-search">
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search files, functions, variables..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchKeyDown}
            />
            <button
              className={`search-panel-toggle ${isSearchVisible ? 'active' : ''}`}
              onClick={handleToggleSearchPanel}
              title={isSearchVisible ? "Close search panel" : "Open detailed search panel"}
            >
              📋
            </button>
            {searchQuery && (
              <button
                className="search-clear"
                onClick={handleClearSearch}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search results dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="search-results-dropdown">
              <div className="search-results-header">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </div>
              {searchResults.slice(0, 5).map((result, index) => (
                <div
                  key={index}
                  className="search-result-item"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="search-result-file">{result.file.name}</div>
                  <div className="search-result-line">Line {result.lineNumber}: {result.preview}</div>
                </div>
              ))}
              {searchResults.length > 5 && (
                <div className="search-results-more">
                  +{searchResults.length - 5} more results...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="menu-info">
        {activeFile && (
          <span className="active-file">
            📄 {activeFile.name}
          </span>
        )}
        <span className="project-stats">
          {projectStats?.totalFiles || 0} files
        </span>
      </div>
    </div>
  );
};

export default IDEMenuBar;
