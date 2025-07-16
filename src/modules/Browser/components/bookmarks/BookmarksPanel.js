import React, { useState } from 'react';
import './BookmarksPanel.css';

const BookmarksPanel = ({
  bookmarks,
  isVisible,
  onNavigateToBookmark,
  onRemoveBookmark,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookmarkClick = (bookmark) => {
    onNavigateToBookmark(bookmark.url);
  };

  const handleRemoveBookmark = (e, bookmarkId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this bookmark?')) {
      onRemoveBookmark(bookmarkId);
    }
  };

  const formatUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bookmarks-panel">
      <div className="bookmarks-header">
        <h3>Bookmarks</h3>
        <button className="close-button" onClick={onClose} title="Close bookmarks">
          ×
        </button>
      </div>

      <div className="bookmarks-search">
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="bookmarks-list">
        {filteredBookmarks.length === 0 ? (
          <div className="empty-bookmarks">
            {searchQuery ? (
              <p>No bookmarks found matching "{searchQuery}"</p>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h4>No bookmarks yet</h4>
                <p>Click the star icon in the toolbar to bookmark pages you want to save.</p>
              </div>
            )}
          </div>
        ) : (
          filteredBookmarks.map(bookmark => (
            <div
              key={bookmark.id}
              className="bookmark-item"
              onClick={() => handleBookmarkClick(bookmark)}
              title={bookmark.url}
            >
              <div className="bookmark-content">
                <span className="bookmark-favicon">{bookmark.favicon}</span>
                <div className="bookmark-info">
                  <div className="bookmark-title">{bookmark.title}</div>
                  <div className="bookmark-url">{formatUrl(bookmark.url)}</div>
                </div>
              </div>
              <button
                className="remove-bookmark"
                onClick={(e) => handleRemoveBookmark(e, bookmark.id)}
                title="Remove bookmark"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {filteredBookmarks.length > 0 && (
        <div className="bookmarks-footer">
          <span className="bookmarks-count">
            {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default BookmarksPanel;
