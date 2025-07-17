import React, { useState, useRef, useEffect } from 'react';
import './IDEToolbar.css';

const IDEToolbar = ({
  onNewFile,
  onSave,
  onSearch,
  onToggleSearch,
  isSearchVisible,
  activeFile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef(null);









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

  return (
    <div className="ide-toolbar">
      {/* Empty left section for spacing */}
      <div className="toolbar-section toolbar-left">
      </div>

      {/* Search bar in the center */}
      <div className="toolbar-section toolbar-center">
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

      {/* Small buttons on the right */}
      <div className="toolbar-section toolbar-right">
        <div className="right-controls">
        </div>
      </div>
    </div>
  );
};

export default IDEToolbar;
