import React, { useEffect } from 'react';
import './BrowserContent.css';

const BrowserContent = ({
  currentUrl,
  isLoading,
  error,
  webviewRef,
  onLoad,
  onError
}) => {
  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const handleLoadStart = () => {
      console.log("Webview started loading");
    };

    const handleLoadStop = () => {
      console.log("Webview stopped loading");
      onLoad();
    };

    const handleLoadError = (event) => {
      onError(event);
    };

    const handleNewWindow = (event) => {
      // Handle new window requests
      event.preventDefault();
      window.open(event.url, '_blank');
    };

    // Add event listeners
    webview.addEventListener('did-start-loading', handleLoadStart);
    webview.addEventListener('did-stop-loading', handleLoadStop);
    webview.addEventListener('did-fail-load', handleLoadError);
    webview.addEventListener('new-window', handleNewWindow);

    return () => {
      // Cleanup event listeners
      webview.removeEventListener('did-start-loading', handleLoadStart);
      webview.removeEventListener('did-stop-loading', handleLoadStop);
      webview.removeEventListener('did-fail-load', handleLoadError);
      webview.removeEventListener('new-window', handleNewWindow);
    };
  }, [webviewRef, onLoad, onError]);

  const renderErrorState = () => (
    <div className="error-state">
      <div className="error-icon">⚠️</div>
      <h3>Unable to load page</h3>
      <p className="error-message">{error}</p>
      <div className="error-suggestions">
        <h4>Try:</h4>
        <ul>
          <li>Checking your internet connection</li>
          <li>Refreshing the page</li>
          <li>Checking if the URL is correct</li>
        </ul>
      </div>
      <button 
        className="retry-button"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );



  const renderLoadingState = () => {
    console.log("Rendering loading state, isLoading:", isLoading);
    return (
      <div className="loading-state">
        <p>Loading page...</p>
        <div className="loading-progress">
          <div className="progress-bar"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="browser-content">
      {error && renderErrorState()}
      {isLoading && !error && renderLoadingState()}

      <webview
        ref={webviewRef}
        src={currentUrl}
        className={`webview ${isLoading ? 'loading' : ''} ${error ? 'hidden' : ''}`}
        allowpopups="true"
        partition="persist:browsersession"
        preload="./webview-preload.js"
        useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        webpreferences="contextIsolation=true, enableRemoteModule=false, nodeIntegration=false"
      />
    </div>
  );
};

export default BrowserContent;
