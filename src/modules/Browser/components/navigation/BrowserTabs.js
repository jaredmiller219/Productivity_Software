import React from 'react';
import './BrowserTabs.css';

const BrowserTabs = ({
  tabs,
  activeTabId,
  onSwitchTab,
  onCloseTab,
  onCreateTab
}) => {
  const handleTabClick = (tabId) => {
    onSwitchTab(tabId);
  };

  const handleCloseTab = (e, tabId) => {
    e.stopPropagation();
    onCloseTab(tabId);
  };

  const truncateTitle = (title, maxLength = 20) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const getFavicon = (url) => {
    if (url.includes('google.com')) return '🔍';
    if (url.includes('github.com')) return '🐙';
    if (url.includes('stackoverflow.com')) return '📚';
    if (url.includes('youtube.com')) return '📺';
    if (url.includes('twitter.com') || url.includes('x.com')) return '🐦';
    if (url.includes('facebook.com')) return '📘';
    if (url.includes('linkedin.com')) return '💼';
    if (url.includes('reddit.com')) return '🤖';
    if (url.includes('wikipedia.org')) return '📖';
    if (url.includes('amazon.com')) return '📦';
    return '🌐';
  };

  return (
    <div className="browser-tabs">
      <div className="tabs-container">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`browser-tab ${tab.id === activeTabId ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
            title={tab.title}
          >
            <span className="tab-favicon">
              {getFavicon(tab.url)}
            </span>
            <span className="tab-title">
              {truncateTitle(tab.title)}
            </span>
            {tabs.length > 1 && (
              <button
                className="tab-close"
                onClick={(e) => handleCloseTab(e, tab.id)}
                title="Close tab"
              >
                ×
              </button>
            )}
          </div>
        ))}
        
        <button
          className="new-tab-button"
          onClick={onCreateTab}
          title="New tab"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default BrowserTabs;
