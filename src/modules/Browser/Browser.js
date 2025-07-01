import React, { useState, useRef } from 'react';
import './Browser.css';

function Browser() {
  const [url, setUrl] = useState('https://www.google.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');
  const webviewRef = useRef(null);

  const handleNavigate = (e) => {
    e.preventDefault();
    let navigateUrl = url;

    // Add https if no protocol specified
    if (!/^https?:\/\//i.test(navigateUrl)) {
      navigateUrl = 'https://' + navigateUrl;
    }

    setCurrentUrl(navigateUrl);
    if (webviewRef.current) {
      webviewRef.current.src = navigateUrl;
    }
  };

  const handleRefresh = () => {
    if (webviewRef.current) {
      webviewRef.current.reload();
    }
  };

  const handleBack = () => {
    if (webviewRef.current) {
      webviewRef.current.goBack();
    }
  };

  const handleForward = () => {
    if (webviewRef.current) {
      webviewRef.current.goForward();
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
        <webview
          ref={webviewRef}
          src={currentUrl}
          className="webview"
          allowpopups="true"
        ></webview>
      </div>
    </div>
  );
}

export default Browser;
