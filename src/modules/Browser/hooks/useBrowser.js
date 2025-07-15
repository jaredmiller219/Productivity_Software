import { useState, useCallback, useRef } from 'react';
import { useGlobalState } from '../../../shared/hooks/useGlobalState.js';

/**
 * Custom hook for managing browser state and navigation
 * @returns {Object} Browser state and operations
 */
export const useBrowser = () => {
  // Use global state management for browser
  const { state, updateState } = useGlobalState('browser', {
    url: "https://www.google.com",
    currentUrl: "https://www.google.com",
    isLoading: false,
    error: null,
    history: [],
    historyIndex: -1,
    bookmarks: [
      { id: 1, title: "Google", url: "https://www.google.com", favicon: "🔍" },
      { id: 2, title: "GitHub", url: "https://github.com", favicon: "🐙" },
      { id: 3, title: "Stack Overflow", url: "https://stackoverflow.com", favicon: "📚" },
    ],
    tabs: [
      { id: 1, title: "New Tab", url: "https://www.google.com", isActive: true }
    ],
    activeTabId: 1
  });

  // Extract state values
  const { url, currentUrl, isLoading, error, history, historyIndex, bookmarks, tabs, activeTabId } = state;

  // State setter wrappers for global state
  const setUrl = (value) => updateState({ url: value });
  const setCurrentUrl = (value) => updateState({ currentUrl: value });
  const setIsLoading = (value) => updateState({ isLoading: value });
  const setError = (value) => updateState({ error: value });
  const setHistory = (value) => updateState({ history: typeof value === 'function' ? value(history) : value });
  const setHistoryIndex = (value) => updateState({ historyIndex: value });
  const setBookmarks = (value) => updateState({ bookmarks: typeof value === 'function' ? value(bookmarks) : value });
  const setTabs = (value) => updateState({ tabs: typeof value === 'function' ? value(tabs) : value });
  const setActiveTabId = (value) => updateState({ activeTabId: value });

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

    // Set a timeout to clear loading state if it gets stuck
    const loadingTimeout = setTimeout(() => {
      console.log("Loading timeout reached, clearing loading state");
      setIsLoading(false);
    }, 10000); // 10 second timeout

    if (webviewRef.current) {
      try {
        webviewRef.current.src = formattedUrl;

        // Clear timeout when navigation starts successfully
        const clearTimeoutOnLoad = () => {
          clearTimeout(loadingTimeout);
        };

        // Store timeout reference for cleanup
        webviewRef.current._loadingTimeout = loadingTimeout;
        webviewRef.current._clearTimeoutOnLoad = clearTimeoutOnLoad;

      } catch (error) {
        console.error("Error navigating:", error);
        setError(`Failed to navigate: ${error.message}`);
        setIsLoading(false);
        clearTimeout(loadingTimeout);
      }
    } else {
      // No webview available, clear loading immediately
      setIsLoading(false);
      clearTimeout(loadingTimeout);
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
      try {
        // For webview elements, we need to reload by setting the src again
        const currentSrc = webviewRef.current.src || currentUrl;
        webviewRef.current.src = currentSrc;
      } catch (error) {
        console.error("Error refreshing:", error);
        setError(`Failed to refresh: ${error.message}`);
        setIsLoading(false);
      }
    } else {
      // Fallback: navigate to current URL
      navigateToUrl(currentUrl);
    }
  }, [currentUrl, navigateToUrl]);

  const stop = useCallback(() => {
    console.log("Stopping page load");
    setIsLoading(false);
    setError(null);

    if (webviewRef.current) {
      try {
        // Stop the webview from loading
        webviewRef.current.stop();
      } catch (error) {
        console.error("Error stopping:", error);
      }
    }

    // Clear any pending loading timeout
    if (webviewRef.current?._loadingTimeout) {
      clearTimeout(webviewRef.current._loadingTimeout);
      webviewRef.current._loadingTimeout = null;
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
    console.log("Webview load completed");
    setIsLoading(false);
    setError(null);

    // Clear any pending loading timeout
    if (webviewRef.current?._loadingTimeout) {
      clearTimeout(webviewRef.current._loadingTimeout);
      webviewRef.current._loadingTimeout = null;
    }

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
    console.log("Webview load error:", errorEvent);
    setIsLoading(false);
    setError(`Failed to load page: ${errorEvent.errorDescription || 'Unknown error'}`);

    // Clear any pending loading timeout
    if (webviewRef.current?._loadingTimeout) {
      clearTimeout(webviewRef.current._loadingTimeout);
      webviewRef.current._loadingTimeout = null;
    }
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
    stop,
    
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
