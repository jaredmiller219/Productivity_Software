import React, { useState, useEffect, useRef } from 'react';
import './NotesSearch.css';

const SEARCH_FILTERS = {
  ALL: 'all',
  TITLE: 'title',
  CONTENT: 'content',
  TAGS: 'tags',
  DATE: 'date'
};

const SORT_OPTIONS = {
  MODIFIED_DESC: 'modified_desc',
  MODIFIED_ASC: 'modified_asc',
  CREATED_DESC: 'created_desc',
  CREATED_ASC: 'created_asc',
  TITLE_ASC: 'title_asc',
  TITLE_DESC: 'title_desc',
  SIZE_DESC: 'size_desc',
  SIZE_ASC: 'size_asc'
};

function NotesSearch({ 
  notes, 
  onFilteredNotesChange, 
  onSearchTermChange,
  tags = [],
  categories = []
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState(SEARCH_FILTERS.ALL);
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.MODIFIED_DESC);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    const filteredAndSorted = filterAndSortNotes();
    onFilteredNotesChange(filteredAndSorted);
    onSearchTermChange(searchTerm);
  }, [
    notes, 
    searchTerm, 
    searchFilter, 
    sortOption, 
    selectedTags, 
    selectedCategory, 
    dateRange, 
    minSize, 
    maxSize
  ]);

  const filterAndSortNotes = () => {
    let filtered = [...notes];

    // Apply text search
    if (searchTerm.trim()) {
      filtered = filtered.filter(note => {
        const term = searchTerm.toLowerCase();
        
        switch (searchFilter) {
          case SEARCH_FILTERS.TITLE:
            return note.title.toLowerCase().includes(term);
          case SEARCH_FILTERS.CONTENT:
            return note.content.toLowerCase().includes(term);
          case SEARCH_FILTERS.TAGS:
            return note.tags?.some(tag => tag.toLowerCase().includes(term));
          case SEARCH_FILTERS.ALL:
          default:
            return (
              note.title.toLowerCase().includes(term) ||
              note.content.toLowerCase().includes(term) ||
              note.tags?.some(tag => tag.toLowerCase().includes(term))
            );
        }
      });
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(note => 
        selectedTags.every(tag => note.tags?.includes(tag))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }

    // Apply date range filter
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(note => {
        const noteDate = new Date(note.lastModified || note.createdAt);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;
        
        if (startDate && noteDate < startDate) return false;
        if (endDate && noteDate > endDate) return false;
        return true;
      });
    }

    // Apply size filter
    if (minSize || maxSize) {
      filtered = filtered.filter(note => {
        const noteSize = note.content.length;
        if (minSize && noteSize < parseInt(minSize)) return false;
        if (maxSize && noteSize > parseInt(maxSize)) return false;
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case SORT_OPTIONS.MODIFIED_DESC:
          return new Date(b.lastModified || b.createdAt) - new Date(a.lastModified || a.createdAt);
        case SORT_OPTIONS.MODIFIED_ASC:
          return new Date(a.lastModified || a.createdAt) - new Date(b.lastModified || b.createdAt);
        case SORT_OPTIONS.CREATED_DESC:
          return new Date(b.createdAt) - new Date(a.createdAt);
        case SORT_OPTIONS.CREATED_ASC:
          return new Date(a.createdAt) - new Date(b.createdAt);
        case SORT_OPTIONS.TITLE_ASC:
          return a.title.localeCompare(b.title);
        case SORT_OPTIONS.TITLE_DESC:
          return b.title.localeCompare(a.title);
        case SORT_OPTIONS.SIZE_DESC:
          return b.content.length - a.content.length;
        case SORT_OPTIONS.SIZE_ASC:
          return a.content.length - b.content.length;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSearchFilter(SEARCH_FILTERS.ALL);
    setSelectedTags([]);
    setSelectedCategory('');
    setDateRange({ start: '', end: '' });
    setMinSize('');
    setMaxSize('');
    searchInputRef.current?.focus();
  };

  const getSearchResultsCount = () => {
    return filterAndSortNotes().length;
  };

  const highlightSearchTerm = (text, term) => {
    if (!term.trim()) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  return (
    <div className="notes-search">
      <div className="search-header">
        <div className="search-input-container">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button
            className="search-clear-btn"
            onClick={() => setSearchTerm('')}
            style={{ display: searchTerm ? 'block' : 'none' }}
          >
            ×
          </button>
        </div>
        
        <div className="search-controls">
          <select
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="search-filter-select"
          >
            <option value={SEARCH_FILTERS.ALL}>All Fields</option>
            <option value={SEARCH_FILTERS.TITLE}>Title Only</option>
            <option value={SEARCH_FILTERS.CONTENT}>Content Only</option>
            <option value={SEARCH_FILTERS.TAGS}>Tags Only</option>
          </select>
          
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value={SORT_OPTIONS.MODIFIED_DESC}>Modified (Newest)</option>
            <option value={SORT_OPTIONS.MODIFIED_ASC}>Modified (Oldest)</option>
            <option value={SORT_OPTIONS.CREATED_DESC}>Created (Newest)</option>
            <option value={SORT_OPTIONS.CREATED_ASC}>Created (Oldest)</option>
            <option value={SORT_OPTIONS.TITLE_ASC}>Title (A-Z)</option>
            <option value={SORT_OPTIONS.TITLE_DESC}>Title (Z-A)</option>
            <option value={SORT_OPTIONS.SIZE_DESC}>Size (Largest)</option>
            <option value={SORT_OPTIONS.SIZE_ASC}>Size (Smallest)</option>
          </select>
          
          <button
            className={`advanced-search-btn ${showAdvancedSearch ? 'active' : ''}`}
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            title="Advanced Search"
          >
            🔍+
          </button>
        </div>
      </div>

      {showAdvancedSearch && (
        <div className="advanced-search-panel">
          <div className="advanced-search-section">
            <h4>Filter by Tags</h4>
            <div className="tags-filter">
              {tags.map(tag => (
                <button
                  key={tag}
                  className={`tag-filter-btn ${selectedTags.includes(tag) ? 'selected' : ''}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="advanced-search-section">
            <h4>Filter by Category</h4>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="advanced-search-section">
            <h4>Date Range</h4>
            <div className="date-range-inputs">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="date-input"
                placeholder="Start date"
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="date-input"
                placeholder="End date"
              />
            </div>
          </div>

          <div className="advanced-search-section">
            <h4>Content Size (characters)</h4>
            <div className="size-range-inputs">
              <input
                type="number"
                value={minSize}
                onChange={(e) => setMinSize(e.target.value)}
                placeholder="Min size"
                className="size-input"
              />
              <span>to</span>
              <input
                type="number"
                value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
                placeholder="Max size"
                className="size-input"
              />
            </div>
          </div>

          <div className="advanced-search-actions">
            <button
              className="clear-filters-btn"
              onClick={clearAllFilters}
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      <div className="search-results-info">
        <span className="results-count">
          {getSearchResultsCount()} of {notes.length} notes
        </span>
        {(searchTerm || selectedTags.length > 0 || selectedCategory || dateRange.start || dateRange.end || minSize || maxSize) && (
          <button
            className="clear-search-btn"
            onClick={clearAllFilters}
          >
            Clear Search
          </button>
        )}
      </div>
    </div>
  );
}

export default NotesSearch;
