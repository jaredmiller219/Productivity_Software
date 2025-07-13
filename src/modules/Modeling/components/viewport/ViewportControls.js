import React, { useState } from 'react';
import './ViewportControls.css';

const VIEWPORT_MODES = {
  SOLID: 'solid',
  WIREFRAME: 'wireframe',
  MATERIAL: 'material',
  RENDERED: 'rendered'
};

const SHADING_MODES = {
  FLAT: 'flat',
  SMOOTH: 'smooth',
  MATCAP: 'matcap'
};

const CAMERA_VIEWS = {
  FRONT: 'front',
  BACK: 'back',
  RIGHT: 'right',
  LEFT: 'left',
  TOP: 'top',
  BOTTOM: 'bottom',
  CAMERA: 'camera',
  PERSPECTIVE: 'perspective'
};

function ViewportControls({
  viewportMode = VIEWPORT_MODES.SOLID,
  shadingMode = SHADING_MODES.SMOOTH,
  currentView = CAMERA_VIEWS.PERSPECTIVE,
  showGrid = true,
  showAxes = true,
  showOutlines = true,
  showOverlays = true,
  onViewportModeChange,
  onShadingModeChange,
  onViewChange,
  onToggleGrid,
  onToggleAxes,
  onToggleOutlines,
  onToggleOverlays,
  onResetView,
  onFrameSelected,
  onFrameAll
}) {
  const [showViewportMenu, setShowViewportMenu] = useState(false);
  const [showShadingMenu, setShowShadingMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);

  const getViewportModeIcon = (mode) => {
    switch (mode) {
      case VIEWPORT_MODES.SOLID: return '🔘';
      case VIEWPORT_MODES.WIREFRAME: return '⬜';
      case VIEWPORT_MODES.MATERIAL: return '🎨';
      case VIEWPORT_MODES.RENDERED: return '✨';
      default: return '🔘';
    }
  };

  const getShadingModeIcon = (mode) => {
    switch (mode) {
      case SHADING_MODES.FLAT: return '▢';
      case SHADING_MODES.SMOOTH: return '●';
      case SHADING_MODES.MATCAP: return '🌐';
      default: return '●';
    }
  };

  const getViewIcon = (view) => {
    switch (view) {
      case CAMERA_VIEWS.FRONT: return '⬆️';
      case CAMERA_VIEWS.BACK: return '⬇️';
      case CAMERA_VIEWS.RIGHT: return '➡️';
      case CAMERA_VIEWS.LEFT: return '⬅️';
      case CAMERA_VIEWS.TOP: return '🔝';
      case CAMERA_VIEWS.BOTTOM: return '🔽';
      case CAMERA_VIEWS.CAMERA: return '📷';
      case CAMERA_VIEWS.PERSPECTIVE: return '👁️';
      default: return '👁️';
    }
  };

  return (
    <div className="viewport-controls">
      <div className="viewport-controls-left">
        {/* Viewport Mode Controls */}
        <div className="control-group">
          <div className="control-dropdown">
            <button 
              className={`control-btn ${showViewportMenu ? 'active' : ''}`}
              onClick={() => setShowViewportMenu(!showViewportMenu)}
              title="Viewport Shading"
            >
              {getViewportModeIcon(viewportMode)}
            </button>
            {showViewportMenu && (
              <div className="dropdown-menu">
                {Object.values(VIEWPORT_MODES).map(mode => (
                  <button
                    key={mode}
                    className={`dropdown-item ${viewportMode === mode ? 'active' : ''}`}
                    onClick={() => {
                      onViewportModeChange(mode);
                      setShowViewportMenu(false);
                    }}
                  >
                    {getViewportModeIcon(mode)} {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="control-dropdown">
            <button 
              className={`control-btn ${showShadingMenu ? 'active' : ''}`}
              onClick={() => setShowShadingMenu(!showShadingMenu)}
              title="Shading Mode"
            >
              {getShadingModeIcon(shadingMode)}
            </button>
            {showShadingMenu && (
              <div className="dropdown-menu">
                {Object.values(SHADING_MODES).map(mode => (
                  <button
                    key={mode}
                    className={`dropdown-item ${shadingMode === mode ? 'active' : ''}`}
                    onClick={() => {
                      onShadingModeChange(mode);
                      setShowShadingMenu(false);
                    }}
                  >
                    {getShadingModeIcon(mode)} {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Overlay Controls */}
        <div className="control-group">
          <button 
            className={`control-btn ${showGrid ? 'active' : ''}`}
            onClick={onToggleGrid}
            title="Toggle Grid"
          >
            ⊞
          </button>
          <button 
            className={`control-btn ${showAxes ? 'active' : ''}`}
            onClick={onToggleAxes}
            title="Toggle Axes"
          >
            ⚡
          </button>
          <button 
            className={`control-btn ${showOutlines ? 'active' : ''}`}
            onClick={onToggleOutlines}
            title="Toggle Outlines"
          >
            ⬜
          </button>
          <button 
            className={`control-btn ${showOverlays ? 'active' : ''}`}
            onClick={onToggleOverlays}
            title="Toggle Overlays"
          >
            👁️
          </button>
        </div>
      </div>

      <div className="viewport-controls-center">
        {/* View Controls */}
        <div className="control-dropdown">
          <button 
            className={`control-btn view-btn ${showViewMenu ? 'active' : ''}`}
            onClick={() => setShowViewMenu(!showViewMenu)}
            title="Camera View"
          >
            {getViewIcon(currentView)} {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
          </button>
          {showViewMenu && (
            <div className="dropdown-menu view-menu">
              <div className="view-grid">
                {Object.entries(CAMERA_VIEWS).map(([key, view]) => (
                  <button
                    key={view}
                    className={`view-item ${currentView === view ? 'active' : ''}`}
                    onClick={() => {
                      onViewChange(view);
                      setShowViewMenu(false);
                    }}
                    title={view.charAt(0).toUpperCase() + view.slice(1)}
                  >
                    {getViewIcon(view)}
                  </button>
                ))}
              </div>
              <div className="view-actions">
                <button className="dropdown-item" onClick={onResetView}>
                  🔄 Reset View
                </button>
                <button className="dropdown-item" onClick={onFrameSelected}>
                  🎯 Frame Selected
                </button>
                <button className="dropdown-item" onClick={onFrameAll}>
                  📦 Frame All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="viewport-controls-right">
        {/* Quick Actions */}
        <div className="control-group">
          <button 
            className="control-btn"
            onClick={onFrameSelected}
            title="Frame Selected (Numpad .)"
          >
            🎯
          </button>
          <button 
            className="control-btn"
            onClick={onFrameAll}
            title="Frame All (Home)"
          >
            📦
          </button>
          <button 
            className="control-btn"
            onClick={onResetView}
            title="Reset View"
          >
            🔄
          </button>
        </div>
      </div>
    </div>
  );
}

export { VIEWPORT_MODES, SHADING_MODES, CAMERA_VIEWS };
export default ViewportControls;
