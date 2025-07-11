import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for managing browser state and navigation
 * @returns {Object} Browser state and operations
 */
export const useBrowser = () => {
  const [url, setUrl] = useState("https://www.google.com");
  const [currentUrl, setCurrentUrl] = useState("https://www.google.com");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [bookmarks, setBookmarks] = useState([
    { id: 1, title: "Google", url: "https://www.google.com", favicon: "🔍" },
    { id: 2, title: "GitHub", url: "https://github.com", favicon: "🐙" },
    { id: 3, title: "Stack Overflow", url: "https://stackoverflow.com", favicon: "📚" },
  ]);
  const [tabs, setTabs] = useState([
    { id: 1, title: "New Tab", url: "https://www.google.com", isActive: true }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  
  const webviewRef = useRef(null);

  // Validate and format URL
  const formatUrl = useCallback((inputUrl) => {
    let formattedUrl = inputUrl.trim();
    
    // If it looks like a search query, use Google search
    if (!formattedUrl.includes('.') && !formattedUrl.startsWith('http')) {
      return `https://www.google.com/search?q=${encodeURIComponent(formattedUrl)}`;
    }
    
    // Add https if no protocol specified
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }
    
    return formattedUrl;
  }, []);

  // Navigate to URL
  const navigateToUrl = useCallback((targetUrl) => {
    const formattedUrl = formatUrl(targetUrl);
    
    setCurrentUrl(formattedUrl);
    setUrl(formattedUrl);
    setError(null);
    setIsLoading(true);

    // Add to history
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(formattedUrl);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);

    // Update active tab
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, url: formattedUrl, title: "Loading..." }
        : tab
    ));

    if (webviewRef.current) {
      try {
        webviewRef.current.src = formattedUrl;
      } catch (error) {
        console.error("Error navigating:", error);
        setError(`Failed to navigate: ${error.message}`);
        setIsLoading(false);
      }
    }
  }, [formatUrl, historyIndex, activeTabId]);

  // Navigation controls
  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const targetUrl = history[newIndex];
      setHistoryIndex(newIndex);
      setCurrentUrl(targetUrl);
      setUrl(targetUrl);
      
      if (webviewRef.current && webviewRef.current.canGoBack()) {
        webviewRef.current.goBack();
      }
    }
  }, [history, historyIndex]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const targetUrl = history[newIndex];
      setHistoryIndex(newIndex);
      setCurrentUrl(targetUrl);
      setUrl(targetUrl);
      
      if (webviewRef.current && webviewRef.current.canGoForward()) {
        webviewRef.current.goForward();
      }
    }
  }, [history, historyIndex]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    if (webviewRef.current) {
      webviewRef.current.reload();
    }
  }, []);

  // Tab management
  const createNewTab = useCallback(() => {
    const newTab = {
      id: Date.now(),
      title: "New Tab",
      url: "https://www.google.com",
      isActive: false
    };
    
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setUrl("https://www.google.com");
    setCurrentUrl("https://www.google.com");
  }, []);

  const closeTab = useCallback((tabId) => {
    setTabs(prev => {
      const filtered = prev.filter(tab => tab.id !== tabId);
      if (filtered.length === 0) {
        // Create a new tab if all tabs are closed
        const newTab = {
          id: Date.now(),
          title: "New Tab",
          url: "https://www.google.com",
          isActive: true
        };
        setActiveTabId(newTab.id);
        return [newTab];
      }
      
      // If we closed the active tab, switch to the first remaining tab
      if (tabId === activeTabId && filtered.length > 0) {
        setActiveTabId(filtered[0].id);
        setUrl(filtered[0].url);
        setCurrentUrl(filtered[0].url);
      }
      
      return filtered;
    });
  }, [activeTabId]);

  const switchTab = useCallback((tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setActiveTabId(tabId);
      setUrl(tab.url);
      setCurrentUrl(tab.url);
    }
  }, [tabs]);

  // Bookmark management
  const addBookmark = useCallback((title, bookmarkUrl) => {
    const newBookmark = {
      id: Date.now(),
      title: title || "Untitled",
      url: bookmarkUrl || currentUrl,
      favicon: "🔖"
    };
    setBookmarks(prev => [...prev, newBookmark]);
  }, [currentUrl]);

  const removeBookmark = useCallback((bookmarkId) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
  }, []);

  // Webview event handlers
  const handleWebviewLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
    
    // Update tab title
    if (webviewRef.current) {
      const title = webviewRef.current.getTitle() || "Untitled";
      setTabs(prev => prev.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, title }
          : tab
      ));
    }
  }, [activeTabId]);

  const handleWebviewError = useCallback((errorEvent) => {
    setIsLoading(false);
    setError(`Failed to load page: ${errorEvent.errorDescription || 'Unknown error'}`);
  }, []);

  // Get navigation state
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  return {
    // State
    url,
    currentUrl,
    isLoading,
    error,
    history,
    bookmarks,
    tabs,
    activeTabId,
    webviewRef,
    
    // Navigation state
    canGoBack,
    canGoForward,
    
    // Actions
    setUrl,
    navigateToUrl,
    goBack,
    goForward,
    refresh,
    
    // Tab management
    createNewTab,
    closeTab,
    switchTab,
    
    // Bookmark management
    addBookmark,
    removeBookmark,
    
    // Event handlers
    handleWebviewLoad,
    handleWebviewError
  };
};
