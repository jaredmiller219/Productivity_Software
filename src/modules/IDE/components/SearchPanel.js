import React, { useState, useEffect } from 'react';
import './SearchPanel.css';

const SearchPanel = ({
  isVisible,
  onClose,
  onSearch,
  onFileSelect,
  getFileIcon
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, caseSensitive, wholeWord, useRegex]);

  const performSearch = () => {
    try {
      let results = onSearch(searchQuery);
      
      // Apply search options
      if (caseSensitive || wholeWord || useRegex) {
        results = results.filter(result => {
          let searchText = result.line;
          let query = searchQuery;
          
          if (useRegex) {
            try {
              const flags = caseSensitive ? 'g' : 'gi';
              const regex = new RegExp(query, flags);
              return regex.test(searchText);
            } catch (e) {
              // Invalid regex, fall back to normal search
              return searchText.toLowerCase().includes(query.toLowerCase());
            }
          }
          
          if (!caseSensitive) {
            searchText = searchText.toLowerCase();
            query = query.toLowerCase();
          }
          
          if (wholeWord) {
            const wordRegex = new RegExp(`\\b${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, caseSensitive ? 'g' : 'gi');
            return wordRegex.test(result.line);
          }
          
          return searchText.includes(query);
        });
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result) => {
    onFileSelect(result.file);
    // Could add line jumping functionality here
  };

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    
    try {
      let regex;
      if (useRegex) {
        const flags = caseSensitive ? 'gi' : 'gi';
        regex = new RegExp(`(${query})`, flags);
      } else if (wholeWord) {
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const flags = caseSensitive ? 'gi' : 'gi';
        regex = new RegExp(`(\\b${escapedQuery}\\b)`, flags);
      } else {
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const flags = caseSensitive ? 'g' : 'gi';
        regex = new RegExp(`(${escapedQuery})`, flags);
      }
      
      const parts = text.split(regex);
      return parts.map((part, index) => {
        const isMatch = regex.test(part);
        return isMatch ? (
          <mark key={index} className="search-highlight">{part}</mark>
        ) : (
          part
        );
      });
    } catch (error) {
      return text;
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  if (!isVisible) return null;

  return (
    <div className="search-panel">
      <div className="search-header">
        <h3>Search in Files</h3>
        <button className="close-btn" onClick={onClose} title="Close search">
          ×
        </button>
      </div>

      <div className="search-input-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in files..."
            className="search-input"
            autoFocus
          />
          {searchQuery && (
            <button className="clear-search" onClick={clearSearch} title="Clear search">
              ×
            </button>
          )}
        </div>
        
        <div className="search-options">
          <label className="search-option">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            />
            <span className="option-label">Aa</span>
            <span className="option-tooltip">Case sensitive</span>
          </label>
          
          <label className="search-option">
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={(e) => setWholeWord(e.target.checked)}
            />
            <span className="option-label">Ab</span>
            <span className="option-tooltip">Whole word</span>
          </label>
          
          <label className="search-option">
            <input
              type="checkbox"
              checked={useRegex}
              onChange={(e) => setUseRegex(e.target.checked)}
            />
            <span className="option-label">.*</span>
            <span className="option-tooltip">Regular expression</span>
          </label>
        </div>
      </div>

      <div className="search-results">
        {isSearching && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <span>Searching...</span>
          </div>
        )}
        
        {!isSearching && searchQuery && searchResults.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <p>No results found for "{searchQuery}"</p>
            <div className="search-tips">
              <h4>Search tips:</h4>
              <ul>
                <li>Check your spelling</li>
                <li>Try different keywords</li>
                <li>Use regex for advanced patterns</li>
              </ul>
            </div>
          </div>
        )}
        
        {!isSearching && searchResults.length > 0 && (
          <>
            <div className="results-header">
              <span className="results-count">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} in {new Set(searchResults.map(r => r.file.id)).size} file{new Set(searchResults.map(r => r.file.id)).size !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="results-list">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="result-item"
                  onClick={() => handleResultClick(result)}
                  title={`${result.file.name} - Line ${result.lineNumber}`}
                >
                  <div className="result-file">
                    <span className="file-icon">{getFileIcon(result.file.type)}</span>
                    <span className="file-name">{result.file.name}</span>
                    <span className="line-number">:{result.lineNumber}</span>
                  </div>
                  <div className="result-preview">
                    {highlightMatch(result.preview, searchQuery)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {!searchQuery && (
          <div className="search-placeholder">
            <div className="placeholder-icon">🔍</div>
            <h4>Search across all files</h4>
            <p>Enter a search term to find text across all files in your project.</p>
            <div className="search-features">
              <div className="feature">
                <strong>Case sensitive:</strong> Match exact case
              </div>
              <div className="feature">
                <strong>Whole word:</strong> Match complete words only
              </div>
              <div className="feature">
                <strong>Regex:</strong> Use regular expressions
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;
