import * as THREE from "three";

/**
 * Creates a material with the specified type and options
 * @param {string} type - Material type (basic, lambert, phong, standard, physical)
 * @param {object} options - Material options
 * @returns {THREE.Material} The created material
 */
export const createMaterial = (type = "standard", options = {}) => {
  const defaultOptions = {
    color: 0x888888,
    metalness: 0.0,
    roughness: 0.5,
    transparent: false,
    opacity: 1.0,
    wireframe: false,
    ...options
  };

  switch (type) {
    case "basic":
      return new THREE.MeshBasicMaterial(defaultOptions);
    case "lambert":
      return new THREE.MeshLambertMaterial(defaultOptions);
    case "phong":
      return new THREE.MeshPhongMaterial(defaultOptions);
    case "physical":
      return new THREE.MeshPhysicalMaterial(defaultOptions);
    case "standard":
    default:
      return new THREE.MeshStandardMaterial(defaultOptions);
  }
};

/**
 * Creates a geometry based on the specified type
 * @param {string} geometryType - Type of geometry to create
 * @returns {THREE.BufferGeometry} The created geometry
 */
export const createGeometry = (geometryType) => {
  switch (geometryType) {
    case "cube":
      return new THREE.BoxGeometry(2, 2, 2, 2, 2, 2);
    case "sphere":
      return new THREE.SphereGeometry(1, 32, 32);
    case "cylinder":
      return new THREE.CylinderGeometry(1, 1, 2, 32);
    case "cone":
      return new THREE.ConeGeometry(1, 2, 32);
    case "torus":
      return new THREE.TorusGeometry(1, 0.4, 16, 100);
    case "plane":
      return new THREE.PlaneGeometry(2, 2, 10, 10);
    case "icosahedron":
      return new THREE.IcosahedronGeometry(1, 2);
    case "dodecahedron":
      return new THREE.DodecahedronGeometry(1, 0);
    case "octahedron":
      return new THREE.OctahedronGeometry(1, 0);
    case "tetrahedron":
      return new THREE.TetrahedronGeometry(1, 0);
    default:
      return new THREE.BoxGeometry(2, 2, 2);
  }
};

/**
 * Creates a mesh with the specified geometry and material options
 * @param {string} geometryType - Type of geometry
 * @param {object} materialOptions - Material options
 * @returns {THREE.Mesh} The created mesh
 */
export const createMesh = (geometryType, materialOptions = {}) => {
  const geometry = createGeometry(geometryType);
  const material = createMaterial("standard", materialOptions);
  
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 1, 0);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.name = `${geometryType}_${Date.now()}`;
  mesh.userData = {
    type: geometryType,
    created: Date.now(),
    animated: false,
    materialType: "standard"
  };
  
  return mesh;
};

/**
 * Sets up enhanced lighting for the scene
 * @param {THREE.Scene} scene - The Three.js scene
 * @returns {Array} Array of created lights
 */
export const setupLighting = (scene) => {
  const lights = [];
  
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
  scene.add(ambientLight);
  lights.push(ambientLight);

  // Directional light with shadows
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(10, 10, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 500;
  directionalLight.shadow.camera.left = -50;
  directionalLight.shadow.camera.right = 50;
  directionalLight.shadow.camera.top = 50;
  directionalLight.shadow.camera.bottom = -50;
  scene.add(directionalLight);
  lights.push(directionalLight);

  // Rim light
  const rimLight = new THREE.DirectionalLight(0x4080ff, 0.5);
  rimLight.position.set(-10, 5, -10);
  scene.add(rimLight);
  lights.push(rimLight);

  // Fill light
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(5, -5, 10);
  scene.add(fillLight);
  lights.push(fillLight);
  
  return lights;
};

/**
 * Sets up the scene with grid, axes, and fog
 * @param {THREE.Scene} scene - The Three.js scene
 */
export const setupScene = (scene) => {
  // Background and fog
  scene.background = new THREE.Color(0x2a2a2a);
  scene.fog = new THREE.Fog(0x2a2a2a, 50, 200);

  // Grid helper
  const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x222222);
  scene.add(gridHelper);

  // Axes helper
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);
};

/**
 * Configures the renderer with advanced settings
 * @param {THREE.WebGLRenderer} renderer - The Three.js renderer
 * @param {object} settings - Render settings
 */
export const configureRenderer = (renderer, settings) => {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = settings.shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.physicallyCorrectLights = settings.physicallyCorrectLights;
  renderer.toneMapping = settings.toneMapping;
  renderer.toneMappingExposure = settings.exposure;
  renderer.outputEncoding = THREE.sRGBEncoding;
};

/**
 * Subdivides a geometry by increasing its segments
 * @param {THREE.Mesh} mesh - The mesh to subdivide
 */
export const subdivideMesh = (mesh) => {
  if (!mesh.geometry || !mesh.geometry.parameters) return;
  
  const geo = mesh.geometry;
  const params = geo.parameters;
  let newGeo;
  
  switch (mesh.userData.type) {
    case "sphere":
      newGeo = new THREE.SphereGeometry(
        params.radius, 
        Math.min(params.widthSegments * 2, 64), 
        Math.min(params.heightSegments * 2, 64)
      );
      break;
    case "cylinder":
      newGeo = new THREE.CylinderGeometry(
        params.radiusTop, 
        params.radiusBottom, 
        params.height, 
        Math.min(params.radialSegments * 2, 64)
      );
      break;
    case "cube":
      newGeo = new THREE.BoxGeometry(
        params.width, 
        params.height, 
        params.depth,
        Math.min((params.widthSegments || 1) * 2, 32),
        Math.min((params.heightSegments || 1) * 2, 32),
        Math.min((params.depthSegments || 1) * 2, 32)
      );
      break;
    default:
      return;
  }
  
  mesh.geometry.dispose();
  mesh.geometry = newGeo;
};
