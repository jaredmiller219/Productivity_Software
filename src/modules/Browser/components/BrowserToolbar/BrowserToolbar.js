import React, { useState } from 'react';
import './BrowserToolbar.css';

const BrowserToolbar = ({
  url,
  currentUrl,
  isLoading,
  canGoBack,
  canGoForward,
  onUrlChange,
  onNavigate,
  onBack,
  onForward,
  onRefresh,
  onAddBookmark,
  onToggleBookmarks
}) => {
  const [isBookmarkDialogOpen, setIsBookmarkDialogOpen] = useState(false);
  const [bookmarkTitle, setBookmarkTitle] = useState('');

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    onNavigate(url);
  };

  const handleAddBookmark = () => {
    setBookmarkTitle(getPageTitle());
    setIsBookmarkDialogOpen(true);
  };

  const handleBookmarkSave = () => {
    if (bookmarkTitle.trim()) {
      onAddBookmark({
        title: bookmarkTitle.trim(),
        url: currentUrl,
        timestamp: Date.now()
      });
    }
    setIsBookmarkDialogOpen(false);
    setBookmarkTitle('');
  };

  const getPageTitle = () => {
    try {
      const domain = new URL(currentUrl).hostname;
      return domain || 'Untitled';
    } catch {
      return 'Untitled';
    }
  };

  const getSecurityIcon = () => {
    if (!currentUrl) return '🌐';
    if (currentUrl.startsWith('https://')) return '🔒';
    if (currentUrl.startsWith('http://')) return '⚠️';
    return '🌐';
  };

  return (
    <div className="browser-toolbar">
      <div className="navigation-controls">
        <button
          className={`nav-btn ${!canGoBack ? 'disabled' : ''}`}
          onClick={onBack}
          disabled={!canGoBack}
          title="Go back"
        >
          ←
        </button>
        <button
          className={`nav-btn ${!canGoForward ? 'disabled' : ''}`}
          onClick={onForward}
          disabled={!canGoForward}
          title="Go forward"
        >
          →
        </button>
        <button
          className="nav-btn refresh-btn"
          onClick={onRefresh}
          title="Refresh page"
        >
          {isLoading ? '⏹' : '↻'}
        </button>
      </div>

      <form className="url-bar" onSubmit={handleUrlSubmit}>
        <div className="url-input-container">
          <span className="security-icon">{getSecurityIcon()}</span>
          <input
            type="text"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="Enter URL or search..."
            className="url-input"
          />
          {isLoading && <div className="loading-spinner"></div>}
        </div>
      </form>

      <div className="toolbar-actions">
        <button
          className="action-btn bookmark-btn"
          onClick={handleAddBookmark}
          title="Add bookmark"
        >
          ⭐
        </button>
        <button
          className="action-btn bookmarks-btn"
          onClick={onToggleBookmarks}
          title="Show bookmarks"
        >
          📚
        </button>
      </div>

      {isBookmarkDialogOpen && (
        <div className="bookmark-dialog-overlay">
          <div className="bookmark-dialog">
            <h3>Add Bookmark</h3>
            <div className="bookmark-form">
              <label>
                Title:
                <input
                  type="text"
                  value={bookmarkTitle}
                  onChange={(e) => setBookmarkTitle(e.target.value)}
                  placeholder="Bookmark title"
                  autoFocus
                />
              </label>
              <label>
                URL:
                <input
                  type="text"
                  value={currentUrl}
                  readOnly
                  className="readonly-input"
                />
              </label>
            </div>
            <div className="bookmark-actions">
              <button
                onClick={() => setIsBookmarkDialogOpen(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleBookmarkSave}
                className="save-btn"
                disabled={!bookmarkTitle.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowserToolbar;
