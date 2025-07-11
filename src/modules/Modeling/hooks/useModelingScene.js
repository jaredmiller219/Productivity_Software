import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import {
  createMesh,
  setupLighting,
  setupScene,
  configureRenderer,
  subdivideMesh,
  createMaterial
} from '../utils/threeUtils.js';

export const useModelingScene = (containerRef) => {
  const [scene, setScene] = useState(null);
  const [transformControls, setTransformControls] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [mode, setMode] = useState("translate");
  const [objects, setObjects] = useState([]);
  const [lights, setLights] = useState([]);
  const [activePanel, setActivePanel] = useState("objects");
  const [snapToGrid, setSnapToGrid] = useState(false);

  const renderSettings = {
    shadows: true,
    antialias: true,
    physicallyCorrectLights: true,
    toneMapping: THREE.ACESFilmicToneMapping,
    exposure: 1.0
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene
    const newScene = new THREE.Scene();
    setupScene(newScene);

    // Create camera
    const newCamera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      2000
    );
    newCamera.position.set(10, 10, 10);
    newCamera.lookAt(0, 0, 0);

    // Create renderer with advanced settings
    const newRenderer = new THREE.WebGLRenderer({ 
      antialias: renderSettings.antialias,
      powerPreference: "high-performance"
    });
    newRenderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    configureRenderer(newRenderer, renderSettings);
    containerRef.current.appendChild(newRenderer.domElement);

    // Setup lighting
    const sceneLights = setupLighting(newScene);

    // Create enhanced orbit controls
    const newControls = new OrbitControls(newCamera, newRenderer.domElement);
    newControls.enableDamping = true;
    newControls.dampingFactor = 0.05;
    newControls.enableZoom = true;
    newControls.enablePan = true;
    newControls.enableRotate = true;
    newControls.maxDistance = 500;
    newControls.minDistance = 1;
    newControls.maxPolarAngle = Math.PI;

    // Create transform controls
    const newTransformControls = new TransformControls(
      newCamera,
      newRenderer.domElement
    );
    newTransformControls.addEventListener("dragging-changed", (event) => {
      newControls.enabled = !event.value;
    });
    newTransformControls.setSpace("local");
    newTransformControls.setSize(0.8);
    newScene.add(newTransformControls);

    // Initialize object arrays
    const sceneObjects = [];

    // Set state
    setScene(newScene);
    setTransformControls(newTransformControls);
    setObjects(sceneObjects);
    setLights(sceneLights);

    // Enhanced animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      newControls.update();
      
      // Update any animated objects
      sceneObjects.forEach(obj => {
        if (obj.userData.animated) {
          obj.rotation.y += 0.01;
        }
      });
      
      newRenderer.render(newScene, newCamera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;

      newCamera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      newCamera.updateProjectionMatrix();
      newRenderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (containerRef.current && newRenderer.domElement) {
        containerRef.current.removeChild(newRenderer.domElement);
      }
    };
  }, []);

  // Update transform controls mode
  useEffect(() => {
    if (transformControls && selectedObject) {
      transformControls.setMode(mode);
    }
  }, [mode, transformControls, selectedObject]);

  // Object manipulation functions
  const addObject = useCallback((geometryType, materialOptions = {}) => {
    if (!scene) return;

    const mesh = createMesh(geometryType, materialOptions);
    scene.add(mesh);
    setObjects(prev => [...prev, mesh]);
    selectObject(mesh);
  }, [scene]);

  const selectObject = useCallback((object) => {
    if (!transformControls) return;

    setSelectedObject(object);
    transformControls.attach(object);
  }, [transformControls]);

  const deleteSelected = useCallback(() => {
    if (!scene || !selectedObject) return;

    scene.remove(selectedObject);
    transformControls.detach();
    setObjects(prev => prev.filter(obj => obj !== selectedObject));
    setSelectedObject(null);
  }, [scene, selectedObject, transformControls]);

  const duplicateSelected = useCallback(() => {
    if (!scene || !selectedObject) return;

    const cloned = selectedObject.clone();
    cloned.position.x += 2;
    cloned.name = `${selectedObject.userData.type}_${Date.now()}`;
    cloned.userData = { ...selectedObject.userData, created: Date.now() };
    
    scene.add(cloned);
    setObjects(prev => [...prev, cloned]);
    selectObject(cloned);
  }, [scene, selectedObject, selectObject]);

  const subdivideSelected = useCallback(() => {
    if (!selectedObject) return;
    subdivideMesh(selectedObject);
  }, [selectedObject]);

  const changeMaterial = useCallback((materialType, options = {}) => {
    if (!selectedObject) return;
    
    const oldMaterial = selectedObject.material;
    const newMaterial = createMaterial(materialType, {
      color: oldMaterial.color,
      ...options
    });
    
    selectedObject.material = newMaterial;
    selectedObject.userData.materialType = materialType;
    oldMaterial.dispose();
  }, [selectedObject]);

  const toggleWireframe = useCallback(() => {
    if (!selectedObject) return;
    selectedObject.material.wireframe = !selectedObject.material.wireframe;
  }, [selectedObject]);

  const toggleAnimation = useCallback((object) => {
    if (!object) return;
    object.userData.animated = !object.userData.animated;
  }, []);

  return {
    // State
    scene,
    selectedObject,
    mode,
    objects,
    lights,
    activePanel,
    snapToGrid,
    
    // Setters
    setMode,
    setActivePanel,
    setSnapToGrid,
    
    // Actions
    addObject,
    selectObject,
    deleteSelected,
    duplicateSelected,
    subdivideSelected,
    changeMaterial,
    toggleWireframe,
    toggleAnimation
  };
};
