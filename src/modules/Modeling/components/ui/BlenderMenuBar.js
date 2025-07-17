import React, { useState } from 'react';
import './BlenderMenuBar.css';

const BlenderMenuBar = ({
  onFileAction,
  onEditAction,
  onAddAction,
  onMeshAction,
  onObjectAction,
  onSelectAction,
  onViewAction,
  onRenderAction,
  onWindowAction,
  onHelpAction,
  selectedObject,
  scene
}) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const menuItems = {
    File: [
      { label: 'New', shortcut: 'Ctrl+N', action: () => onFileAction('new') },
      { label: 'Open', shortcut: 'Ctrl+O', action: () => onFileAction('open') },
      { label: 'Open Recent', submenu: [
        { label: 'project1.blend', action: () => onFileAction('open-recent', 'project1.blend') },
        { label: 'project2.blend', action: () => onFileAction('open-recent', 'project2.blend') }
      ]},
      { type: 'separator' },
      { label: 'Save', shortcut: 'Ctrl+S', action: () => onFileAction('save') },
      { label: 'Save As...', shortcut: 'Ctrl+Shift+S', action: () => onFileAction('save-as') },
      { label: 'Save Copy', action: () => onFileAction('save-copy') },
      { type: 'separator' },
      { label: 'Import', submenu: [
        { label: 'Wavefront (.obj)', action: () => onFileAction('import', 'obj') },
        { label: 'Collada (.dae)', action: () => onFileAction('import', 'dae') },
        { label: 'FBX (.fbx)', action: () => onFileAction('import', 'fbx') },
        { label: 'glTF 2.0 (.glb/.gltf)', action: () => onFileAction('import', 'gltf') },
        { label: 'STL (.stl)', action: () => onFileAction('import', 'stl') }
      ]},
      { label: 'Export', submenu: [
        { label: 'Wavefront (.obj)', action: () => onFileAction('export', 'obj') },
        { label: 'Collada (.dae)', action: () => onFileAction('export', 'dae') },
        { label: 'FBX (.fbx)', action: () => onFileAction('export', 'fbx') },
        { label: 'glTF 2.0 (.glb/.gltf)', action: () => onFileAction('export', 'gltf') },
        { label: 'STL (.stl)', action: () => onFileAction('export', 'stl') }
      ]},
      { type: 'separator' },
      { label: 'Link', action: () => onFileAction('link') },
      { label: 'Append', action: () => onFileAction('append') },
      { type: 'separator' },
      { label: 'Quit', shortcut: 'Ctrl+Q', action: () => onFileAction('quit') }
    ],
    Edit: [
      { label: 'Undo', shortcut: 'Ctrl+Z', action: () => onEditAction('undo') },
      { label: 'Redo', shortcut: 'Ctrl+Shift+Z', action: () => onEditAction('redo') },
      { type: 'separator' },
      { label: 'Cut', shortcut: 'Ctrl+X', action: () => onEditAction('cut') },
      { label: 'Copy', shortcut: 'Ctrl+C', action: () => onEditAction('copy') },
      { label: 'Paste', shortcut: 'Ctrl+V', action: () => onEditAction('paste') },
      { type: 'separator' },
      { label: 'Duplicate', shortcut: 'Shift+D', action: () => onEditAction('duplicate') },
      { label: 'Delete', shortcut: 'X', action: () => onEditAction('delete') },
      { type: 'separator' },
      { label: 'Search Menu', shortcut: 'F3', action: () => onEditAction('search') },
      { type: 'separator' },
      { label: 'Preferences', action: () => onEditAction('preferences') }
    ],
    Add: [
      { label: 'Mesh', submenu: [
        { label: 'Cube', action: () => onAddAction('mesh', 'cube') },
        { label: 'UV Sphere', action: () => onAddAction('mesh', 'sphere') },
        { label: 'Ico Sphere', action: () => onAddAction('mesh', 'icosphere') },
        { label: 'Cylinder', action: () => onAddAction('mesh', 'cylinder') },
        { label: 'Cone', action: () => onAddAction('mesh', 'cone') },
        { label: 'Torus', action: () => onAddAction('mesh', 'torus') },
        { label: 'Plane', action: () => onAddAction('mesh', 'plane') },
        { label: 'Circle', action: () => onAddAction('mesh', 'circle') },
        { label: 'Monkey', action: () => onAddAction('mesh', 'monkey') }
      ]},
      { label: 'Curve', submenu: [
        { label: 'Bezier', action: () => onAddAction('curve', 'bezier') },
        { label: 'Circle', action: () => onAddAction('curve', 'circle') },
        { label: 'NURBS Curve', action: () => onAddAction('curve', 'nurbs') },
        { label: 'NURBS Path', action: () => onAddAction('curve', 'path') }
      ]},
      { label: 'Surface', submenu: [
        { label: 'NURBS Curve', action: () => onAddAction('surface', 'nurbs-curve') },
        { label: 'NURBS Circle', action: () => onAddAction('surface', 'nurbs-circle') },
        { label: 'NURBS Surface', action: () => onAddAction('surface', 'nurbs-surface') }
      ]},
      { label: 'Metaball', submenu: [
        { label: 'Ball', action: () => onAddAction('metaball', 'ball') },
        { label: 'Capsule', action: () => onAddAction('metaball', 'capsule') },
        { label: 'Plane', action: () => onAddAction('metaball', 'plane') },
        { label: 'Ellipsoid', action: () => onAddAction('metaball', 'ellipsoid') }
      ]},
      { label: 'Text', action: () => onAddAction('text') },
      { label: 'Armature', action: () => onAddAction('armature') },
      { label: 'Lattice', action: () => onAddAction('lattice') },
      { label: 'Empty', submenu: [
        { label: 'Plain Axes', action: () => onAddAction('empty', 'axes') },
        { label: 'Arrows', action: () => onAddAction('empty', 'arrows') },
        { label: 'Single Arrow', action: () => onAddAction('empty', 'single-arrow') },
        { label: 'Circle', action: () => onAddAction('empty', 'circle') },
        { label: 'Cube', action: () => onAddAction('empty', 'cube') },
        { label: 'Sphere', action: () => onAddAction('empty', 'sphere') },
        { label: 'Cone', action: () => onAddAction('empty', 'cone') }
      ]},
      { label: 'Image', submenu: [
        { label: 'Reference', action: () => onAddAction('image', 'reference') },
        { label: 'Background', action: () => onAddAction('image', 'background') }
      ]},
      { label: 'Light', submenu: [
        { label: 'Point', action: () => onAddAction('light', 'point') },
        { label: 'Sun', action: () => onAddAction('light', 'sun') },
        { label: 'Spot', action: () => onAddAction('light', 'spot') },
        { label: 'Area', action: () => onAddAction('light', 'area') }
      ]},
      { label: 'Light Probe', submenu: [
        { label: 'Reflection Cubemap', action: () => onAddAction('light-probe', 'reflection') },
        { label: 'Reflection Plane', action: () => onAddAction('light-probe', 'plane') },
        { label: 'Irradiance Volume', action: () => onAddAction('light-probe', 'irradiance') }
      ]},
      { label: 'Camera', action: () => onAddAction('camera') },
      { label: 'Speaker', action: () => onAddAction('speaker') },
      { label: 'Force Field', submenu: [
        { label: 'Force', action: () => onAddAction('force-field', 'force') },
        { label: 'Wind', action: () => onAddAction('force-field', 'wind') },
        { label: 'Vortex', action: () => onAddAction('force-field', 'vortex') },
        { label: 'Magnetic', action: () => onAddAction('force-field', 'magnetic') },
        { label: 'Harmonic', action: () => onAddAction('force-field', 'harmonic') },
        { label: 'Charge', action: () => onAddAction('force-field', 'charge') },
        { label: 'Lennard-Jones', action: () => onAddAction('force-field', 'lennard-jones') },
        { label: 'Texture', action: () => onAddAction('force-field', 'texture') },
        { label: 'Curve Guide', action: () => onAddAction('force-field', 'curve-guide') },
        { label: 'Boid', action: () => onAddAction('force-field', 'boid') },
        { label: 'Turbulence', action: () => onAddAction('force-field', 'turbulence') },
        { label: 'Drag', action: () => onAddAction('force-field', 'drag') },
        { label: 'Smoke Flow', action: () => onAddAction('force-field', 'smoke-flow') }
      ]},
      { label: 'Collection Instance', action: () => onAddAction('collection-instance') }
    ],
    Mesh: [
      { label: 'Transform', submenu: [
        { label: 'Grab/Move', shortcut: 'G', action: () => onMeshAction('transform', 'grab') },
        { label: 'Rotate', shortcut: 'R', action: () => onMeshAction('transform', 'rotate') },
        { label: 'Scale', shortcut: 'S', action: () => onMeshAction('transform', 'scale') },
        { label: 'To Sphere', shortcut: 'Shift+Alt+S', action: () => onMeshAction('transform', 'to-sphere') },
        { label: 'Shear', shortcut: 'Shift+Ctrl+Alt+S', action: () => onMeshAction('transform', 'shear') },
        { label: 'Bend', action: () => onMeshAction('transform', 'bend') },
        { label: 'Push/Pull', action: () => onMeshAction('transform', 'push-pull') },
        { label: 'Randomize', action: () => onMeshAction('transform', 'randomize') },
        { label: 'Smooth', action: () => onMeshAction('transform', 'smooth') }
      ]},
      { label: 'Mirror', submenu: [
        { label: 'X Global', action: () => onMeshAction('mirror', 'x-global') },
        { label: 'Y Global', action: () => onMeshAction('mirror', 'y-global') },
        { label: 'Z Global', action: () => onMeshAction('mirror', 'z-global') },
        { label: 'X Local', action: () => onMeshAction('mirror', 'x-local') },
        { label: 'Y Local', action: () => onMeshAction('mirror', 'y-local') },
        { label: 'Z Local', action: () => onMeshAction('mirror', 'z-local') }
      ]},
      { label: 'Snap', submenu: [
        { label: 'Selection to Grid', action: () => onMeshAction('snap', 'selection-to-grid') },
        { label: 'Selection to Cursor', action: () => onMeshAction('snap', 'selection-to-cursor') },
        { label: 'Selection to Active', action: () => onMeshAction('snap', 'selection-to-active') },
        { label: 'Cursor to Selected', action: () => onMeshAction('snap', 'cursor-to-selected') },
        { label: 'Cursor to Center', action: () => onMeshAction('snap', 'cursor-to-center') },
        { label: 'Cursor to Grid', action: () => onMeshAction('snap', 'cursor-to-grid') },
        { label: 'Cursor to Active', action: () => onMeshAction('snap', 'cursor-to-active') }
      ]},
      { type: 'separator' },
      { label: 'Extrude', submenu: [
        { label: 'Extrude Region', shortcut: 'E', action: () => onMeshAction('extrude', 'region') },
        { label: 'Extrude Along Normals', shortcut: 'Alt+E', action: () => onMeshAction('extrude', 'normals') },
        { label: 'Extrude Individual Faces', shortcut: 'Shift+E', action: () => onMeshAction('extrude', 'individual') },
        { label: 'Extrude to Cursor', action: () => onMeshAction('extrude', 'to-cursor') }
      ]},
      { label: 'Inset Faces', shortcut: 'I', action: () => onMeshAction('inset') },
      { label: 'Bevel', shortcut: 'Ctrl+B', action: () => onMeshAction('bevel') },
      { label: 'Loop Cut and Slide', shortcut: 'Ctrl+R', action: () => onMeshAction('loop-cut') },
      { label: 'Knife', shortcut: 'K', action: () => onMeshAction('knife') },
      { label: 'Bisect', action: () => onMeshAction('bisect') },
      { type: 'separator' },
      { label: 'Duplicate', shortcut: 'Shift+D', action: () => onMeshAction('duplicate') },
      { label: 'Spin', action: () => onMeshAction('spin') },
      { label: 'Screw', action: () => onMeshAction('screw') },
      { type: 'separator' },
      { label: 'Merge', submenu: [
        { label: 'At Center', action: () => onMeshAction('merge', 'center') },
        { label: 'At Cursor', action: () => onMeshAction('merge', 'cursor') },
        { label: 'Collapse', action: () => onMeshAction('merge', 'collapse') },
        { label: 'At First', action: () => onMeshAction('merge', 'first') },
        { label: 'At Last', action: () => onMeshAction('merge', 'last') },
        { label: 'By Distance', action: () => onMeshAction('merge', 'distance') }
      ]},
      { label: 'Split', submenu: [
        { label: 'Selection', shortcut: 'Y', action: () => onMeshAction('split', 'selection') },
        { label: 'Faces & Edges', action: () => onMeshAction('split', 'faces-edges') }
      ]},
      { label: 'Separate', shortcut: 'P', submenu: [
        { label: 'Selection', action: () => onMeshAction('separate', 'selection') },
        { label: 'By Material', action: () => onMeshAction('separate', 'material') },
        { label: 'By Loose Parts', action: () => onMeshAction('separate', 'loose-parts') }
      ]},
      { type: 'separator' },
      { label: 'Convex Hull', action: () => onMeshAction('convex-hull') },
      { label: 'Decimate', action: () => onMeshAction('decimate') },
      { type: 'separator' },
      { label: 'Faces', submenu: [
        { label: 'Fill', shortcut: 'F', action: () => onMeshAction('faces', 'fill') },
        { label: 'Grid Fill', action: () => onMeshAction('faces', 'grid-fill') },
        { label: 'Beauty Fill', action: () => onMeshAction('faces', 'beauty-fill') },
        { label: 'Triangulate Faces', shortcut: 'Ctrl+T', action: () => onMeshAction('faces', 'triangulate') },
        { label: 'Tris to Quads', shortcut: 'Alt+J', action: () => onMeshAction('faces', 'tris-to-quads') },
        { label: 'Solidify', action: () => onMeshAction('faces', 'solidify') },
        { label: 'Intersect (Knife)', action: () => onMeshAction('faces', 'intersect-knife') },
        { label: 'Intersect (Boolean)', action: () => onMeshAction('faces', 'intersect-boolean') },
        { label: 'Wireframe', action: () => onMeshAction('faces', 'wireframe') }
      ]},
      { label: 'Edges', submenu: [
        { label: 'Mark Seam', shortcut: 'Ctrl+E', action: () => onMeshAction('edges', 'mark-seam') },
        { label: 'Clear Seam', action: () => onMeshAction('edges', 'clear-seam') },
        { label: 'Mark Sharp', action: () => onMeshAction('edges', 'mark-sharp') },
        { label: 'Clear Sharp', action: () => onMeshAction('edges', 'clear-sharp') },
        { label: 'Rotate Edge CW', action: () => onMeshAction('edges', 'rotate-cw') },
        { label: 'Rotate Edge CCW', action: () => onMeshAction('edges', 'rotate-ccw') },
        { label: 'Edge Split', action: () => onMeshAction('edges', 'split') },
        { label: 'Bridge Edge Loops', action: () => onMeshAction('edges', 'bridge-loops') },
        { label: 'Subdivide', action: () => onMeshAction('edges', 'subdivide') },
        { label: 'Un-Subdivide', action: () => onMeshAction('edges', 'un-subdivide') }
      ]},
      { label: 'Vertices', submenu: [
        { label: 'Merge Vertices', shortcut: 'Alt+M', action: () => onMeshAction('vertices', 'merge') },
        { label: 'Rip Vertices', shortcut: 'V', action: () => onMeshAction('vertices', 'rip') },
        { label: 'Rip Vertices and Fill', shortcut: 'Alt+V', action: () => onMeshAction('vertices', 'rip-fill') },
        { label: 'Split', shortcut: 'Alt+D', action: () => onMeshAction('vertices', 'split') },
        { label: 'Smooth Vertices', action: () => onMeshAction('vertices', 'smooth') },
        { label: 'Slide Vertices', action: () => onMeshAction('vertices', 'slide') },
        { label: 'Connect Vertex Path', shortcut: 'J', action: () => onMeshAction('vertices', 'connect-path') },
        { label: 'Connect Vertex Pairs', action: () => onMeshAction('vertices', 'connect-pairs') }
      ]},
      { type: 'separator' },
      { label: 'Normals', submenu: [
        { label: 'Recalculate Outside', shortcut: 'Shift+Ctrl+N', action: () => onMeshAction('normals', 'recalculate-outside') },
        { label: 'Recalculate Inside', action: () => onMeshAction('normals', 'recalculate-inside') },
        { label: 'Flip', action: () => onMeshAction('normals', 'flip') },
        { label: 'Set From Faces', action: () => onMeshAction('normals', 'set-from-faces') },
        { label: 'Smooth Vectors', action: () => onMeshAction('normals', 'smooth-vectors') },
        { label: 'Reset Vectors', action: () => onMeshAction('normals', 'reset-vectors') }
      ]},
      { label: 'Shading', submenu: [
        { label: 'Smooth', action: () => onMeshAction('shading', 'smooth') },
        { label: 'Flat', action: () => onMeshAction('shading', 'flat') }
      ]},
      { label: 'Weights', submenu: [
        { label: 'Assign Automatic From Bones', action: () => onMeshAction('weights', 'assign-automatic') },
        { label: 'Assign From Bone Envelopes', action: () => onMeshAction('weights', 'assign-envelopes') },
        { label: 'Assign Automatic From Bones (With Automatic Weights)', action: () => onMeshAction('weights', 'assign-automatic-weights') },
        { label: 'Bone Heat Weighting', action: () => onMeshAction('weights', 'bone-heat') },
        { label: 'Normalize All', action: () => onMeshAction('weights', 'normalize-all') },
        { label: 'Normalize', action: () => onMeshAction('weights', 'normalize') },
        { label: 'Mirror', action: () => onMeshAction('weights', 'mirror') },
        { label: 'Invert', action: () => onMeshAction('weights', 'invert') },
        { label: 'Clean', action: () => onMeshAction('weights', 'clean') },
        { label: 'Quantize', action: () => onMeshAction('weights', 'quantize') },
        { label: 'Levels', action: () => onMeshAction('weights', 'levels') },
        { label: 'Smooth', action: () => onMeshAction('weights', 'smooth') },
        { label: 'Transfer Weights', action: () => onMeshAction('weights', 'transfer') },
        { label: 'Limit Total', action: () => onMeshAction('weights', 'limit-total') },
        { label: 'Fix Deforms', action: () => onMeshAction('weights', 'fix-deforms') }
      ]},
      { type: 'separator' },
      { label: 'Clean Up', submenu: [
        { label: 'Merge by Distance', action: () => onMeshAction('cleanup', 'merge-distance') },
        { label: 'Decimate Geometry', action: () => onMeshAction('cleanup', 'decimate') },
        { label: 'Fill Holes', action: () => onMeshAction('cleanup', 'fill-holes') },
        { label: 'Make Planar Faces', action: () => onMeshAction('cleanup', 'make-planar') },
        { label: 'Split Non-Planar Faces', action: () => onMeshAction('cleanup', 'split-non-planar') },
        { label: 'Split Concave Faces', action: () => onMeshAction('cleanup', 'split-concave') },
        { label: 'Delete Loose', action: () => onMeshAction('cleanup', 'delete-loose') },
        { label: 'Degenerate Dissolve', action: () => onMeshAction('cleanup', 'degenerate-dissolve') },
        { label: 'Limited Dissolve', action: () => onMeshAction('cleanup', 'limited-dissolve') }
      ]}
    ],
    Object: [
      { label: 'Transform', submenu: [
        { label: 'Clear Location', shortcut: 'Alt+G', action: () => onObjectAction('transform', 'clear-location') },
        { label: 'Clear Rotation', shortcut: 'Alt+R', action: () => onObjectAction('transform', 'clear-rotation') },
        { label: 'Clear Scale', shortcut: 'Alt+S', action: () => onObjectAction('transform', 'clear-scale') },
        { label: 'Clear Origin', action: () => onObjectAction('transform', 'clear-origin') },
        { label: 'Apply Location', action: () => onObjectAction('transform', 'apply-location') },
        { label: 'Apply Rotation', action: () => onObjectAction('transform', 'apply-rotation') },
        { label: 'Apply Scale', action: () => onObjectAction('transform', 'apply-scale') },
        { label: 'Apply All Transforms', shortcut: 'Ctrl+A', action: () => onObjectAction('transform', 'apply-all') }
      ]},
      { label: 'Set Origin', submenu: [
        { label: 'Geometry to Origin', action: () => onObjectAction('origin', 'geometry-to-origin') },
        { label: 'Origin to Geometry', action: () => onObjectAction('origin', 'origin-to-geometry') },
        { label: 'Origin to 3D Cursor', action: () => onObjectAction('origin', 'origin-to-cursor') },
        { label: 'Origin to Center of Mass (Surface)', action: () => onObjectAction('origin', 'origin-to-mass-surface') },
        { label: 'Origin to Center of Mass (Volume)', action: () => onObjectAction('origin', 'origin-to-mass-volume') }
      ]},
      { label: 'Parent', submenu: [
        { label: 'Set Parent', shortcut: 'Ctrl+P', action: () => onObjectAction('parent', 'set') },
        { label: 'Clear Parent', shortcut: 'Alt+P', action: () => onObjectAction('parent', 'clear') },
        { label: 'Clear Parent and Keep Transform', action: () => onObjectAction('parent', 'clear-keep-transform') },
        { label: 'Clear Parent Inverse', action: () => onObjectAction('parent', 'clear-inverse') }
      ]},
      { label: 'Track', submenu: [
        { label: 'Track To Constraint', action: () => onObjectAction('track', 'track-to') },
        { label: 'Locked Track Constraint', action: () => onObjectAction('track', 'locked-track') },
        { label: 'Damped Track Constraint', action: () => onObjectAction('track', 'damped-track') }
      ]},
      { label: 'Relations', submenu: [
        { label: 'Make Links', submenu: [
          { label: 'Objects to Scene', action: () => onObjectAction('relations', 'link-objects-to-scene') },
          { label: 'Object Data', action: () => onObjectAction('relations', 'link-object-data') },
          { label: 'Materials', action: () => onObjectAction('relations', 'link-materials') },
          { label: 'Animation Data', action: () => onObjectAction('relations', 'link-animation-data') },
          { label: 'Collection', action: () => onObjectAction('relations', 'link-collection') },
          { label: 'Instance Collection', action: () => onObjectAction('relations', 'link-instance-collection') },
          { label: 'Fonts', action: () => onObjectAction('relations', 'link-fonts') },
          { label: 'Modifiers', action: () => onObjectAction('relations', 'link-modifiers') }
        ]},
        { label: 'Make Single User', submenu: [
          { label: 'Object', action: () => onObjectAction('relations', 'single-user-object') },
          { label: 'Object & Data', action: () => onObjectAction('relations', 'single-user-object-data') },
          { label: 'Object & Data & Materials', action: () => onObjectAction('relations', 'single-user-all') },
          { label: 'Materials', action: () => onObjectAction('relations', 'single-user-materials') },
          { label: 'Object Animation', action: () => onObjectAction('relations', 'single-user-animation') }
        ]},
        { label: 'Transfer Mesh Data', action: () => onObjectAction('relations', 'transfer-mesh-data') }
      ]},
      { label: 'Show/Hide', submenu: [
        { label: 'Show Hidden Objects', shortcut: 'Alt+H', action: () => onObjectAction('visibility', 'show-hidden') },
        { label: 'Hide Selected Objects', shortcut: 'H', action: () => onObjectAction('visibility', 'hide-selected') },
        { label: 'Hide Unselected Objects', shortcut: 'Shift+H', action: () => onObjectAction('visibility', 'hide-unselected') }
      ]},
      { label: 'Convert', submenu: [
        { label: 'Curve from Mesh/Text', action: () => onObjectAction('convert', 'to-curve') },
        { label: 'Mesh from Curve/Meta/Surf/Text', action: () => onObjectAction('convert', 'to-mesh') },
        { label: 'Grease Pencil from Curve/Mesh', action: () => onObjectAction('convert', 'to-grease-pencil') }
      ]},
      { type: 'separator' },
      { label: 'Join', shortcut: 'Ctrl+J', action: () => onObjectAction('join') },
      { label: 'Join as Shapes', action: () => onObjectAction('join-shapes') },
      { type: 'separator' },
      { label: 'Copy Attributes', action: () => onObjectAction('copy-attributes') },
      { label: 'Make Proxy', action: () => onObjectAction('make-proxy') },
      { label: 'Make Override Library', action: () => onObjectAction('make-override-library') }
    ],
    Select: [
      { label: 'All', shortcut: 'A', action: () => onSelectAction('all') },
      { label: 'None', shortcut: 'Alt+A', action: () => onSelectAction('none') },
      { label: 'Invert', shortcut: 'Ctrl+I', action: () => onSelectAction('invert') },
      { type: 'separator' },
      { label: 'Box Select', shortcut: 'B', action: () => onSelectAction('box') },
      { label: 'Circle Select', shortcut: 'C', action: () => onSelectAction('circle') },
      { label: 'Lasso Select', action: () => onSelectAction('lasso') },
      { type: 'separator' },
      { label: 'Select Random', action: () => onSelectAction('random') },
      { label: 'Checker Deselect', action: () => onSelectAction('checker-deselect') },
      { type: 'separator' },
      { label: 'Select All by Type', submenu: [
        { label: 'Mesh', action: () => onSelectAction('by-type', 'mesh') },
        { label: 'Curve', action: () => onSelectAction('by-type', 'curve') },
        { label: 'Surface', action: () => onSelectAction('by-type', 'surface') },
        { label: 'Meta', action: () => onSelectAction('by-type', 'meta') },
        { label: 'Text', action: () => onSelectAction('by-type', 'text') },
        { label: 'Armature', action: () => onSelectAction('by-type', 'armature') },
        { label: 'Lattice', action: () => onSelectAction('by-type', 'lattice') },
        { label: 'Empty', action: () => onSelectAction('by-type', 'empty') },
        { label: 'Camera', action: () => onSelectAction('by-type', 'camera') },
        { label: 'Light', action: () => onSelectAction('by-type', 'light') },
        { label: 'Speaker', action: () => onSelectAction('by-type', 'speaker') }
      ]},
      { label: 'Select All by Layer', action: () => onSelectAction('by-layer') },
      { label: 'Select Pattern', action: () => onSelectAction('pattern') },
      { type: 'separator' },
      { label: 'Linked', submenu: [
        { label: 'Object Data', action: () => onSelectAction('linked', 'object-data') },
        { label: 'Material', action: () => onSelectAction('linked', 'material') },
        { label: 'Texture', action: () => onSelectAction('linked', 'texture') },
        { label: 'Dupligroup', action: () => onSelectAction('linked', 'dupligroup') },
        { label: 'Particle System', action: () => onSelectAction('linked', 'particle-system') },
        { label: 'Library', action: () => onSelectAction('linked', 'library') },
        { label: 'Library (Object Data)', action: () => onSelectAction('linked', 'library-object-data') }
      ]},
      { label: 'Grouped', submenu: [
        { label: 'Children', action: () => onSelectAction('grouped', 'children') },
        { label: 'Immediate Children', action: () => onSelectAction('grouped', 'immediate-children') },
        { label: 'Parent', action: () => onSelectAction('grouped', 'parent') },
        { label: 'Siblings', action: () => onSelectAction('grouped', 'siblings') },
        { label: 'Type', action: () => onSelectAction('grouped', 'type') },
        { label: 'Layer', action: () => onSelectAction('grouped', 'layer') },
        { label: 'Collection', action: () => onSelectAction('grouped', 'collection') },
        { label: 'Hook', action: () => onSelectAction('grouped', 'hook') },
        { label: 'Pass', action: () => onSelectAction('grouped', 'pass') },
        { label: 'Color', action: () => onSelectAction('grouped', 'color') },
        { label: 'Properties', action: () => onSelectAction('grouped', 'properties') },
        { label: 'Keying Set', action: () => onSelectAction('grouped', 'keying-set') },
        { label: 'Light Type', action: () => onSelectAction('grouped', 'light-type') }
      ]},
      { type: 'separator' },
      { label: 'More', action: () => onSelectAction('more') },
      { label: 'Less', action: () => onSelectAction('less') },
      { type: 'separator' },
      { label: 'Mirror', submenu: [
        { label: 'X-Axis', action: () => onSelectAction('mirror', 'x-axis') },
        { label: 'Y-Axis', action: () => onSelectAction('mirror', 'y-axis') },
        { label: 'Z-Axis', action: () => onSelectAction('mirror', 'z-axis') }
      ]}
    ],
    View: [
      { label: 'Tool Settings', action: () => onViewAction('tool-settings') },
      { label: 'Sidebar', shortcut: 'N', action: () => onViewAction('sidebar') },
      { type: 'separator' },
      { label: 'Camera', shortcut: 'Numpad 0', action: () => onViewAction('camera') },
      { label: 'Top', shortcut: 'Numpad 7', action: () => onViewAction('top') },
      { label: 'Bottom', shortcut: 'Ctrl+Numpad 7', action: () => onViewAction('bottom') },
      { label: 'Front', shortcut: 'Numpad 1', action: () => onViewAction('front') },
      { label: 'Back', shortcut: 'Ctrl+Numpad 1', action: () => onViewAction('back') },
      { label: 'Right', shortcut: 'Numpad 3', action: () => onViewAction('right') },
      { label: 'Left', shortcut: 'Ctrl+Numpad 3', action: () => onViewAction('left') },
      { type: 'separator' },
      { label: 'Toggle Perspective/Orthographic', shortcut: 'Numpad 5', action: () => onViewAction('toggle-perspective') },
      { label: 'View Selected', shortcut: 'Numpad .', action: () => onViewAction('view-selected') },
      { label: 'View All', shortcut: 'Home', action: () => onViewAction('view-all') },
      { type: 'separator' },
      { label: 'Viewport Shading', submenu: [
        { label: 'Wireframe', shortcut: 'Z', action: () => onViewAction('shading', 'wireframe') },
        { label: 'Solid', action: () => onViewAction('shading', 'solid') },
        { label: 'Material Preview', action: () => onViewAction('shading', 'material-preview') },
        { label: 'Rendered', action: () => onViewAction('shading', 'rendered') }
      ]},
      { label: 'Viewport Overlays', submenu: [
        { label: 'Toggle Overlays', action: () => onViewAction('overlays', 'toggle') },
        { label: 'Wireframes', action: () => onViewAction('overlays', 'wireframes') },
        { label: 'Face Orientation', action: () => onViewAction('overlays', 'face-orientation') },
        { label: 'Indices', action: () => onViewAction('overlays', 'indices') },
        { label: 'Normals', action: () => onViewAction('overlays', 'normals') },
        { label: 'Edge Length', action: () => onViewAction('overlays', 'edge-length') },
        { label: 'Edge Angle', action: () => onViewAction('overlays', 'edge-angle') },
        { label: 'Face Area', action: () => onViewAction('overlays', 'face-area') }
      ]},
      { type: 'separator' },
      { label: 'Local View', shortcut: 'Numpad /', action: () => onViewAction('local-view') },
      { label: 'Global View', action: () => onViewAction('global-view') },
      { type: 'separator' },
      { label: 'Frame Selected', shortcut: 'Numpad .', action: () => onViewAction('frame-selected') },
      { label: 'Frame All', shortcut: 'Home', action: () => onViewAction('frame-all') },
      { type: 'separator' },
      { label: 'Playback', submenu: [
        { label: 'Play Animation', shortcut: 'Space', action: () => onViewAction('playback', 'play') },
        { label: 'Play Animation Reversed', shortcut: 'Ctrl+Shift+Space', action: () => onViewAction('playback', 'play-reverse') },
        { label: 'Jump to Keyframes', action: () => onViewAction('playback', 'jump-keyframes') }
      ]},
      { type: 'separator' },
      { label: 'Navigation', submenu: [
        { label: 'Walk Navigation', action: () => onViewAction('navigation', 'walk') },
        { label: 'Fly Navigation', action: () => onViewAction('navigation', 'fly') },
        { label: 'Zoom to Mouse Position', action: () => onViewAction('navigation', 'zoom-to-mouse') },
        { label: 'Auto Perspective', action: () => onViewAction('navigation', 'auto-perspective') },
        { label: 'Smooth View', action: () => onViewAction('navigation', 'smooth-view') }
      ]},
      { type: 'separator' },
      { label: 'Viewport Gizmos', submenu: [
        { label: 'Navigate', action: () => onViewAction('gizmos', 'navigate') },
        { label: 'Tool', action: () => onViewAction('gizmos', 'tool') },
        { label: 'Object', action: () => onViewAction('gizmos', 'object') }
      ]}
    ],
    Render: [
      { label: 'Render Image', shortcut: 'F12', action: () => onRenderAction('render-image') },
      { label: 'Render Animation', shortcut: 'Ctrl+F12', action: () => onRenderAction('render-animation') },
      { type: 'separator' },
      { label: 'View Render', shortcut: 'F11', action: () => onRenderAction('view-render') },
      { label: 'View Animation', shortcut: 'Ctrl+F11', action: () => onRenderAction('view-animation') },
      { type: 'separator' },
      { label: 'Lock Interface', action: () => onRenderAction('lock-interface') },
      { type: 'separator' },
      { label: 'Set Render Region', shortcut: 'Ctrl+B', action: () => onRenderAction('set-render-region') },
      { label: 'Clear Render Region', shortcut: 'Ctrl+Alt+B', action: () => onRenderAction('clear-render-region') },
      { type: 'separator' },
      { label: 'Freestyle', submenu: [
        { label: 'Add Edge Mark', action: () => onRenderAction('freestyle', 'add-edge-mark') },
        { label: 'Clear Edge Mark', action: () => onRenderAction('freestyle', 'clear-edge-mark') },
        { label: 'Add Face Mark', action: () => onRenderAction('freestyle', 'add-face-mark') },
        { label: 'Clear Face Mark', action: () => onRenderAction('freestyle', 'clear-face-mark') }
      ]}
    ],
    Window: [
      { label: 'New Window', action: () => onWindowAction('new-window') },
      { label: 'New Main Window', action: () => onWindowAction('new-main-window') },
      { type: 'separator' },
      { label: 'Fullscreen Area', shortcut: 'Ctrl+Space', action: () => onWindowAction('fullscreen-area') },
      { label: 'Fullscreen Area (Global)', shortcut: 'Ctrl+Alt+Space', action: () => onWindowAction('fullscreen-global') },
      { type: 'separator' },
      { label: 'Duplicate Area into New Window', action: () => onWindowAction('duplicate-area') },
      { label: 'Toggle Window Fullscreen', shortcut: 'Alt+F11', action: () => onWindowAction('toggle-fullscreen') },
      { type: 'separator' },
      { label: 'Save Screenshot', action: () => onWindowAction('save-screenshot') },
      { type: 'separator' },
      { label: 'Redraw Timer', action: () => onWindowAction('redraw-timer') }
    ],
    Help: [
      { label: 'Manual', action: () => onHelpAction('manual') },
      { label: 'Tutorials', action: () => onHelpAction('tutorials') },
      { label: 'Support', submenu: [
        { label: 'User Communities', action: () => onHelpAction('support', 'communities') },
        { label: 'Developer Community', action: () => onHelpAction('support', 'developer') },
        { label: 'Report a Bug', action: () => onHelpAction('support', 'report-bug') }
      ]},
      { type: 'separator' },
      { label: 'Operator Cheat Sheet', action: () => onHelpAction('operator-cheat-sheet') },
      { type: 'separator' },
      { label: 'System Info', action: () => onHelpAction('system-info') },
      { type: 'separator' },
      { label: 'About', action: () => onHelpAction('about') }
    ]
  };

  const handleMenuClick = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleMenuItemClick = (item) => {
    if (item.action) {
      item.action();
    }
    setActiveMenu(null);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (activeMenu) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenu]);

  const renderMenuItem = (item, index) => {
    if (item.type === 'separator') {
      return <div key={index} className="menu-separator" />;
    }

    if (item.submenu) {
      return (
        <div key={index} className="menu-item submenu-item">
          <span>{item.label}</span>
          <span className="submenu-arrow">▶</span>
          <div className="submenu">
            {item.submenu.map((subItem, subIndex) => renderMenuItem(subItem, subIndex))}
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className="menu-item"
        onClick={() => handleMenuItemClick(item)}
      >
        <span>{item.label}</span>
        {item.shortcut && <span className="shortcut">{item.shortcut}</span>}
      </div>
    );
  };

  return (
    <div className="blender-menu-bar" onClick={(e) => e.stopPropagation()}>
      {Object.keys(menuItems).map((menuName) => (
        <div key={menuName} className="menu-container">
          <button
            className={`menu-button ${activeMenu === menuName ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick(menuName);
            }}
          >
            {menuName}
          </button>
          {activeMenu === menuName && (
            <div className="menu-dropdown" onClick={(e) => e.stopPropagation()}>
              {menuItems[menuName].map((item, index) => renderMenuItem(item, index))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BlenderMenuBar;
