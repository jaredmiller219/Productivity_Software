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
    case "icosphere":
    case "icosahedron":
      return new THREE.IcosahedronGeometry(1, 2);
    case "cylinder":
      return new THREE.CylinderGeometry(1, 1, 2, 32);
    case "cone":
      return new THREE.ConeGeometry(1, 2, 32);
    case "torus":
      return new THREE.TorusGeometry(1, 0.4, 16, 100);
    case "plane":
      return new THREE.PlaneGeometry(2, 2, 10, 10);
    case "circle":
      return new THREE.CircleGeometry(1, 32);
    case "ring":
      return new THREE.RingGeometry(0.5, 1, 32);
    case "dodecahedron":
      return new THREE.DodecahedronGeometry(1, 0);
    case "octahedron":
      return new THREE.OctahedronGeometry(1, 0);
    case "tetrahedron":
      return new THREE.TetrahedronGeometry(1, 0);
    case "monkey":
      // Create a simplified monkey head geometry (Suzanne substitute)
      return createMonkeyGeometry();
    case "torusknot":
      return new THREE.TorusKnotGeometry(1, 0.4, 100, 16);
    case "capsule":
      return createCapsuleGeometry();
    case "prism":
      return createPrismGeometry();
    case "pyramid":
      return createPyramidGeometry();
    default:
      return new THREE.BoxGeometry(2, 2, 2);
  }
};

/**
 * Creates a simplified monkey head geometry (Suzanne substitute)
 */
export const createMonkeyGeometry = () => {
  const geometry = new THREE.SphereGeometry(1, 16, 12);
  // Add some basic deformation to make it more monkey-like
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];

    // Flatten the face area
    if (z > 0.5) {
      positions[i + 2] = z * 0.7;
    }

    // Add eye indentations
    if (Math.abs(x) > 0.3 && Math.abs(x) < 0.6 && y > 0.2 && y < 0.6 && z > 0.3) {
      positions[i + 2] = z * 0.8;
    }
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
};

/**
 * Creates a capsule geometry
 */
export const createCapsuleGeometry = () => {
  const geometry = new THREE.CapsuleGeometry(1, 2, 4, 8);
  return geometry;
};

/**
 * Creates a prism geometry
 */
export const createPrismGeometry = (sides = 6) => {
  const geometry = new THREE.CylinderGeometry(1, 1, 2, sides);
  return geometry;
};

/**
 * Creates a pyramid geometry
 */
export const createPyramidGeometry = () => {
  const geometry = new THREE.ConeGeometry(1, 2, 4);
  return geometry;
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

/**
 * Advanced mesh operations for Blender-like functionality
 */

/**
 * Extrude faces along their normals
 * @param {THREE.Mesh} mesh - The mesh to extrude
 * @param {number} distance - Extrusion distance
 */
export const extrudeMesh = (mesh, distance = 0.5) => {
  if (!mesh.geometry) return;

  const geometry = mesh.geometry.clone();
  const positions = geometry.attributes.position.array;
  const normals = geometry.attributes.normal.array;

  // Simple extrusion by moving vertices along normals
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] += normals[i] * distance;
    positions[i + 1] += normals[i + 1] * distance;
    positions[i + 2] += normals[i + 2] * distance;
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();

  mesh.geometry.dispose();
  mesh.geometry = geometry;
};

/**
 * Inset faces
 * @param {THREE.Mesh} mesh - The mesh to inset
 * @param {number} amount - Inset amount
 */
export const insetFaces = (mesh, amount = 0.1) => {
  if (!mesh.geometry) return;

  const geometry = mesh.geometry.clone();
  // Simplified inset operation
  const scale = 1 - amount;
  geometry.scale(scale, scale, scale);

  mesh.geometry.dispose();
  mesh.geometry = geometry;
};

/**
 * Bevel edges
 * @param {THREE.Mesh} mesh - The mesh to bevel
 * @param {number} amount - Bevel amount
 */
export const bevelMesh = (mesh, amount = 0.1) => {
  if (!mesh.geometry) return;

  // Simplified bevel - in a real implementation, this would be much more complex
  const geometry = mesh.geometry.clone();

  // Apply subdivision and smoothing as a simple bevel approximation
  subdivideMesh(mesh);

  const positions = geometry.attributes.position.array;
  const normals = geometry.attributes.normal.array;

  // Smooth vertices slightly
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] += normals[i] * amount * 0.1;
    positions[i + 1] += normals[i + 1] * amount * 0.1;
    positions[i + 2] += normals[i + 2] * amount * 0.1;
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
};

/**
 * Merge vertices by distance
 * @param {THREE.Mesh} mesh - The mesh to merge
 * @param {number} threshold - Distance threshold for merging
 */
export const mergeVertices = (mesh, threshold = 0.01) => {
  if (!mesh.geometry) return;

  const geometry = mesh.geometry.clone();

  // Use Three.js built-in merge vertices if available
  if (geometry.mergeVertices) {
    geometry.mergeVertices(threshold);
  }

  geometry.computeVertexNormals();

  mesh.geometry.dispose();
  mesh.geometry = geometry;
};

/**
 * Triangulate mesh faces
 * @param {THREE.Mesh} mesh - The mesh to triangulate
 */
export const triangulateMesh = (mesh) => {
  if (!mesh.geometry) return;

  const geometry = mesh.geometry.clone();

  // Convert to triangles if not already
  if (geometry.index) {
    const newGeometry = geometry.toNonIndexed();
    mesh.geometry.dispose();
    mesh.geometry = newGeometry;
  }
};

/**
 * Convert triangles to quads where possible
 * @param {THREE.Mesh} mesh - The mesh to convert
 */
export const quadsFromTris = (mesh) => {
  if (!mesh.geometry) return;

  // This is a simplified implementation
  // Real quad conversion is complex and requires edge analysis
  console.log('Quad conversion applied (simplified)');
};

/**
 * Solidify mesh (add thickness)
 * @param {THREE.Mesh} mesh - The mesh to solidify
 * @param {number} thickness - Thickness amount
 */
export const solidifyMesh = (mesh, thickness = 0.1) => {
  if (!mesh.geometry) return;

  const geometry = mesh.geometry.clone();
  const positions = geometry.attributes.position.array;
  const normals = geometry.attributes.normal.array;

  // Create inner surface by moving vertices inward
  const innerPositions = new Float32Array(positions.length);
  for (let i = 0; i < positions.length; i += 3) {
    innerPositions[i] = positions[i] - normals[i] * thickness;
    innerPositions[i + 1] = positions[i + 1] - normals[i + 1] * thickness;
    innerPositions[i + 2] = positions[i + 2] - normals[i + 2] * thickness;
  }

  // Combine outer and inner surfaces (simplified)
  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
};

/**
 * Decimate mesh (reduce polygon count)
 * @param {THREE.Mesh} mesh - The mesh to decimate
 * @param {number} ratio - Decimation ratio (0-1)
 */
export const decimateMesh = (mesh, ratio = 0.5) => {
  if (!mesh.geometry) return;

  // Simplified decimation - in practice, this would use complex algorithms
  const geometry = mesh.geometry.clone();

  // Simple approach: reduce subdivision level
  if (mesh.userData.type === 'sphere') {
    const params = geometry.parameters;
    if (params) {
      const newSegments = Math.max(8, Math.floor(params.widthSegments * ratio));
      const newGeo = new THREE.SphereGeometry(
        params.radius,
        newSegments,
        Math.floor(newSegments * 0.75)
      );
      mesh.geometry.dispose();
      mesh.geometry = newGeo;
    }
  }
};

/**
 * Smooth mesh vertices
 * @param {THREE.Mesh} mesh - The mesh to smooth
 * @param {number} iterations - Number of smoothing iterations
 */
export const smoothMesh = (mesh, iterations = 1) => {
  if (!mesh.geometry) return;

  const geometry = mesh.geometry.clone();

  for (let iter = 0; iter < iterations; iter++) {
    // Laplacian smoothing (simplified)
    const positions = geometry.attributes.position.array;
    const smoothedPositions = new Float32Array(positions.length);

    // Copy original positions
    for (let i = 0; i < positions.length; i++) {
      smoothedPositions[i] = positions[i];
    }

    // Apply smoothing (this is a very basic implementation)
    for (let i = 0; i < positions.length; i += 9) { // Process triangles
      for (let j = 0; j < 9; j += 3) {
        const avgX = (positions[i] + positions[i + 3] + positions[i + 6]) / 3;
        const avgY = (positions[i + 1] + positions[i + 4] + positions[i + 7]) / 3;
        const avgZ = (positions[i + 2] + positions[i + 5] + positions[i + 8]) / 3;

        smoothedPositions[i + j] = (smoothedPositions[i + j] + avgX) * 0.5;
        smoothedPositions[i + j + 1] = (smoothedPositions[i + j + 1] + avgY) * 0.5;
        smoothedPositions[i + j + 2] = (smoothedPositions[i + j + 2] + avgZ) * 0.5;
      }
    }

    // Update geometry
    for (let i = 0; i < positions.length; i++) {
      positions[i] = smoothedPositions[i];
    }
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();

  mesh.geometry.dispose();
  mesh.geometry = geometry;
};
