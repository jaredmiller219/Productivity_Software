import React from 'react';
import './ModelingToolbar.css';

const ModelingToolbar = ({
  mode,
  setMode,
  snapToGrid,
  setSnapToGrid,
  selectedObject,
  onAddObject,
  onDeleteSelected,
  onDuplicateSelected,
  onSubdivideSelected,
  onToggleWireframe
}) => {
  // Define toolbar items with icons
  const toolbarItems = [
    // Add Objects
    { type: 'section', title: 'Add Objects' },
    { type: 'button', icon: '🧊', label: 'Cube', action: () => onAddObject("cube", { color: 0x3498db }), tooltip: 'Add Cube' },
    { type: 'button', icon: '⚪', label: 'Sphere', action: () => onAddObject("sphere", { color: 0xe74c3c }), tooltip: 'Add Sphere' },
    { type: 'button', icon: '🥫', label: 'Cylinder', action: () => onAddObject("cylinder", { color: 0x2ecc71 }), tooltip: 'Add Cylinder' },
    { type: 'button', icon: '🔺', label: 'Cone', action: () => onAddObject("cone", { color: 0xf39c12 }), tooltip: 'Add Cone' },
    { type: 'button', icon: '🍩', label: 'Torus', action: () => onAddObject("torus", { color: 0x9b59b6 }), tooltip: 'Add Torus' },
    { type: 'button', icon: '⬜', label: 'Plane', action: () => onAddObject("plane", { color: 0x95a5a6 }), tooltip: 'Add Plane' },
    { type: 'button', icon: '💎', label: 'Icosahedron', action: () => onAddObject("icosahedron", { color: 0x1abc9c }), tooltip: 'Add Icosahedron' },
    { type: 'button', icon: '🎲', label: 'Dodecahedron', action: () => onAddObject("dodecahedron", { color: 0xe67e22 }), tooltip: 'Add Dodecahedron' },
    { type: 'button', icon: '🔷', label: 'Octahedron', action: () => onAddObject("octahedron", { color: 0x34495e }), tooltip: 'Add Octahedron' },
    { type: 'button', icon: '🔻', label: 'Tetrahedron', action: () => onAddObject("tetrahedron", { color: 0x8e44ad }), tooltip: 'Add Tetrahedron' },
    
    { type: 'separator' },
    
    // Transform
    { type: 'section', title: 'Transform' },
    { type: 'button', icon: '↔️', label: 'Move', action: () => setMode("translate"), active: mode === "translate", tooltip: 'Move (G)' },
    { type: 'button', icon: '🔄', label: 'Rotate', action: () => setMode("rotate"), active: mode === "rotate", tooltip: 'Rotate (R)' },
    { type: 'button', icon: '📏', label: 'Scale', action: () => setMode("scale"), active: mode === "scale", tooltip: 'Scale (S)' },
    
    { type: 'separator' },
    
    // Edit
    { type: 'section', title: 'Edit' },
    { type: 'button', icon: '🗑️', label: 'Delete', action: onDeleteSelected, disabled: !selectedObject, tooltip: 'Delete (X)' },
    { type: 'button', icon: '📋', label: 'Duplicate', action: onDuplicateSelected, disabled: !selectedObject, tooltip: 'Duplicate (Shift+D)' },
    { type: 'button', icon: '🔀', label: 'Subdivide', action: onSubdivideSelected, disabled: !selectedObject, tooltip: 'Subdivide' },
    
    { type: 'separator' },
    
    // View
    { type: 'section', title: 'View' },
    { type: 'button', icon: '🕸️', label: 'Wireframe', action: onToggleWireframe, disabled: !selectedObject, tooltip: 'Toggle Wireframe' },
    { type: 'toggle', icon: '🧲', label: 'Snap to Grid', checked: snapToGrid, action: setSnapToGrid, tooltip: 'Snap to Grid' },
  ];

  const renderToolbarItem = (item, index) => {
    if (item.type === 'section') {
      return (
        <div key={index} className="toolbar-section-header">
          <span>{item.title}</span>
        </div>
      );
    } else if (item.type === 'separator') {
      return <div key={index} className="toolbar-separator" />;
    } else if (item.type === 'button') {
      return (
        <button
          key={index}
          className={`toolbar-btn ${item.active ? 'active' : ''}`}
          onClick={item.action}
          disabled={item.disabled}
          title={item.tooltip}
        >
          <span className="btn-icon">{item.icon}</span>
          <span className="btn-label">{item.label}</span>
        </button>
      );
    } else if (item.type === 'toggle') {
      return (
        <label key={index} className="toolbar-toggle" title={item.tooltip}>
          <input
            type="checkbox"
            checked={item.checked}
            onChange={(e) => item.action(e.target.checked)}
          />
          <span className="toggle-icon">{item.icon}</span>
          <span className="toggle-label">{item.label}</span>
        </label>
      );
    }
    return null;
  };

  return (
    <div className="modeling-toolbar-container">
      <div className="modeling-toolbar-scroll">
        {toolbarItems.map(renderToolbarItem)}
      </div>
    </div>
  );
};

export default ModelingToolbar;
