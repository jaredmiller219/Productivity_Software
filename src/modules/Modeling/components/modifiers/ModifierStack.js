import React, { useState } from 'react';
import './ModifierStack.css';

const ModifierStack = ({ selectedObject, onModifierAdd, onModifierRemove, onModifierUpdate }) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [modifiers, setModifiers] = useState([]);

  const modifierTypes = {
    generate: [
      { type: 'array', name: 'Array', icon: '📋', description: 'Create copies of the object' },
      { type: 'bevel', name: 'Bevel', icon: '🔄', description: 'Round off edges' },
      { type: 'boolean', name: 'Boolean', icon: '🔗', description: 'Combine objects' },
      { type: 'build', name: 'Build', icon: '🏗️', description: 'Animate object construction' },
      { type: 'decimate', name: 'Decimate', icon: '📉', description: 'Reduce polygon count' },
      { type: 'edge-split', name: 'Edge Split', icon: '✂️', description: 'Split edges by angle' },
      { type: 'mask', name: 'Mask', icon: '🎭', description: 'Hide parts of the mesh' },
      { type: 'mirror', name: 'Mirror', icon: '🪞', description: 'Mirror across an axis' },
      { type: 'multires', name: 'Multiresolution', icon: '📈', description: 'Multiple resolution levels' },
      { type: 'remesh', name: 'Remesh', icon: '🔄', description: 'Recreate mesh topology' },
      { type: 'screw', name: 'Screw', icon: '🔩', description: 'Revolve around axis' },
      { type: 'skin', name: 'Skin', icon: '🧬', description: 'Create skin from edges' },
      { type: 'solidify', name: 'Solidify', icon: '📦', description: 'Add thickness' },
      { type: 'subsurf', name: 'Subdivision Surface', icon: '📈', description: 'Smooth subdivision' },
      { type: 'triangulate', name: 'Triangulate', icon: '🔺', description: 'Convert to triangles' },
      { type: 'wireframe', name: 'Wireframe', icon: '🕸️', description: 'Convert to wireframe' }
    ],
    deform: [
      { type: 'armature', name: 'Armature', icon: '🦴', description: 'Deform with bones' },
      { type: 'cast', name: 'Cast', icon: '🎭', description: 'Cast to shape' },
      { type: 'curve', name: 'Curve', icon: '📈', description: 'Deform along curve' },
      { type: 'displace', name: 'Displace', icon: '🌊', description: 'Displace vertices' },
      { type: 'hook', name: 'Hook', icon: '🪝', description: 'Hook to object' },
      { type: 'laplacian-deform', name: 'Laplacian Deform', icon: '🌊', description: 'Smooth deformation' },
      { type: 'laplacian-smooth', name: 'Laplacian Smooth', icon: '🌊', description: 'Smooth mesh' },
      { type: 'lattice', name: 'Lattice', icon: '🕸️', description: 'Deform with lattice' },
      { type: 'mesh-deform', name: 'Mesh Deform', icon: '🔧', description: 'Deform with mesh' },
      { type: 'shrinkwrap', name: 'Shrinkwrap', icon: '🧲', description: 'Project onto surface' },
      { type: 'simple-deform', name: 'Simple Deform', icon: '🔧', description: 'Simple deformations' },
      { type: 'smooth', name: 'Smooth', icon: '🌊', description: 'Smooth vertices' },
      { type: 'surface-deform', name: 'Surface Deform', icon: '🌊', description: 'Deform along surface' },
      { type: 'warp', name: 'Warp', icon: '🌀', description: 'Warp between objects' },
      { type: 'wave', name: 'Wave', icon: '🌊', description: 'Wave deformation' }
    ],
    physics: [
      { type: 'cloth', name: 'Cloth', icon: '🧵', description: 'Cloth simulation' },
      { type: 'collision', name: 'Collision', icon: '💥', description: 'Collision detection' },
      { type: 'dynamic-paint', name: 'Dynamic Paint', icon: '🎨', description: 'Dynamic painting' },
      { type: 'explode', name: 'Explode', icon: '💥', description: 'Explode particles' },
      { type: 'fluid', name: 'Fluid', icon: '💧', description: 'Fluid simulation' },
      { type: 'ocean', name: 'Ocean', icon: '🌊', description: 'Ocean simulation' },
      { type: 'particle-instance', name: 'Particle Instance', icon: '✨', description: 'Instance particles' },
      { type: 'particle-system', name: 'Particle System', icon: '✨', description: 'Particle effects' },
      { type: 'soft-body', name: 'Soft Body', icon: '🫧', description: 'Soft body physics' }
    ]
  };

  const addModifier = (type, category) => {
    const modifierInfo = modifierTypes[category].find(m => m.type === type);
    const newModifier = {
      id: Date.now(),
      type,
      name: modifierInfo.name,
      icon: modifierInfo.icon,
      enabled: true,
      expanded: true,
      properties: getDefaultProperties(type)
    };

    setModifiers([...modifiers, newModifier]);
    setShowAddMenu(false);

    if (onModifierAdd) {
      onModifierAdd(newModifier);
    }
  };

  const removeModifier = (id) => {
    setModifiers(modifiers.filter(m => m.id !== id));
    if (onModifierRemove) {
      onModifierRemove(id);
    }
  };

  const toggleModifier = (id) => {
    setModifiers(modifiers.map(m => 
      m.id === id ? { ...m, enabled: !m.enabled } : m
    ));
  };

  const toggleExpanded = (id) => {
    setModifiers(modifiers.map(m => 
      m.id === id ? { ...m, expanded: !m.expanded } : m
    ));
  };

  const updateModifierProperty = (id, property, value) => {
    setModifiers(modifiers.map(m => 
      m.id === id ? { 
        ...m, 
        properties: { ...m.properties, [property]: value }
      } : m
    ));

    if (onModifierUpdate) {
      onModifierUpdate(id, property, value);
    }
  };

  const moveModifier = (id, direction) => {
    const index = modifiers.findIndex(m => m.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= modifiers.length) return;

    const newModifiers = [...modifiers];
    [newModifiers[index], newModifiers[newIndex]] = [newModifiers[newIndex], newModifiers[index]];
    setModifiers(newModifiers);
  };

  const getDefaultProperties = (type) => {
    switch (type) {
      case 'array':
        return { count: 3, offset: [2, 0, 0], useRelativeOffset: true };
      case 'bevel':
        return { amount: 0.1, segments: 2, profile: 0.5 };
      case 'mirror':
        return { axis: 'X', useClipping: true, mergeThreshold: 0.001 };
      case 'subsurf':
        return { levels: 2, renderLevels: 2, useCreasing: true };
      case 'solidify':
        return { thickness: 0.1, offset: 0, useRim: true };
      case 'displace':
        return { strength: 0.5, midLevel: 0.5, direction: 'NORMAL' };
      case 'wave':
        return { height: 0.5, width: 1.5, speed: 1, offset: 0 };
      case 'smooth':
        return { factor: 0.5, iterations: 1, useX: true, useY: true, useZ: true };
      default:
        return {};
    }
  };

  const renderModifierProperties = (modifier) => {
    const { type, properties } = modifier;

    switch (type) {
      case 'array':
        return (
          <div className="modifier-properties">
            <div className="property-row">
              <label>Count</label>
              <input
                type="number"
                min="1"
                max="100"
                value={properties.count}
                onChange={(e) => updateModifierProperty(modifier.id, 'count', parseInt(e.target.value))}
              />
            </div>
            <div className="property-row">
              <label>Offset X</label>
              <input
                type="number"
                step="0.1"
                value={properties.offset[0]}
                onChange={(e) => updateModifierProperty(modifier.id, 'offset', [parseFloat(e.target.value), properties.offset[1], properties.offset[2]])}
              />
            </div>
          </div>
        );

      case 'bevel':
        return (
          <div className="modifier-properties">
            <div className="property-row">
              <label>Amount</label>
              <input
                type="number"
                min="0"
                max="2"
                step="0.01"
                value={properties.amount}
                onChange={(e) => updateModifierProperty(modifier.id, 'amount', parseFloat(e.target.value))}
              />
            </div>
            <div className="property-row">
              <label>Segments</label>
              <input
                type="number"
                min="1"
                max="10"
                value={properties.segments}
                onChange={(e) => updateModifierProperty(modifier.id, 'segments', parseInt(e.target.value))}
              />
            </div>
          </div>
        );

      case 'mirror':
        return (
          <div className="modifier-properties">
            <div className="property-row">
              <label>Axis</label>
              <select
                value={properties.axis}
                onChange={(e) => updateModifierProperty(modifier.id, 'axis', e.target.value)}
              >
                <option value="X">X</option>
                <option value="Y">Y</option>
                <option value="Z">Z</option>
              </select>
            </div>
            <div className="property-row">
              <label>
                <input
                  type="checkbox"
                  checked={properties.useClipping}
                  onChange={(e) => updateModifierProperty(modifier.id, 'useClipping', e.target.checked)}
                />
                Use Clipping
              </label>
            </div>
          </div>
        );

      case 'subsurf':
        return (
          <div className="modifier-properties">
            <div className="property-row">
              <label>Levels</label>
              <input
                type="number"
                min="0"
                max="6"
                value={properties.levels}
                onChange={(e) => updateModifierProperty(modifier.id, 'levels', parseInt(e.target.value))}
              />
            </div>
            <div className="property-row">
              <label>Render Levels</label>
              <input
                type="number"
                min="0"
                max="6"
                value={properties.renderLevels}
                onChange={(e) => updateModifierProperty(modifier.id, 'renderLevels', parseInt(e.target.value))}
              />
            </div>
          </div>
        );

      case 'solidify':
        return (
          <div className="modifier-properties">
            <div className="property-row">
              <label>Thickness</label>
              <input
                type="number"
                step="0.01"
                value={properties.thickness}
                onChange={(e) => updateModifierProperty(modifier.id, 'thickness', parseFloat(e.target.value))}
              />
            </div>
            <div className="property-row">
              <label>Offset</label>
              <input
                type="number"
                min="-1"
                max="1"
                step="0.01"
                value={properties.offset}
                onChange={(e) => updateModifierProperty(modifier.id, 'offset', parseFloat(e.target.value))}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="modifier-properties">
            <p>Properties for {modifier.name}</p>
          </div>
        );
    }
  };

  return (
    <div className="modifier-stack">
      <div className="modifier-header">
        <h3>Modifier Properties</h3>
        {!selectedObject && (
          <p className="no-selection">Select an object to add modifiers</p>
        )}
      </div>

      {selectedObject && (
        <>
          <div className="modifier-add-section">
            <button
              className="add-modifier-btn"
              onClick={() => setShowAddMenu(!showAddMenu)}
            >
              ➕ Add Modifier
            </button>

            {showAddMenu && (
              <div className="add-modifier-menu">
                {Object.entries(modifierTypes).map(([category, types]) => (
                  <div key={category} className="modifier-category">
                    <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                    <div className="modifier-grid">
                      {types.map(modifier => (
                        <button
                          key={modifier.type}
                          className="modifier-option"
                          onClick={() => addModifier(modifier.type, category)}
                          title={modifier.description}
                        >
                          <span className="modifier-icon">{modifier.icon}</span>
                          <span className="modifier-name">{modifier.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modifier-list">
            {modifiers.length === 0 ? (
              <p className="no-modifiers">No modifiers added</p>
            ) : (
              modifiers.map((modifier, index) => (
                <div key={modifier.id} className={`modifier-item ${!modifier.enabled ? 'disabled' : ''}`}>
                  <div className="modifier-header-row">
                    <div className="modifier-info">
                      <span className="modifier-icon">{modifier.icon}</span>
                      <span className="modifier-name">{modifier.name}</span>
                    </div>
                    <div className="modifier-controls">
                      <button
                        className="modifier-toggle"
                        onClick={() => toggleModifier(modifier.id)}
                        title={modifier.enabled ? 'Disable' : 'Enable'}
                      >
                        {modifier.enabled ? '👁️' : '🚫'}
                      </button>
                      <button
                        className="modifier-expand"
                        onClick={() => toggleExpanded(modifier.id)}
                        title={modifier.expanded ? 'Collapse' : 'Expand'}
                      >
                        {modifier.expanded ? '🔽' : '▶️'}
                      </button>
                      <button
                        className="modifier-move"
                        onClick={() => moveModifier(modifier.id, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                      >
                        ⬆️
                      </button>
                      <button
                        className="modifier-move"
                        onClick={() => moveModifier(modifier.id, 'down')}
                        disabled={index === modifiers.length - 1}
                        title="Move Down"
                      >
                        ⬇️
                      </button>
                      <button
                        className="modifier-remove"
                        onClick={() => removeModifier(modifier.id)}
                        title="Remove"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                  {modifier.expanded && renderModifierProperties(modifier)}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ModifierStack;
