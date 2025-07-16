import React, { useState } from "react";
import BrowserToolbar from "./components/navigation/BrowserToolbar.js";
import BrowserTabs from "./components/navigation/BrowserTabs.js";
import BrowserContent from "./components/content/BrowserContent.js";
import BookmarksPanel from "./components/bookmarks/BookmarksPanel.js";
import BrowserSettings from "./components/settings/BrowserSettings.js";
import BrowserThemes from "./components/themes/BrowserThemes.js";
import { useBrowser } from "./hooks/useBrowser.js";
import "./styles/Browser.css";

function Browser() {
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  
  const {
    url,
    currentUrl,
    isLoading,
    error,
    history,
    bookmarks,
    tabs,
    activeTabId,
    webviewRef,
    canGoBack,
    canGoForward,
    setUrl,
    navigateToUrl,
    goBack,
    goForward,
    refresh,
    stop,
    createNewTab,
    closeTab,
    switchTab,
    addBookmark,
    removeBookmark,
    handleWebviewLoad,
    handleWebviewError
  } = useBrowser();

  const handleToggleBookmarks = () => {
    setShowBookmarks(!showBookmarks);
  };

  const handleNavigateToBookmark = (bookmarkUrl) => {
    navigateToUrl(bookmarkUrl);
    setShowBookmarks(false);
  };

  return (
    <div className="browser-container">
      <BrowserTabs
        tabs={tabs}
        activeTabId={activeTabId}
        onSwitchTab={switchTab}
        onCloseTab={closeTab}
        onCreateTab={createNewTab}
      />
      
      <div className="browser-main">
        <BrowserToolbar
          url={url}
          currentUrl={currentUrl}
          isLoading={isLoading}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onUrlChange={setUrl}
          onNavigate={navigateToUrl}
          onBack={goBack}
          onForward={goForward}
          onRefresh={refresh}
          onStop={stop}
          onAddBookmark={addBookmark}
          onToggleBookmarks={handleToggleBookmarks}
          onShowSettings={() => setShowSettings(true)}
          onShowThemes={() => setShowThemes(true)}
        />
        
        <BookmarksPanel
          bookmarks={bookmarks}
          isVisible={showBookmarks}
          onNavigateToBookmark={handleNavigateToBookmark}
          onRemoveBookmark={removeBookmark}
          onClose={() => setShowBookmarks(false)}
        />
        
        <BrowserContent
          currentUrl={currentUrl}
          isLoading={isLoading}
          error={error}
          webviewRef={webviewRef}
          onLoad={handleWebviewLoad}
          onError={handleWebviewError}
        />

        {showSettings && (
          <BrowserSettings
            onClose={() => setShowSettings(false)}
          />
        )}

        {showThemes && (
          <BrowserThemes
            onClose={() => setShowThemes(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Browser;
