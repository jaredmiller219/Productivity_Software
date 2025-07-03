import React, { useState, useRef, useEffect } from "react";
import "./Browser.css";

function Browser() {
  const [url, setUrl] = useState("https://www.google.com");
  const [currentUrl, setCurrentUrl] = useState("https://www.google.com");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const webviewRef = useRef(null);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleNavigate = (e) => {
    e.preventDefault();
    let navigateUrl = url;

    // Add https if no protocol specified
    if (!/^https?:\/\//i.test(navigateUrl)) {
      navigateUrl = "https://" + navigateUrl;
    }

    setCurrentUrl(navigateUrl);
    setError(null);

    if (webviewRef.current) {
      try {
        webviewRef.current.src = navigateUrl;
      } catch (error) {
        console.error("Error navigating:", error);
        setError(`Failed to navigate: ${error.message}`);
      }
    }
  };

  const handleBack = () => {
    if (webviewRef.current && webviewRef.current.canGoBack()) {
      webviewRef.current.goBack();
    }
  };

  const handleForward = () => {
    if (webviewRef.current && webviewRef.current.canGoForward()) {
      webviewRef.current.goForward();
    }
  };

  const handleRefresh = () => {
    if (webviewRef.current) {
      webviewRef.current.reload();
    }
  };

  return (
    <div className="browser-container">
      <div className="browser-toolbar">
        <div className="browser-navigation">
          <button onClick={handleBack} className="nav-button">
            ←
          </button>
          <button onClick={handleForward} className="nav-button">
            →
          </button>
          <button onClick={handleRefresh} className="nav-button">
            ↻
          </button>
        </div>
        <form onSubmit={handleNavigate} className="url-form">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            className="url-input"
            placeholder="Enter URL"
          />
          <button type="submit" className="go-button">
            Go
          </button>
        </form>
      </div>
      <div className="browser-content">
        {isLoading && <div className="loading-indicator">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        <webview
          ref={webviewRef}
          src={currentUrl}
          className="webview"
          allowpopups="true"
          partition="persist:browsersession"
          preload="./webview-preload.js"
          useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        ></webview>
      </div>
    </div>
  );
}

export default Browser;
