import React, { useState, useRef } from 'react';
import './EnhancedModifierStack.css';

const MODIFIER_CATEGORIES = {
  GENERATE: 'Generate',
  DEFORM: 'Deform',
  SIMULATE: 'Simulate',
  PHYSICS: 'Physics'
};

function EnhancedModifierStack({ selectedObject, onModifierChange }) {
  const [modifiers, setModifiers] = useState([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [draggedModifier, setDraggedModifier] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const dragCounter = useRef(0);

  const modifierTypes = {
    [MODIFIER_CATEGORIES.GENERATE]: [
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
    [MODIFIER_CATEGORIES.DEFORM]: [
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
    [MODIFIER_CATEGORIES.SIMULATE]: [
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
      showInEditMode: true,
      showInCage: false,
      showOnRender: true,
      properties: getDefaultProperties(type)
    };

    setModifiers([...modifiers, newModifier]);
    setShowAddMenu(false);
    onModifierChange([...modifiers, newModifier]);
  };

  const getDefaultProperties = (type) => {
    switch (type) {
      case 'array':
        return { 
          count: 3, 
          offset: [2, 0, 0], 
          useRelativeOffset: true,
          constantOffset: false,
          objectOffset: false,
          mergeDistance: 0.01,
          firstLast: false
        };
      case 'bevel':
        return { 
          amount: 0.1, 
          segments: 2, 
          profile: 0.5,
          material: -1,
          limitMethod: 'None',
          clampOverlap: false
        };
      case 'mirror':
        return { 
          axis: 'X', 
          useClipping: true, 
          mergeThreshold: 0.001,
          bisectAxis: [],
          flipU: false,
          flipV: false
        };
      case 'subsurf':
        return { 
          levels: 2, 
          renderLevels: 2, 
          useCreasing: true,
          type: 'Catmull-Clark',
          boundary: 'Smooth'
        };
      case 'solidify':
        return { 
          thickness: 0.1, 
          offset: 0, 
          useRim: true,
          evenThickness: false,
          highQualityNormals: false,
          onlyRim: false
        };
      case 'displace':
        return { 
          strength: 0.5, 
          midLevel: 0.5, 
          direction: 'NORMAL',
          texture: null,
          textureCoords: 'Local'
        };
      case 'wave':
        return { 
          height: 0.5, 
          width: 1.5, 
          speed: 1, 
          offset: 0,
          axis: 'Z',
          lifetime: 0,
          damping: 0
        };
      case 'boolean':
        return {
          operation: 'Difference',
          object: null,
          solver: 'Fast',
          overlap: 0.000001,
          gridSize: 0.0001
        };
      case 'decimate':
        return {
          type: 'Collapse',
          ratio: 0.5,
          angle: 5,
          iterations: 1,
          delimit: ['Normal']
        };
      default:
        return {};
    }
  };

  const removeModifier = (id) => {
    const newModifiers = modifiers.filter(mod => mod.id !== id);
    setModifiers(newModifiers);
    onModifierChange(newModifiers);
  };

  const toggleModifier = (id, property) => {
    const newModifiers = modifiers.map(mod => 
      mod.id === id ? { ...mod, [property]: !mod[property] } : mod
    );
    setModifiers(newModifiers);
    onModifierChange(newModifiers);
  };

  const updateModifierProperty = (id, property, value) => {
    const newModifiers = modifiers.map(mod => 
      mod.id === id ? { 
        ...mod, 
        properties: { ...mod.properties, [property]: value }
      } : mod
    );
    setModifiers(newModifiers);
    onModifierChange(newModifiers);
  };

  const moveModifier = (fromIndex, toIndex) => {
    const newModifiers = [...modifiers];
    const [movedModifier] = newModifiers.splice(fromIndex, 1);
    newModifiers.splice(toIndex, 0, movedModifier);
    setModifiers(newModifiers);
    onModifierChange(newModifiers);
  };

  const handleDragStart = (e, modifier, index) => {
    setDraggedModifier({ modifier, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedModifier && draggedModifier.index !== dropIndex) {
      moveModifier(draggedModifier.index, dropIndex);
    }
    setDraggedModifier(null);
    setDragOverIndex(null);
  };

  const filteredModifierTypes = Object.entries(modifierTypes).reduce((acc, [category, items]) => {
    const filteredItems = items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredItems.length > 0) {
      acc[category] = filteredItems;
    }
    return acc;
  }, {});

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
              <label>Relative Offset</label>
              <input
                type="checkbox"
                checked={properties.useRelativeOffset}
                onChange={(e) => updateModifierProperty(modifier.id, 'useRelativeOffset', e.target.checked)}
              />
            </div>
            <div className="property-row">
              <label>Merge Distance</label>
              <input
                type="number"
                step="0.001"
                value={properties.mergeDistance}
                onChange={(e) => updateModifierProperty(modifier.id, 'mergeDistance', parseFloat(e.target.value))}
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
                max="20"
                value={properties.segments}
                onChange={(e) => updateModifierProperty(modifier.id, 'segments', parseInt(e.target.value))}
              />
            </div>
            <div className="property-row">
              <label>Profile</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={properties.profile}
                onChange={(e) => updateModifierProperty(modifier.id, 'profile', parseFloat(e.target.value))}
              />
              <span>{properties.profile.toFixed(2)}</span>
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
              <label>Use Clipping</label>
              <input
                type="checkbox"
                checked={properties.useClipping}
                onChange={(e) => updateModifierProperty(modifier.id, 'useClipping', e.target.checked)}
              />
            </div>
            <div className="property-row">
              <label>Merge Threshold</label>
              <input
                type="number"
                step="0.0001"
                value={properties.mergeThreshold}
                onChange={(e) => updateModifierProperty(modifier.id, 'mergeThreshold', parseFloat(e.target.value))}
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="modifier-properties">
            <p>Properties for {modifier.name} modifier</p>
          </div>
        );
    }
  };

  return (
    <div className="enhanced-modifier-stack">
      <div className="modifier-header">
        <h3>Modifier Stack</h3>
        <button 
          className="add-modifier-btn"
          onClick={() => setShowAddMenu(!showAddMenu)}
        >
          + Add Modifier
        </button>
      </div>

      {showAddMenu && (
        <div className="add-modifier-menu">
          <div className="modifier-search">
            <input
              type="text"
              placeholder="Search modifiers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          {Object.entries(filteredModifierTypes).map(([category, items]) => (
            <div key={category} className="modifier-category">
              <h4>{category}</h4>
              <div className="modifier-items">
                {items.map(item => (
                  <button
                    key={item.type}
                    className="modifier-item"
                    onClick={() => addModifier(item.type, category)}
                    title={item.description}
                  >
                    <span className="modifier-icon">{item.icon}</span>
                    <span className="modifier-name">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="modifier-list">
        {modifiers.map((modifier, index) => (
          <div 
            key={modifier.id} 
            className={`modifier-item-container ${dragOverIndex === index ? 'drag-over' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, modifier, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className="modifier-header-item">
              <div className="modifier-info">
                <span className="modifier-icon">{modifier.icon}</span>
                <span className="modifier-name">{modifier.name}</span>
              </div>
              <div className="modifier-controls">
                <button
                  className={`modifier-toggle ${modifier.showInEditMode ? 'enabled' : ''}`}
                  onClick={() => toggleModifier(modifier.id, 'showInEditMode')}
                  title="Show in Edit Mode"
                >
                  📝
                </button>
                <button
                  className={`modifier-toggle ${modifier.showOnRender ? 'enabled' : ''}`}
                  onClick={() => toggleModifier(modifier.id, 'showOnRender')}
                  title="Show on Render"
                >
                  🎬
                </button>
                <button
                  className={`modifier-toggle ${modifier.enabled ? 'enabled' : ''}`}
                  onClick={() => toggleModifier(modifier.id, 'enabled')}
                  title="Toggle modifier"
                >
                  👁️
                </button>
                <button
                  className="modifier-expand"
                  onClick={() => toggleModifier(modifier.id, 'expanded')}
                  title="Expand/Collapse"
                >
                  {modifier.expanded ? '▼' : '▶'}
                </button>
                <button
                  className="modifier-remove"
                  onClick={() => removeModifier(modifier.id)}
                  title="Remove modifier"
                >
                  ×
                </button>
              </div>
            </div>
            
            {modifier.expanded && renderModifierProperties(modifier)}
          </div>
        ))}
        
        {modifiers.length === 0 && (
          <div className="empty-modifier-stack">
            <p>No modifiers added</p>
            <p>Click "Add Modifier" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnhancedModifierStack;
