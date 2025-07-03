import React, { useState, useRef, useEffect } from "react";
import "./Browser.css";

function Browser() {
  const [url, setUrl] = useState("https://www.google.com");
  const [currentUrl, setCurrentUrl] = useState("https://www.google.com");
  const [isLoading, setIsLoading] = useState(true);
  const webviewRef = useRef(null);

  useEffect(() => {
    // Initialize webview and add event listeners
    const webview = webviewRef.current;
    if (webview) {
      // Event listeners for webview
      const handleDomReady = () => {
        console.log("WebView DOM ready");
        setIsLoading(false);
      };

      const handleDidStartLoading = () => {
        console.log("WebView started loading");
        setIsLoading(true);
      };

      const handleDidStopLoading = () => {
        console.log("WebView stopped loading");
        setIsLoading(false);
        // Update URL in address bar to match current page
        if (webview.getURL) {
          try {
            const currentPageUrl = webview.getURL();
            setCurrentUrl(currentPageUrl);
            setUrl(currentPageUrl);
          } catch (error) {
            console.error("Error getting URL:", error);
          }
        }
      };

      const handleDidFailLoad = (e) => {
        console.error("WebView failed to load:", e);
        setIsLoading(false);
      };

      // Add event listeners
      webview.addEventListener("dom-ready", handleDomReady);
      webview.addEventListener("did-start-loading", handleDidStartLoading);
      webview.addEventListener("did-stop-loading", handleDidStopLoading);
      webview.addEventListener("did-fail-load", handleDidFailLoad);

      // Clean up event listeners when unmounting
      return () => {
        webview.removeEventListener("dom-ready", handleDomReady);
        webview.removeEventListener("did-start-loading", handleDidStartLoading);
        webview.removeEventListener("did-stop-loading", handleDidStopLoading);
        webview.removeEventListener("did-fail-load", handleDidFailLoad);
      };
    }
  }, []);

  const handleNavigate = (e) => {
    e.preventDefault();
    let navigateUrl = url;

    // Add https if no protocol specified
    if (!/^https?:\/\//i.test(navigateUrl)) {
      navigateUrl = "https://" + navigateUrl;
    }

    setCurrentUrl(navigateUrl);

    // Use loadURL if available, otherwise set src
    if (webviewRef.current) {
      try {
        if (typeof webviewRef.current.loadURL === "function") {
          webviewRef.current.loadURL(navigateUrl).then(() => { });
        } else {
          webviewRef.current.src = navigateUrl;
        }
      } catch (error) {
        console.error("Error navigating:", error);
        webviewRef.current.src = navigateUrl;
      }
    }
  };

  const handleRefresh = () => {
    if (webviewRef.current) {
      try {
        // Try using the reload method if available
        if (typeof webviewRef.current.reload === "function") {
          webviewRef.current.reload();
        }
        // Try using loadURL if available
        else if (typeof webviewRef.current.loadURL === "function") {
          webviewRef.current.loadURL(currentUrl).then(() => { });
        }
        // Fallback: reset the src to current URL
        else {
          webviewRef.current.src = currentUrl;
        }
      } catch (error) {
        console.error("Error refreshing webview:", error);
        // Fallback method
        webviewRef.current.src = currentUrl;
      }
    }
  };

  const handleBack = () => {
    if (webviewRef.current) {
      try {
        // Try using the goBack method if available
        if (typeof webviewRef.current.goBack === "function") {
          webviewRef.current.goBack();
        }
      } catch (error) {
        console.error("Error navigating back:", error);
      }
    }
  };

  const handleForward = () => {
    if (webviewRef.current) {
      try {
        // Try using the goForward method if available
        if (typeof webviewRef.current.goForward === "function") {
          webviewRef.current.goForward();
        }
      } catch (error) {
        console.error("Error navigating forward:", error);
      }
    }
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
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
        <webview
          ref={webviewRef}
          src={currentUrl}
          className="webview"
          allowpopups="true"
          partition="persist:browsersession"
          preload="./webview-preload.js"
        ></webview>
      </div>
    </div>
  );
}

export default Browser;
