import React, { useState } from 'react';

// Available themes
const THEMES = {
  cyber: {
    name: 'Cyber',
    background: '#0a0a0a',
    foreground: '#00ff41',
    accent: '#00ff41'
  },
  neon: {
    name: 'Neon',
    background: '#1a1a2e',
    foreground: '#00d4ff',
    accent: '#00d4ff'
  },
  matrix: {
    name: 'Matrix',
    background: '#000000',
    foreground: '#00ff00',
    accent: '#00ff00'
  },
  synthwave: {
    name: 'Synthwave',
    background: '#2d1b69',
    foreground: '#ff7edb',
    accent: '#ff7edb'
  }
};

function TestTerminal() {
  const [tabs, setTabs] = useState([
    { id: 1, name: 'Terminal 1', status: 'ready' }
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const [currentTheme, setCurrentTheme] = useState('cyber');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('SF Mono');

  const addTab = () => {
    const newId = Math.max(...tabs.map(tab => tab.id)) + 1;
    const newTab = { id: newId, name: `Terminal ${newId}`, status: 'ready' };
    setTabs([...tabs, newTab]);
    setActiveTab(newId);
    alert(`Added new tab: ${newTab.name}`);
  };

  const closeTab = (tabId) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter(tab => tab.id !== tabId);
      setTabs(newTabs);
      if (activeTab === tabId) {
        setActiveTab(newTabs[0].id);
      }
    }
  };

  const theme = THEMES[currentTheme];

  return (
    <div style={{
      background: `linear-gradient(135deg, ${theme.background} 0%, #161b22 100%)`,
      color: theme.foreground,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: '#21262d',
        padding: '10px 20px',
        borderBottom: '1px solid #30363d'
      }}>
        <h2>🚀 Working Terminal Component!</h2>
      </div>

      {/* Tab Bar */}
      <div style={{
        background: '#161b22',
        padding: '8px 12px',
        borderBottom: '1px solid #30363d',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            style={{
              background: activeTab === tab.id ? theme.accent : '#21262d',
              color: activeTab === tab.id ? theme.background : '#8b949e',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: `1px solid ${activeTab === tab.id ? theme.accent : '#30363d'}`
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>⚡</span>
            <span>{tab.name}</span>
            <span style={{ fontSize: '8px' }}>
              {tab.status === 'running' ? '●' : '○'}
            </span>
            {tabs.length > 1 && (
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: '2px 4px',
                  borderRadius: '3px'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}

        <button
          style={{
            background: 'linear-gradient(145deg, #56d364, #2ea043)',
            border: '1px solid #56d364',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
          onClick={addTab}
        >
          + Add Tab
        </button>
      </div>

      {/* Terminal Content */}
      <div style={{
        flex: 1,
        background: theme.background,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: fontFamily,
        fontSize: `${fontSize}px`
      }}>
        <h3 style={{ color: theme.accent }}>Terminal {activeTab} Content</h3>
        <p style={{ color: theme.foreground }}>Active tab: {tabs.find(tab => tab.id === activeTab)?.name}</p>
        <p style={{ color: theme.foreground }}>Total tabs: {tabs.length}</p>
        <p style={{ color: theme.foreground }}>Theme: {THEMES[currentTheme].name}</p>
        <p style={{ color: theme.foreground }}>Font: {fontFamily} {fontSize}px</p>

        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '15px',
          borderRadius: '8px',
          border: `1px solid ${theme.accent}`,
          marginTop: '20px',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: theme.foreground
        }}>
          <div style={{ color: theme.accent }}>$ ls -la</div>
          <div>drwxr-xr-x  5 user  staff   160 Dec 14 10:30 .</div>
          <div>drwxr-xr-x  3 user  staff    96 Dec 14 10:29 ..</div>
          <div style={{ color: theme.accent }}>$ echo "Welcome to {THEMES[currentTheme].name} theme!"</div>
          <div>Welcome to {THEMES[currentTheme].name} theme!</div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button
            style={{
              background: '#f778ba',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
            onClick={() => setShowThemeSelector(true)}
          >
            🎨 Themes
          </button>

          <button
            style={{
              background: '#58a6ff',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
            onClick={() => setShowSettings(true)}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Theme Selector Modal */}
      {showThemeSelector && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
            border: `2px solid ${theme.accent}`,
            borderRadius: '12px',
            padding: '30px',
            minWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: theme.accent }}>🎨 Terminal Themes</h2>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.foreground,
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
                onClick={() => setShowThemeSelector(false)}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              {Object.entries(THEMES).map(([key, themeData]) => (
                <div
                  key={key}
                  style={{
                    background: `linear-gradient(145deg, ${themeData.background}, #2a2a2a)`,
                    border: currentTheme === key ? `2px solid ${themeData.accent}` : '1px solid #333',
                    borderRadius: '8px',
                    padding: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setCurrentTheme(key)}
                >
                  <h4 style={{ margin: '0 0 10px 0', color: themeData.accent }}>{themeData.name}</h4>
                  <div style={{
                    background: themeData.background,
                    color: themeData.foreground,
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}>
                    $ echo "Hello World"<br/>
                    <span style={{ color: themeData.accent }}>Hello World</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                style={{
                  background: theme.accent,
                  border: 'none',
                  color: theme.background,
                  padding: '10px 30px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
                onClick={() => setShowThemeSelector(false)}
              >
                Apply Theme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
            border: `2px solid ${theme.accent}`,
            borderRadius: '12px',
            padding: '30px',
            minWidth: '400px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: theme.accent }}>⚙️ Terminal Settings</h2>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.foreground,
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
                onClick={() => setShowSettings(false)}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: theme.foreground }}>
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: theme.foreground }}>
                Font Family
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1a1a1a',
                  border: `1px solid ${theme.accent}`,
                  borderRadius: '4px',
                  color: theme.foreground
                }}
              >
                <option value="SF Mono">SF Mono</option>
                <option value="Monaco">Monaco</option>
                <option value="Menlo">Menlo</option>
                <option value="Consolas">Consolas</option>
                <option value="Courier New">Courier New</option>
                <option value="Fira Code">Fira Code</option>
              </select>
            </div>

            <div style={{
              background: theme.background,
              color: theme.foreground,
              padding: '12px',
              borderRadius: '6px',
              fontFamily: fontFamily,
              fontSize: `${fontSize}px`,
              marginBottom: '20px'
            }}>
              Preview: $ echo "Terminal settings preview"
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                style={{
                  background: theme.accent,
                  border: 'none',
                  color: theme.background,
                  padding: '10px 30px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
                onClick={() => setShowSettings(false)}
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestTerminal;
