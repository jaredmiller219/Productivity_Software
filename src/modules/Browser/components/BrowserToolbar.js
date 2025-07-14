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
  onStop,
  onAddBookmark,
  onToggleBookmarks
}) => {
  const [isBookmarkDialogOpen, setIsBookmarkDialogOpen] = useState(false);
  const [bookmarkTitle, setBookmarkTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onNavigate(url);
  };

  const handleAddBookmark = () => {
    setBookmarkTitle(getPageTitle());
    setIsBookmarkDialogOpen(true);
  };

  const handleSaveBookmark = () => {
    onAddBookmark(bookmarkTitle, currentUrl);
    setIsBookmarkDialogOpen(false);
    setBookmarkTitle('');
  };

  const getPageTitle = () => {
    // Extract domain name as fallback title
    try {
      const urlObj = new URL(currentUrl);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'Untitled';
    }
  };

  const getSecurityIcon = () => {
    if (currentUrl.startsWith('https://')) {
      return '🔒';
    } else if (currentUrl.startsWith('http://')) {
      return '⚠️';
    }
    return '🌐';
  };

  return (
    <div className="browser-toolbar">
      <div className="browser-navigation">
        <button 
          onClick={onBack} 
          className={`nav-button ${!canGoBack ? 'disabled' : ''}`}
          disabled={!canGoBack}
          title="Go back"
        >
          ←
        </button>
        <button 
          onClick={onForward} 
          className={`nav-button ${!canGoForward ? 'disabled' : ''}`}
          disabled={!canGoForward}
          title="Go forward"
        >
          →
        </button>
        <button
          onClick={isLoading ? onStop : onRefresh}
          className="nav-button"
          title={isLoading ? "Stop loading" : "Refresh page"}
        >
          {isLoading ? '✕' : '↻'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="url-form">
        <div className="url-input-container">
          <span className="security-icon" title={currentUrl.startsWith('https://') ? 'Secure connection' : 'Not secure'}>
            {getSecurityIcon()}
          </span>
          <input
            type="text"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            className="url-input"
            placeholder="Search or enter URL"
            spellCheck="false"
          />

        </div>
        <button type="submit" className="go-button" title="Navigate">
          Go
        </button>
      </form>

      <div className="browser-actions">
        <button 
          onClick={handleAddBookmark}
          className="action-button"
          title="Add bookmark"
        >
          ⭐
        </button>
        <button 
          onClick={onToggleBookmarks}
          className="action-button"
          title="Show bookmarks"
        >
          📚
        </button>
        <button 
          className="action-button"
          title="Browser menu"
        >
          ⋮
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
              <div className="bookmark-actions">
                <button onClick={handleSaveBookmark} className="save-btn">
                  Save
                </button>
                <button 
                  onClick={() => setIsBookmarkDialogOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowserToolbar;
