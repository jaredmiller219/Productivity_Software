import React, { useState, useEffect } from 'react';
import './RiggingSystem.css';

const RiggingSystem = ({ 
  selectedObject, 
  onArmatureCreate,
  onBoneAdd,
  onBoneRemove,
  onBoneUpdate,
  onConstraintAdd,
  onConstraintRemove,
  onWeightPaint,
  armatures = [],
  selectedArmature = null,
  onArmatureSelect
}) => {
  const [activeTab, setActiveTab] = useState('bones');
  const [selectedBone, setSelectedBone] = useState(null);
  const [boneProperties, setBoneProperties] = useState({
    name: '',
    length: 1.0,
    roll: 0.0,
    head: [0, 0, 0],
    tail: [0, 1, 0],
    parent: null,
    deform: true,
    inherit_rotation: true,
    inherit_scale: true,
    local_location: true,
    envelope_distance: 0.25,
    envelope_weight: 1.0
  });

  const [constraints, setConstraints] = useState([]);
  const [weightPaintMode, setWeightPaintMode] = useState(false);

  const constraintTypes = [
    { type: 'copy_location', name: 'Copy Location', icon: '📍' },
    { type: 'copy_rotation', name: 'Copy Rotation', icon: '🔄' },
    { type: 'copy_scale', name: 'Copy Scale', icon: '📏' },
    { type: 'copy_transforms', name: 'Copy Transforms', icon: '🔄' },
    { type: 'limit_location', name: 'Limit Location', icon: '🚧' },
    { type: 'limit_rotation', name: 'Limit Rotation', icon: '🚧' },
    { type: 'limit_scale', name: 'Limit Scale', icon: '🚧' },
    { type: 'track_to', name: 'Track To', icon: '🎯' },
    { type: 'locked_track', name: 'Locked Track', icon: '🔒' },
    { type: 'damped_track', name: 'Damped Track', icon: '🎯' },
    { type: 'ik', name: 'Inverse Kinematics', icon: '🦴' },
    { type: 'spline_ik', name: 'Spline IK', icon: '📈' },
    { type: 'pivot', name: 'Pivot', icon: '⚡' },
    { type: 'follow_path', name: 'Follow Path', icon: '🛤️' },
    { type: 'clamp_to', name: 'Clamp To', icon: '🗜️' },
    { type: 'transform', name: 'Transform', icon: '🔧' },
    { type: 'action', name: 'Action', icon: '🎬' },
    { type: 'child_of', name: 'Child Of', icon: '👶' },
    { type: 'floor', name: 'Floor', icon: '🏠' },
    { type: 'shrinkwrap', name: 'Shrinkwrap', icon: '🧲' }
  ];

  const ikSolvers = [
    { value: 'legacy', name: 'Legacy' },
    { value: 'itasc', name: 'iTaSC' }
  ];

  useEffect(() => {
    if (selectedBone && selectedArmature) {
      const bone = selectedArmature.bones?.find(b => b.id === selectedBone);
      if (bone) {
        setBoneProperties(bone.properties || boneProperties);
      }
    }
  }, [selectedBone, selectedArmature]);

  const createArmature = () => {
    const newArmature = {
      id: Date.now(),
      name: `Armature.${armatures.length + 1}`,
      bones: [],
      display_type: 'octahedral',
      show_names: true,
      show_axes: false,
      show_in_front: false,
      layers: Array(32).fill(true).map((_, i) => i < 1)
    };

    if (onArmatureCreate) {
      onArmatureCreate(newArmature);
    }
  };

  const addBone = (parentBone = null) => {
    if (!selectedArmature) return;

    const newBone = {
      id: Date.now(),
      name: `Bone.${(selectedArmature.bones?.length || 0) + 1}`,
      parent: parentBone,
      children: [],
      properties: { ...boneProperties },
      constraints: []
    };

    if (onBoneAdd) {
      onBoneAdd(selectedArmature.id, newBone);
    }
  };

  const updateBoneProperty = (property, value) => {
    const newProperties = { ...boneProperties, [property]: value };
    setBoneProperties(newProperties);

    if (selectedBone && onBoneUpdate) {
      onBoneUpdate(selectedArmature.id, selectedBone, property, value);
    }
  };

  const addConstraint = (type) => {
    if (!selectedBone) return;

    const newConstraint = {
      id: Date.now(),
      type,
      name: constraintTypes.find(c => c.type === type)?.name || type,
      enabled: true,
      influence: 1.0,
      target: null,
      properties: getDefaultConstraintProperties(type)
    };

    setConstraints([...constraints, newConstraint]);

    if (onConstraintAdd) {
      onConstraintAdd(selectedArmature.id, selectedBone, newConstraint);
    }
  };

  const getDefaultConstraintProperties = (type) => {
    switch (type) {
      case 'ik':
        return {
          chain_count: 2,
          pole_target: null,
          pole_angle: 0,
          iterations: 500,
          use_tail: false,
          use_stretch: false,
          use_location: true,
          use_rotation: true,
          weight: 1.0,
          orient_weight: 1.0,
          pole_sub_target: '',
          reference_axis: 'bone'
        };
      case 'copy_location':
        return {
          use_x: true,
          use_y: true,
          use_z: true,
          invert_x: false,
          invert_y: false,
          invert_z: false,
          use_offset: false,
          target_space: 'world',
          owner_space: 'world'
        };
      case 'copy_rotation':
        return {
          use_x: true,
          use_y: true,
          use_z: true,
          invert_x: false,
          invert_y: false,
          invert_z: false,
          use_offset: false,
          target_space: 'world',
          owner_space: 'world',
          euler_order: 'auto'
        };
      case 'track_to':
        return {
          track_axis: 'track_y',
          up_axis: 'up_z',
          use_target_z: false,
          target_space: 'world',
          owner_space: 'world'
        };
      default:
        return {};
    }
  };

  const renderBonesTab = () => (
    <div className="bones-tab">
      <div className="armature-section">
        <div className="section-header">
          <h4>Armatures</h4>
          <button className="add-armature-btn" onClick={createArmature}>
            ➕ Add Armature
          </button>
        </div>
        
        <div className="armature-list">
          {armatures.map(armature => (
            <div 
              key={armature.id} 
              className={`armature-item ${selectedArmature?.id === armature.id ? 'selected' : ''}`}
              onClick={() => onArmatureSelect(armature)}
            >
              <span className="armature-icon">🦴</span>
              <span className="armature-name">{armature.name}</span>
              <span className="bone-count">({armature.bones?.length || 0} bones)</span>
            </div>
          ))}
        </div>
      </div>

      {selectedArmature && (
        <div className="bone-section">
          <div className="section-header">
            <h4>Bones</h4>
            <button className="add-bone-btn" onClick={() => addBone()}>
              ➕ Add Bone
            </button>
          </div>
          
          <div className="bone-list">
            {selectedArmature.bones?.map(bone => (
              <div 
                key={bone.id} 
                className={`bone-item ${selectedBone === bone.id ? 'selected' : ''}`}
                onClick={() => setSelectedBone(bone.id)}
              >
                <span className="bone-icon">🦴</span>
                <span className="bone-name">{bone.name}</span>
                {bone.parent && <span className="parent-indicator">↳</span>}
              </div>
            ))}
          </div>
          
          {selectedBone && (
            <div className="bone-properties">
              <h5>Bone Properties</h5>
              
              <div className="property-group">
                <label>Name</label>
                <input
                  type="text"
                  value={boneProperties.name}
                  onChange={(e) => updateBoneProperty('name', e.target.value)}
                />
              </div>
              
              <div className="property-group">
                <label>Length</label>
                <input
                  type="number"
                  step="0.01"
                  value={boneProperties.length}
                  onChange={(e) => updateBoneProperty('length', parseFloat(e.target.value))}
                />
              </div>
              
              <div className="property-group">
                <label>Roll (degrees)</label>
                <input
                  type="number"
                  step="1"
                  value={boneProperties.roll}
                  onChange={(e) => updateBoneProperty('roll', parseFloat(e.target.value))}
                />
              </div>
              
              <div className="property-group">
                <label>Head Position</label>
                <div className="vector-input">
                  <input
                    type="number"
                    step="0.01"
                    value={boneProperties.head[0]}
                    onChange={(e) => updateBoneProperty('head', [parseFloat(e.target.value), boneProperties.head[1], boneProperties.head[2]])}
                    placeholder="X"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={boneProperties.head[1]}
                    onChange={(e) => updateBoneProperty('head', [boneProperties.head[0], parseFloat(e.target.value), boneProperties.head[2]])}
                    placeholder="Y"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={boneProperties.head[2]}
                    onChange={(e) => updateBoneProperty('head', [boneProperties.head[0], boneProperties.head[1], parseFloat(e.target.value)])}
                    placeholder="Z"
                  />
                </div>
              </div>
              
              <div className="property-group">
                <label>Tail Position</label>
                <div className="vector-input">
                  <input
                    type="number"
                    step="0.01"
                    value={boneProperties.tail[0]}
                    onChange={(e) => updateBoneProperty('tail', [parseFloat(e.target.value), boneProperties.tail[1], boneProperties.tail[2]])}
                    placeholder="X"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={boneProperties.tail[1]}
                    onChange={(e) => updateBoneProperty('tail', [boneProperties.tail[0], parseFloat(e.target.value), boneProperties.tail[2]])}
                    placeholder="Y"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={boneProperties.tail[2]}
                    onChange={(e) => updateBoneProperty('tail', [boneProperties.tail[0], boneProperties.tail[1], parseFloat(e.target.value)])}
                    placeholder="Z"
                  />
                </div>
              </div>
              
              <div className="property-group">
                <label>
                  <input
                    type="checkbox"
                    checked={boneProperties.deform}
                    onChange={(e) => updateBoneProperty('deform', e.target.checked)}
                  />
                  Deform
                </label>
              </div>
              
              <div className="property-group">
                <label>
                  <input
                    type="checkbox"
                    checked={boneProperties.inherit_rotation}
                    onChange={(e) => updateBoneProperty('inherit_rotation', e.target.checked)}
                  />
                  Inherit Rotation
                </label>
              </div>
              
              <div className="property-group">
                <label>
                  <input
                    type="checkbox"
                    checked={boneProperties.inherit_scale}
                    onChange={(e) => updateBoneProperty('inherit_scale', e.target.checked)}
                  />
                  Inherit Scale
                </label>
              </div>
              
              <div className="property-group">
                <label>Envelope Distance</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={boneProperties.envelope_distance}
                  onChange={(e) => updateBoneProperty('envelope_distance', parseFloat(e.target.value))}
                />
              </div>
              
              <div className="property-group">
                <label>Envelope Weight</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={boneProperties.envelope_weight}
                  onChange={(e) => updateBoneProperty('envelope_weight', parseFloat(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderConstraintsTab = () => (
    <div className="constraints-tab">
      {!selectedBone ? (
        <div className="no-selection">
          <p>Select a bone to add constraints</p>
        </div>
      ) : (
        <>
          <div className="section-header">
            <h4>Bone Constraints</h4>
            <div className="constraint-add-dropdown">
              <select onChange={(e) => e.target.value && addConstraint(e.target.value)}>
                <option value="">Add Constraint...</option>
                {constraintTypes.map(constraint => (
                  <option key={constraint.type} value={constraint.type}>
                    {constraint.icon} {constraint.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="constraints-list">
            {constraints.map(constraint => (
              <div key={constraint.id} className="constraint-item">
                <div className="constraint-header">
                  <span className="constraint-icon">
                    {constraintTypes.find(c => c.type === constraint.type)?.icon}
                  </span>
                  <span className="constraint-name">{constraint.name}</span>
                  <div className="constraint-controls">
                    <button
                      className="constraint-toggle"
                      onClick={() => {
                        const updatedConstraints = constraints.map(c =>
                          c.id === constraint.id ? { ...c, enabled: !c.enabled } : c
                        );
                        setConstraints(updatedConstraints);
                      }}
                    >
                      {constraint.enabled ? '👁️' : '🚫'}
                    </button>
                    <button
                      className="constraint-remove"
                      onClick={() => {
                        setConstraints(constraints.filter(c => c.id !== constraint.id));
                        if (onConstraintRemove) {
                          onConstraintRemove(selectedArmature.id, selectedBone, constraint.id);
                        }
                      }}
                    >
                      ❌
                    </button>
                  </div>
                </div>
                
                <div className="constraint-properties">
                  <div className="property-group">
                    <label>Influence</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={constraint.influence}
                      onChange={(e) => {
                        const updatedConstraints = constraints.map(c =>
                          c.id === constraint.id ? { ...c, influence: parseFloat(e.target.value) } : c
                        );
                        setConstraints(updatedConstraints);
                      }}
                    />
                    <span>{constraint.influence.toFixed(2)}</span>
                  </div>
                  
                  {constraint.type === 'ik' && (
                    <>
                      <div className="property-group">
                        <label>Chain Length</label>
                        <input
                          type="number"
                          min="0"
                          value={constraint.properties.chain_count}
                          onChange={(e) => {
                            const updatedConstraints = constraints.map(c =>
                              c.id === constraint.id ? {
                                ...c,
                                properties: { ...c.properties, chain_count: parseInt(e.target.value) }
                              } : c
                            );
                            setConstraints(updatedConstraints);
                          }}
                        />
                      </div>
                      
                      <div className="property-group">
                        <label>Iterations</label>
                        <input
                          type="number"
                          min="1"
                          max="10000"
                          value={constraint.properties.iterations}
                          onChange={(e) => {
                            const updatedConstraints = constraints.map(c =>
                              c.id === constraint.id ? {
                                ...c,
                                properties: { ...c.properties, iterations: parseInt(e.target.value) }
                              } : c
                            );
                            setConstraints(updatedConstraints);
                          }}
                        />
                      </div>
                      
                      <div className="property-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={constraint.properties.use_tail}
                            onChange={(e) => {
                              const updatedConstraints = constraints.map(c =>
                                c.id === constraint.id ? {
                                  ...c,
                                  properties: { ...c.properties, use_tail: e.target.checked }
                                } : c
                              );
                              setConstraints(updatedConstraints);
                            }}
                          />
                          Use Tail
                        </label>
                      </div>
                      
                      <div className="property-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={constraint.properties.use_stretch}
                            onChange={(e) => {
                              const updatedConstraints = constraints.map(c =>
                                c.id === constraint.id ? {
                                  ...c,
                                  properties: { ...c.properties, use_stretch: e.target.checked }
                                } : c
                              );
                              setConstraints(updatedConstraints);
                            }}
                          />
                          Use Stretch
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderWeightPaintTab = () => (
    <div className="weight-paint-tab">
      <div className="section-header">
        <h4>Weight Painting</h4>
        <button
          className={`weight-paint-toggle ${weightPaintMode ? 'active' : ''}`}
          onClick={() => {
            setWeightPaintMode(!weightPaintMode);
            if (onWeightPaint) {
              onWeightPaint(!weightPaintMode);
            }
          }}
        >
          {weightPaintMode ? 'Exit Weight Paint' : 'Enter Weight Paint'}
        </button>
      </div>
      
      {weightPaintMode && (
        <div className="weight-paint-tools">
          <div className="brush-settings">
            <h5>Brush Settings</h5>
            
            <div className="property-group">
              <label>Brush Size</label>
              <input type="range" min="1" max="100" defaultValue="25" />
            </div>
            
            <div className="property-group">
              <label>Brush Strength</label>
              <input type="range" min="0" max="1" step="0.01" defaultValue="0.5" />
            </div>
            
            <div className="property-group">
              <label>Weight</label>
              <input type="range" min="0" max="1" step="0.01" defaultValue="1" />
            </div>
          </div>
          
          <div className="weight-tools">
            <h5>Weight Tools</h5>
            <button className="weight-tool">Normalize All</button>
            <button className="weight-tool">Normalize</button>
            <button className="weight-tool">Mirror</button>
            <button className="weight-tool">Invert</button>
            <button className="weight-tool">Clean</button>
            <button className="weight-tool">Levels</button>
            <button className="weight-tool">Smooth</button>
            <button className="weight-tool">Transfer Weights</button>
            <button className="weight-tool">Limit Total</button>
            <button className="weight-tool">Fix Deforms</button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="rigging-system">
      <div className="rigging-header">
        <h3>Rigging & Animation</h3>
        {!selectedObject && (
          <p className="no-selection">Select an object to set up rigging</p>
        )}
      </div>

      {selectedObject && (
        <>
          <div className="rigging-tabs">
            <button
              className={activeTab === 'bones' ? 'active' : ''}
              onClick={() => setActiveTab('bones')}
            >
              🦴 Bones
            </button>
            <button
              className={activeTab === 'constraints' ? 'active' : ''}
              onClick={() => setActiveTab('constraints')}
            >
              🔗 Constraints
            </button>
            <button
              className={activeTab === 'weights' ? 'active' : ''}
              onClick={() => setActiveTab('weights')}
            >
              🎨 Weight Paint
            </button>
          </div>

          <div className="rigging-content">
            {activeTab === 'bones' && renderBonesTab()}
            {activeTab === 'constraints' && renderConstraintsTab()}
            {activeTab === 'weights' && renderWeightPaintTab()}
          </div>
        </>
      )}
    </div>
  );
};

export default RiggingSystem;
