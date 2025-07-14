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
    if (onSearch) {
      try {
        const results = onSearch(searchQuery, {
          caseSensitive,
          wholeWord,
          useRegex
        });
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    }
    setIsSearching(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleResultClick = (result) => {
    if (onFileSelect) {
      onFileSelect(result.file);
    }
  };

  const groupResultsByFile = (results) => {
    const grouped = {};
    results.forEach(result => {
      const fileName = result.file.name;
      if (!grouped[fileName]) {
        grouped[fileName] = {
          file: result.file,
          matches: []
        };
      }
      grouped[fileName].matches.push(result);
    });
    return Object.values(grouped);
  };

  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    
    try {
      let regex;
      if (useRegex) {
        regex = new RegExp(query, caseSensitive ? 'g' : 'gi');
      } else {
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = wholeWord ? `\\b${escapedQuery}\\b` : escapedQuery;
        regex = new RegExp(pattern, caseSensitive ? 'g' : 'gi');
      }
      
      return text.replace(regex, (match) => `<mark>${match}</mark>`);
    } catch (error) {
      return text;
    }
  };

  const groupedResults = groupResultsByFile(searchResults);

  return (
    <div className="search-panel">
      <div className="search-header">
        <h3>🔍 Search</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="search-controls">
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search in files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={handleClearSearch}>
              ✕
            </button>
          )}
        </div>

        <div className="search-options">
          <div className="search-option">
            <input
              type="checkbox"
              id="case-sensitive"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            />
            <label htmlFor="case-sensitive" title="Match case">
              Aa
            </label>
            <div className="option-tooltip">Match case</div>
          </div>

          <div className="search-option">
            <input
              type="checkbox"
              id="whole-word"
              checked={wholeWord}
              onChange={(e) => setWholeWord(e.target.checked)}
            />
            <label htmlFor="whole-word" title="Match whole word">
              Ab
            </label>
            <div className="option-tooltip">Match whole word</div>
          </div>

          <div className="search-option">
            <input
              type="checkbox"
              id="use-regex"
              checked={useRegex}
              onChange={(e) => setUseRegex(e.target.checked)}
            />
            <label htmlFor="use-regex" title="Use regular expression">
              .*
            </label>
            <div className="option-tooltip">Use regular expression</div>
          </div>
        </div>
      </div>

      <div className="search-results">
        {isSearching && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>Searching...</span>
          </div>
        )}

        {!isSearching && searchQuery && searchResults.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h4>No results found</h4>
            <p>Try adjusting your search terms or options</p>
          </div>
        )}

        {!isSearching && searchResults.length > 0 && (
          <div className="results-summary">
            <span className="results-count">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} 
              in {groupedResults.length} file{groupedResults.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        <div className="results-list">
          {groupedResults.map((group, groupIndex) => (
            <div key={groupIndex} className="result-group">
              <div className="result-file-header">
                <span className="file-icon">{getFileIcon(group.file.type)}</span>
                <span className="file-name">{group.file.name}</span>
                <span className="match-count">({group.matches.length})</span>
              </div>
              
              <div className="result-matches">
                {group.matches.map((result, resultIndex) => (
                  <div
                    key={resultIndex}
                    className="result-item"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="result-line-number">
                      {result.lineNumber}
                    </div>
                    <div 
                      className="result-content"
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(result.preview, searchQuery)
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
