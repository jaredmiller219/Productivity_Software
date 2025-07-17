import React, { useState } from 'react';
import './NotesMenuBar.css';

const NotesMenuBar = ({
  onCreateNote,
  onDeleteNote,
  onDuplicateNote,
  onExportNote,
  onImportNotes,
  onToggleTheme,
  onShowSearch,
  onShowSettings,
  onToggleFullscreen,
  currentNote,
  notesCount,
  theme
}) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({});

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
    action();
    setActiveMenu(null);
  };

  const closeMenu = () => {
    setActiveMenu(null);
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
      { label: 'New Note', action: onCreateNote, shortcut: 'Ctrl+N', icon: '📝' },
      { label: 'Duplicate Note', action: () => currentNote?.id && onDuplicateNote(currentNote.id), shortcut: 'Ctrl+D', icon: '📋', disabled: !currentNote?.id },
      { type: 'separator' },
      { label: 'Import Notes', action: onImportNotes, shortcut: 'Ctrl+O', icon: '📁' },
      { label: 'Export Note', action: () => currentNote?.id && onExportNote(currentNote), shortcut: 'Ctrl+E', icon: '💾', disabled: !currentNote?.id },
      { type: 'separator' },
      { label: 'Delete Note', action: () => currentNote?.id && onDeleteNote(currentNote.id), shortcut: 'Delete', icon: '🗑️', disabled: !currentNote?.id, danger: true }
    ],
    edit: [
      { label: 'Undo', action: () => document.execCommand('undo'), shortcut: 'Ctrl+Z', icon: '↶' },
      { label: 'Redo', action: () => document.execCommand('redo'), shortcut: 'Ctrl+Y', icon: '↷' },
      { type: 'separator' },
      { label: 'Cut', action: () => document.execCommand('cut'), shortcut: 'Ctrl+X', icon: '✂️' },
      { label: 'Copy', action: () => document.execCommand('copy'), shortcut: 'Ctrl+C', icon: '📋' },
      { label: 'Paste', action: () => document.execCommand('paste'), shortcut: 'Ctrl+V', icon: '📄' },
      { type: 'separator' },
      { label: 'Select All', action: () => document.execCommand('selectAll'), shortcut: 'Ctrl+A', icon: '🔘' },
      { label: 'Find', action: onShowSearch, shortcut: 'Ctrl+F', icon: '🔍' }
    ],
    view: [
      { label: 'Toggle Theme', action: onToggleTheme, shortcut: 'Ctrl+T', icon: theme === 'light' ? '🌙' : '☀️' },
      { label: 'Fullscreen', action: onToggleFullscreen, shortcut: 'F11', icon: '⛶' },
      { type: 'separator' },
      { label: 'Search Notes', action: onShowSearch, shortcut: 'Ctrl+Shift+F', icon: '🔍' },
      { label: 'Settings', action: onShowSettings, shortcut: 'Ctrl+,', icon: '⚙️' }
    ],
    help: [
      { label: 'Keyboard Shortcuts', action: () => alert('Keyboard shortcuts help coming soon!'), shortcut: 'F1', icon: '⌨️' },
      { label: 'About Notes', action: () => alert(`Notes App\n\nTotal Notes: ${notesCount}\nTheme: ${theme}`), icon: 'ℹ️' }
    ]
  };

  return (
    <div className="notes-menu-bar" onClick={(e) => e.stopPropagation()}>
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
      
      <div className="menu-info">
        <span className="notes-count">
          {notesCount === 1 ? '1 note' : `${notesCount} notes`}
        </span>
        <span className="theme-indicator">{theme === 'light' ? '☀️' : '🌙'}</span>
      </div>
    </div>
  );
};

export default NotesMenuBar;
