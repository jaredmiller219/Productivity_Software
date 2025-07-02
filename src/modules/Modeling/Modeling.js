import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import "./Modeling.css";

function Modeling() {
  const containerRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [controls, setControls] = useState(null);
  const [transformControls, setTransformControls] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [mode, setMode] = useState("translate"); // translate, rotate, scale

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0xf0f0f0);

    // Create camera
    const newCamera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    newCamera.position.set(5, 5, 5);
    newCamera.lookAt(0, 0, 0);

    // Create renderer
    const newRenderer = new THREE.WebGLRenderer({ antialias: true });
    newRenderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(newRenderer.domElement);

    // Create grid and axes
    const gridHelper = new THREE.GridHelper(20, 20);
    newScene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    newScene.add(axesHelper);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    newScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    newScene.add(directionalLight);

    // Create orbit controls
    const newControls = new OrbitControls(newCamera, newRenderer.domElement);
    newControls.enableDamping = true;

    // Create transform controls
    const newTransformControls = new TransformControls(
      newCamera,
      newRenderer.domElement
    );
    newTransformControls.addEventListener("dragging-changed", (event) => {
      newControls.enabled = !event.value;
    });
    newScene.add(newTransformControls);

    // Set state
    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);
    setControls(newControls);
    setTransformControls(newTransformControls);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      newControls.update();
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
      containerRef.current.removeChild(newRenderer.domElement);
    };
  }, []);

  // Update transform controls mode
  useEffect(() => {
    if (transformControls && selectedObject) {
      transformControls.setMode(mode);
    }
  }, [mode, transformControls, selectedObject]);

  // Add primitive shapes
  const addCube = () => {
    if (!scene) return;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x3498db });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0.5, 0);
    cube.name = `Cube_${Date.now()}`;
    scene.add(cube);

    selectObject(cube);
  };

  const addSphere = () => {
    if (!scene) return;

    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0.5, 0);
    sphere.name = `Sphere_${Date.now()}`;
    scene.add(sphere);

    selectObject(sphere);
  };

  const addCylinder = () => {
    if (!scene) return;

    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x2ecc71 });
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set(0, 0.5, 0);
    cylinder.name = `Cylinder_${Date.now()}`;
    scene.add(cylinder);

    selectObject(cylinder);
  };

  // Select object
  const selectObject = (object) => {
    if (!transformControls) return;

    setSelectedObject(object);
    transformControls.attach(object);
  };

  // Delete selected object
  const deleteSelected = () => {
    if (!scene || !selectedObject) return;

    scene.remove(selectedObject);
    transformControls.detach();
    setSelectedObject(null);
  };

  return (
    <div className="modeling-container">
      <div className="modeling-toolbar">
        <div className="toolbar-section">
          <button onClick={addCube}>Cube</button>
          <button onClick={addSphere}>Sphere</button>
          <button onClick={addCylinder}>Cylinder</button>
        </div>

        <div className="toolbar-section">
          <button
            className={mode === "translate" ? "active" : ""}
            onClick={() => setMode("translate")}
          >
            Move
          </button>
          <button
            className={mode === "rotate" ? "active" : ""}
            onClick={() => setMode("rotate")}
          >
            Rotate
          </button>
          <button
            className={mode === "scale" ? "active" : ""}
            onClick={() => setMode("scale")}
          >
            Scale
          </button>
        </div>

        <div className="toolbar-section">
          <button onClick={deleteSelected} disabled={!selectedObject}>
            Delete
          </button>
        </div>
      </div>

      <div className="modeling-canvas" ref={containerRef}></div>
    </div>
  );
}

export default Modeling;
