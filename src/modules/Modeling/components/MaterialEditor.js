import React, { useState, useEffect } from 'react';
import './MaterialEditor.css';

const MaterialEditor = ({ selectedObject, onMaterialChange }) => {
  const [materialType, setMaterialType] = useState('standard');
  const [materialProperties, setMaterialProperties] = useState({
    color: '#888888',
    metalness: 0.0,
    roughness: 0.5,
    opacity: 1.0,
    transparent: false,
    wireframe: false,
    emissive: '#000000',
    emissiveIntensity: 0.0,
    normalScale: 1.0,
    bumpScale: 1.0,
    displacementScale: 1.0,
    aoMapIntensity: 1.0,
    envMapIntensity: 1.0,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    transmission: 0.0,
    thickness: 0.0,
    ior: 1.5,
    reflectivity: 0.5,
    iridescence: 0.0,
    iridescenceIOR: 1.3,
    sheen: 0.0,
    sheenRoughness: 1.0,
    sheenColor: '#ffffff',
    specularIntensity: 1.0,
    specularColor: '#ffffff'
  });

  const [textureSlots, setTextureSlots] = useState({
    diffuse: null,
    normal: null,
    roughness: null,
    metalness: null,
    emissive: null,
    ao: null,
    displacement: null,
    alpha: null,
    environment: null
  });

  const materialTypes = [
    { value: 'basic', label: 'Basic Material' },
    { value: 'lambert', label: 'Lambert Material' },
    { value: 'phong', label: 'Phong Material' },
    { value: 'standard', label: 'Standard Material (PBR)' },
    { value: 'physical', label: 'Physical Material' },
    { value: 'toon', label: 'Toon Material' },
    { value: 'matcap', label: 'MatCap Material' },
    { value: 'depth', label: 'Depth Material' },
    { value: 'normal', label: 'Normal Material' },
    { value: 'points', label: 'Points Material' },
    { value: 'line', label: 'Line Material' },
    { value: 'shader', label: 'Shader Material' }
  ];

  const handlePropertyChange = (property, value) => {
    const newProperties = { ...materialProperties, [property]: value };
    setMaterialProperties(newProperties);
    
    if (onMaterialChange) {
      onMaterialChange(materialType, newProperties);
    }
  };

  const handleTextureUpload = (slot, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newTextureSlots = { ...textureSlots, [slot]: e.target.result };
        setTextureSlots(newTextureSlots);
        
        if (onMaterialChange) {
          onMaterialChange(materialType, materialProperties, newTextureSlots);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderPropertyControl = (property, label, type = 'range', min = 0, max = 1, step = 0.01) => {
    const value = materialProperties[property];
    
    switch (type) {
      case 'color':
        return (
          <div className="property-control">
            <label>{label}</label>
            <input
              type="color"
              value={value}
              onChange={(e) => handlePropertyChange(property, e.target.value)}
            />
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="property-control">
            <label>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handlePropertyChange(property, e.target.checked)}
              />
              {label}
            </label>
          </div>
        );
      
      case 'range':
      default:
        return (
          <div className="property-control">
            <label>{label}</label>
            <div className="range-control">
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => handlePropertyChange(property, parseFloat(e.target.value))}
              />
              <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => handlePropertyChange(property, parseFloat(e.target.value))}
                className="number-input"
              />
            </div>
          </div>
        );
    }
  };

  const renderTextureSlot = (slot, label) => {
    return (
      <div className="texture-slot">
        <label>{label}</label>
        <div className="texture-controls">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleTextureUpload(slot, e.target.files[0])}
            id={`texture-${slot}`}
            style={{ display: 'none' }}
          />
          <button
            className="texture-button"
            onClick={() => document.getElementById(`texture-${slot}`).click()}
          >
            {textureSlots[slot] ? '📷 Replace' : '📁 Load'}
          </button>
          {textureSlots[slot] && (
            <button
              className="texture-remove"
              onClick={() => {
                const newSlots = { ...textureSlots, [slot]: null };
                setTextureSlots(newSlots);
                if (onMaterialChange) {
                  onMaterialChange(materialType, materialProperties, newSlots);
                }
              }}
            >
              ❌
            </button>
          )}
        </div>
        {textureSlots[slot] && (
          <div className="texture-preview">
            <img src={textureSlots[slot]} alt={`${label} texture`} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="material-editor">
      <div className="material-header">
        <h3>Material Editor</h3>
        {!selectedObject && (
          <p className="no-selection">Select an object to edit materials</p>
        )}
      </div>

      {selectedObject && (
        <>
          <div className="material-type-selector">
            <label>Material Type</label>
            <select
              value={materialType}
              onChange={(e) => {
                setMaterialType(e.target.value);
                if (onMaterialChange) {
                  onMaterialChange(e.target.value, materialProperties, textureSlots);
                }
              }}
            >
              {materialTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="material-properties">
            <div className="property-section">
              <h4>Base Properties</h4>
              {renderPropertyControl('color', 'Base Color', 'color')}
              {renderPropertyControl('opacity', 'Opacity', 'range', 0, 1, 0.01)}
              {renderPropertyControl('transparent', 'Transparent', 'checkbox')}
              {renderPropertyControl('wireframe', 'Wireframe', 'checkbox')}
            </div>

            {(materialType === 'standard' || materialType === 'physical') && (
              <div className="property-section">
                <h4>PBR Properties</h4>
                {renderPropertyControl('metalness', 'Metalness', 'range', 0, 1, 0.01)}
                {renderPropertyControl('roughness', 'Roughness', 'range', 0, 1, 0.01)}
                {renderPropertyControl('emissive', 'Emissive Color', 'color')}
                {renderPropertyControl('emissiveIntensity', 'Emissive Intensity', 'range', 0, 2, 0.01)}
                {renderPropertyControl('envMapIntensity', 'Environment Intensity', 'range', 0, 2, 0.01)}
              </div>
            )}

            {materialType === 'physical' && (
              <div className="property-section">
                <h4>Advanced Physical Properties</h4>
                {renderPropertyControl('clearcoat', 'Clearcoat', 'range', 0, 1, 0.01)}
                {renderPropertyControl('clearcoatRoughness', 'Clearcoat Roughness', 'range', 0, 1, 0.01)}
                {renderPropertyControl('transmission', 'Transmission', 'range', 0, 1, 0.01)}
                {renderPropertyControl('thickness', 'Thickness', 'range', 0, 5, 0.01)}
                {renderPropertyControl('ior', 'IOR', 'range', 1, 2.5, 0.01)}
                {renderPropertyControl('reflectivity', 'Reflectivity', 'range', 0, 1, 0.01)}
                {renderPropertyControl('iridescence', 'Iridescence', 'range', 0, 1, 0.01)}
                {renderPropertyControl('iridescenceIOR', 'Iridescence IOR', 'range', 1, 2.5, 0.01)}
                {renderPropertyControl('sheen', 'Sheen', 'range', 0, 1, 0.01)}
                {renderPropertyControl('sheenRoughness', 'Sheen Roughness', 'range', 0, 1, 0.01)}
                {renderPropertyControl('sheenColor', 'Sheen Color', 'color')}
              </div>
            )}

            {materialType === 'phong' && (
              <div className="property-section">
                <h4>Phong Properties</h4>
                {renderPropertyControl('specularIntensity', 'Specular Intensity', 'range', 0, 2, 0.01)}
                {renderPropertyControl('specularColor', 'Specular Color', 'color')}
              </div>
            )}

            <div className="property-section">
              <h4>Texture Maps</h4>
              <div className="texture-grid">
                {renderTextureSlot('diffuse', 'Diffuse/Albedo')}
                {renderTextureSlot('normal', 'Normal Map')}
                {renderTextureSlot('roughness', 'Roughness Map')}
                {renderTextureSlot('metalness', 'Metalness Map')}
                {renderTextureSlot('emissive', 'Emissive Map')}
                {renderTextureSlot('ao', 'Ambient Occlusion')}
                {renderTextureSlot('displacement', 'Displacement')}
                {renderTextureSlot('alpha', 'Alpha Map')}
                {renderTextureSlot('environment', 'Environment Map')}
              </div>
            </div>

            <div className="property-section">
              <h4>Texture Settings</h4>
              {renderPropertyControl('normalScale', 'Normal Scale', 'range', 0, 2, 0.01)}
              {renderPropertyControl('bumpScale', 'Bump Scale', 'range', 0, 2, 0.01)}
              {renderPropertyControl('displacementScale', 'Displacement Scale', 'range', 0, 2, 0.01)}
              {renderPropertyControl('aoMapIntensity', 'AO Intensity', 'range', 0, 2, 0.01)}
            </div>
          </div>

          <div className="material-actions">
            <button className="btn-primary">Save Material</button>
            <button className="btn-secondary">Load Material</button>
            <button className="btn-secondary">Reset to Default</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MaterialEditor;
