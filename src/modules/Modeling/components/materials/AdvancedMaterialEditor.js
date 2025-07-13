import React, { useState } from 'react';
import './AdvancedMaterialEditor.css';

const MATERIAL_TYPES = {
  PRINCIPLED: 'principled',
  DIFFUSE: 'diffuse',
  GLOSSY: 'glossy',
  EMISSION: 'emission',
  GLASS: 'glass',
  TRANSPARENT: 'transparent',
  SUBSURFACE: 'subsurface',
  TOON: 'toon',
  ANISOTROPIC: 'anisotropic',
  VELVET: 'velvet'
};

const TEXTURE_TYPES = {
  IMAGE: 'image',
  NOISE: 'noise',
  VORONOI: 'voronoi',
  MUSGRAVE: 'musgrave',
  WAVE: 'wave',
  MAGIC: 'magic',
  BRICK: 'brick',
  CHECKER: 'checker',
  GRADIENT: 'gradient'
};

function AdvancedMaterialEditor({ selectedObject, onMaterialChange }) {
  const [activeTab, setActiveTab] = useState('surface');
  const [material, setMaterial] = useState({
    name: 'Material',
    type: MATERIAL_TYPES.PRINCIPLED,
    baseColor: '#ffffff',
    metallic: 0,
    roughness: 0.5,
    specular: 0.5,
    emission: '#000000',
    emissionStrength: 0,
    alpha: 1,
    ior: 1.45,
    transmission: 0,
    subsurface: 0,
    subsurfaceColor: '#ffffff',
    subsurfaceRadius: [1, 0.2, 0.1],
    anisotropic: 0,
    anisotropicRotation: 0,
    sheen: 0,
    sheenTint: 0,
    clearcoat: 0,
    clearcoatRoughness: 0.03,
    normalStrength: 1,
    displacementScale: 0.1,
    textures: {
      baseColor: null,
      metallic: null,
      roughness: null,
      normal: null,
      emission: null,
      displacement: null,
      alpha: null,
      subsurface: null
    }
  });

  const [showTexturePanel, setShowTexturePanel] = useState(false);
  const [activeTextureSlot, setActiveTextureSlot] = useState(null);
  const [materialPresets, setMaterialPresets] = useState([
    { name: 'Metal', type: MATERIAL_TYPES.PRINCIPLED, metallic: 1, roughness: 0.2 },
    { name: 'Plastic', type: MATERIAL_TYPES.PRINCIPLED, metallic: 0, roughness: 0.4 },
    { name: 'Glass', type: MATERIAL_TYPES.GLASS, transmission: 1, ior: 1.5 },
    { name: 'Rubber', type: MATERIAL_TYPES.PRINCIPLED, metallic: 0, roughness: 0.8 },
    { name: 'Ceramic', type: MATERIAL_TYPES.PRINCIPLED, metallic: 0, roughness: 0.1 },
    { name: 'Fabric', type: MATERIAL_TYPES.PRINCIPLED, metallic: 0, roughness: 0.9, sheen: 0.5 }
  ]);

  const handleMaterialChange = (property, value) => {
    const newMaterial = { ...material, [property]: value };
    setMaterial(newMaterial);
    onMaterialChange(newMaterial);
  };

  const handleTextureChange = (slot, texture) => {
    const newMaterial = {
      ...material,
      textures: {
        ...material.textures,
        [slot]: texture
      }
    };
    setMaterial(newMaterial);
    onMaterialChange(newMaterial);
  };

  const applyPreset = (preset) => {
    const newMaterial = { ...material, ...preset };
    setMaterial(newMaterial);
    onMaterialChange(newMaterial);
  };

  const openTexturePanel = (slot) => {
    setActiveTextureSlot(slot);
    setShowTexturePanel(true);
  };

  const renderColorProperty = (label, property, showTexture = true) => (
    <div className="material-property color-property">
      <label>{label}</label>
      <div className="color-input-group">
        <input
          type="color"
          value={material[property]}
          onChange={(e) => handleMaterialChange(property, e.target.value)}
        />
        <span className="color-hex">{material[property]}</span>
        {showTexture && (
          <button
            className={`texture-btn ${material.textures[property] ? 'has-texture' : ''}`}
            onClick={() => openTexturePanel(property)}
            title="Add Texture"
          >
            🖼️
          </button>
        )}
      </div>
    </div>
  );

  const renderSliderProperty = (label, property, min = 0, max = 1, step = 0.01, showTexture = true) => (
    <div className="material-property slider-property">
      <label>{label}</label>
      <div className="slider-input-group">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={material[property]}
          onChange={(e) => handleMaterialChange(property, parseFloat(e.target.value))}
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={material[property]}
          onChange={(e) => handleMaterialChange(property, parseFloat(e.target.value))}
          className="number-input"
        />
        {showTexture && (
          <button
            className={`texture-btn ${material.textures[property] ? 'has-texture' : ''}`}
            onClick={() => openTexturePanel(property)}
            title="Add Texture"
          >
            🖼️
          </button>
        )}
      </div>
    </div>
  );

  const renderSurfaceTab = () => (
    <div className="material-tab-content">
      <div className="material-section">
        <h4>Base Properties</h4>
        {renderColorProperty('Base Color', 'baseColor')}
        {renderSliderProperty('Metallic', 'metallic')}
        {renderSliderProperty('Roughness', 'roughness')}
        {renderSliderProperty('Specular', 'specular')}
        {renderSliderProperty('IOR', 'ior', 1, 3, 0.01, false)}
      </div>

      <div className="material-section">
        <h4>Transmission & Transparency</h4>
        {renderSliderProperty('Transmission', 'transmission')}
        {renderSliderProperty('Alpha', 'alpha')}
      </div>

      <div className="material-section">
        <h4>Subsurface Scattering</h4>
        {renderSliderProperty('Subsurface', 'subsurface')}
        {renderColorProperty('Subsurface Color', 'subsurfaceColor', false)}
        <div className="material-property">
          <label>Subsurface Radius (RGB)</label>
          <div className="vector-input">
            <input
              type="number"
              step="0.1"
              value={material.subsurfaceRadius[0]}
              onChange={(e) => {
                const newRadius = [...material.subsurfaceRadius];
                newRadius[0] = parseFloat(e.target.value);
                handleMaterialChange('subsurfaceRadius', newRadius);
              }}
              placeholder="R"
            />
            <input
              type="number"
              step="0.1"
              value={material.subsurfaceRadius[1]}
              onChange={(e) => {
                const newRadius = [...material.subsurfaceRadius];
                newRadius[1] = parseFloat(e.target.value);
                handleMaterialChange('subsurfaceRadius', newRadius);
              }}
              placeholder="G"
            />
            <input
              type="number"
              step="0.1"
              value={material.subsurfaceRadius[2]}
              onChange={(e) => {
                const newRadius = [...material.subsurfaceRadius];
                newRadius[2] = parseFloat(e.target.value);
                handleMaterialChange('subsurfaceRadius', newRadius);
              }}
              placeholder="B"
            />
          </div>
        </div>
      </div>

      <div className="material-section">
        <h4>Emission</h4>
        {renderColorProperty('Emission', 'emission')}
        {renderSliderProperty('Emission Strength', 'emissionStrength', 0, 10, 0.1, false)}
      </div>

      <div className="material-section">
        <h4>Advanced Properties</h4>
        {renderSliderProperty('Anisotropic', 'anisotropic')}
        {renderSliderProperty('Anisotropic Rotation', 'anisotropicRotation', 0, 1, 0.01, false)}
        {renderSliderProperty('Sheen', 'sheen')}
        {renderSliderProperty('Sheen Tint', 'sheenTint', 0, 1, 0.01, false)}
        {renderSliderProperty('Clearcoat', 'clearcoat')}
        {renderSliderProperty('Clearcoat Roughness', 'clearcoatRoughness')}
      </div>
    </div>
  );

  const renderVolumeTab = () => (
    <div className="material-tab-content">
      <div className="material-section">
        <h4>Volume Properties</h4>
        <div className="material-property">
          <label>Volume Density</label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={material.volumeDensity || 1}
            onChange={(e) => handleMaterialChange('volumeDensity', parseFloat(e.target.value))}
          />
          <span>{(material.volumeDensity || 1).toFixed(1)}</span>
        </div>
        {renderColorProperty('Volume Color', 'volumeColor')}
        {renderSliderProperty('Volume Anisotropy', 'volumeAnisotropy', -1, 1, 0.01, false)}
      </div>
    </div>
  );

  const renderDisplacementTab = () => (
    <div className="material-tab-content">
      <div className="material-section">
        <h4>Surface Displacement</h4>
        {renderSliderProperty('Displacement Scale', 'displacementScale', 0, 2, 0.01)}
        {renderSliderProperty('Normal Strength', 'normalStrength', 0, 5, 0.01)}
      </div>
    </div>
  );

  const renderPresetsTab = () => (
    <div className="material-tab-content">
      <div className="material-section">
        <h4>Material Presets</h4>
        <div className="presets-grid">
          {materialPresets.map((preset, index) => (
            <button
              key={index}
              className="preset-btn"
              onClick={() => applyPreset(preset)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="material-section">
        <h4>Save Current Material</h4>
        <div className="save-preset">
          <input
            type="text"
            placeholder="Preset name"
            className="preset-name-input"
          />
          <button className="save-preset-btn">Save Preset</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="advanced-material-editor">
      <div className="material-header">
        <div className="material-title">
          <h3>Material Editor</h3>
          <input
            type="text"
            value={material.name}
            onChange={(e) => handleMaterialChange('name', e.target.value)}
            className="material-name-input"
          />
        </div>
        <select
          value={material.type}
          onChange={(e) => handleMaterialChange('type', e.target.value)}
          className="material-type-select"
        >
          {Object.entries(MATERIAL_TYPES).map(([key, value]) => (
            <option key={value} value={value}>
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>
      
      <div className="material-tabs">
        <button
          className={`tab-btn ${activeTab === 'surface' ? 'active' : ''}`}
          onClick={() => setActiveTab('surface')}
        >
          Surface
        </button>
        <button
          className={`tab-btn ${activeTab === 'volume' ? 'active' : ''}`}
          onClick={() => setActiveTab('volume')}
        >
          Volume
        </button>
        <button
          className={`tab-btn ${activeTab === 'displacement' ? 'active' : ''}`}
          onClick={() => setActiveTab('displacement')}
        >
          Displacement
        </button>
        <button
          className={`tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
          onClick={() => setActiveTab('presets')}
        >
          Presets
        </button>
      </div>
      
      <div className="material-content">
        {activeTab === 'surface' && renderSurfaceTab()}
        {activeTab === 'volume' && renderVolumeTab()}
        {activeTab === 'displacement' && renderDisplacementTab()}
        {activeTab === 'presets' && renderPresetsTab()}
      </div>
    </div>
  );
}

export default AdvancedMaterialEditor;
