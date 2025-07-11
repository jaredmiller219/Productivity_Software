import * as THREE from 'three';

/**
 * Rigging utilities for armatures, bones, and constraints
 */

export class RiggingSystem {
  constructor() {
    this.armatures = new Map();
    this.bones = new Map();
    this.constraints = new Map();
    this.ikSolvers = new Map();
  }

  /**
   * Create a new armature
   */
  createArmature(name = 'Armature', position = [0, 0, 0]) {
    const armature = {
      id: Date.now(),
      name,
      position: new THREE.Vector3(...position),
      rotation: new THREE.Euler(),
      scale: new THREE.Vector3(1, 1, 1),
      bones: new Map(),
      display_type: 'octahedral',
      show_names: true,
      show_axes: false,
      show_in_front: false,
      layers: Array(32).fill(false).map((_, i) => i === 0),
      object3d: null
    };

    // Create Three.js object for the armature
    armature.object3d = this.createArmatureObject(armature);
    
    this.armatures.set(armature.id, armature);
    return armature;
  }

  /**
   * Create Three.js object for armature visualization
   */
  createArmatureObject(armature) {
    const group = new THREE.Group();
    group.name = armature.name;
    group.userData.type = 'armature';
    group.userData.armatureId = armature.id;
    
    return group;
  }

  /**
   * Add a bone to an armature
   */
  addBone(armatureId, boneData) {
    const armature = this.armatures.get(armatureId);
    if (!armature) return null;

    const bone = {
      id: boneData.id || Date.now(),
      name: boneData.name || `Bone.${armature.bones.size + 1}`,
      parent: boneData.parent || null,
      children: [],
      head: new THREE.Vector3(...(boneData.head || [0, 0, 0])),
      tail: new THREE.Vector3(...(boneData.tail || [0, 1, 0])),
      roll: boneData.roll || 0,
      length: boneData.length || 1,
      deform: boneData.deform !== false,
      inherit_rotation: boneData.inherit_rotation !== false,
      inherit_scale: boneData.inherit_scale !== false,
      local_location: boneData.local_location !== false,
      envelope_distance: boneData.envelope_distance || 0.25,
      envelope_weight: boneData.envelope_weight || 1.0,
      constraints: [],
      matrix: new THREE.Matrix4(),
      worldMatrix: new THREE.Matrix4(),
      object3d: null
    };

    // Calculate bone length if not provided
    if (!boneData.length) {
      bone.length = bone.head.distanceTo(bone.tail);
    }

    // Create Three.js object for bone visualization
    bone.object3d = this.createBoneObject(bone, armature.display_type);

    // Set up parent-child relationships
    if (bone.parent) {
      const parentBone = armature.bones.get(bone.parent);
      if (parentBone) {
        parentBone.children.push(bone.id);
        parentBone.object3d.add(bone.object3d);
      }
    } else {
      armature.object3d.add(bone.object3d);
    }

    armature.bones.set(bone.id, bone);
    this.bones.set(bone.id, bone);

    return bone;
  }

  /**
   * Create Three.js object for bone visualization
   */
  createBoneObject(bone, displayType = 'octahedral') {
    const group = new THREE.Group();
    group.name = bone.name;
    group.userData.type = 'bone';
    group.userData.boneId = bone.id;

    let geometry, material;

    switch (displayType) {
      case 'octahedral':
        geometry = this.createOctahedralGeometry(bone.length);
        break;
      case 'stick':
        geometry = this.createStickGeometry(bone.length);
        break;
      case 'bbone':
        geometry = this.createBBoneGeometry(bone.length);
        break;
      case 'envelope':
        geometry = this.createEnvelopeGeometry(bone.length, bone.envelope_distance);
        break;
      case 'wire':
        geometry = this.createWireGeometry(bone.length);
        break;
      default:
        geometry = this.createOctahedralGeometry(bone.length);
    }

    material = new THREE.MeshBasicMaterial({
      color: bone.deform ? 0x60a0ff : 0xffa060,
      wireframe: displayType === 'wire',
      transparent: true,
      opacity: 0.8
    });

    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    // Position bone from head to tail
    group.position.copy(bone.head);
    group.lookAt(bone.tail);

    return group;
  }

  /**
   * Create octahedral bone geometry
   */
  createOctahedralGeometry(length) {
    const geometry = new THREE.OctahedronGeometry(length * 0.1, 0);
    geometry.scale(1, length / (length * 0.1), 1);
    return geometry;
  }

  /**
   * Create stick bone geometry
   */
  createStickGeometry(length) {
    const geometry = new THREE.CylinderGeometry(0.02, 0.02, length, 8);
    geometry.rotateX(Math.PI / 2);
    return geometry;
  }

  /**
   * Create B-Bone geometry
   */
  createBBoneGeometry(length) {
    const geometry = new THREE.BoxGeometry(0.1, length, 0.1);
    return geometry;
  }

  /**
   * Create envelope geometry
   */
  createEnvelopeGeometry(length, envelopeDistance) {
    const geometry = new THREE.SphereGeometry(envelopeDistance, 16, 8);
    return geometry;
  }

  /**
   * Create wire geometry
   */
  createWireGeometry(length) {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0,
      0, length, 0
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return geometry;
  }

  /**
   * Remove a bone from an armature
   */
  removeBone(armatureId, boneId) {
    const armature = this.armatures.get(armatureId);
    const bone = this.bones.get(boneId);
    
    if (!armature || !bone) return false;

    // Remove from parent's children
    if (bone.parent) {
      const parentBone = armature.bones.get(bone.parent);
      if (parentBone) {
        parentBone.children = parentBone.children.filter(id => id !== boneId);
      }
    }

    // Reparent children to this bone's parent
    bone.children.forEach(childId => {
      const childBone = armature.bones.get(childId);
      if (childBone) {
        childBone.parent = bone.parent;
        if (bone.parent) {
          const parentBone = armature.bones.get(bone.parent);
          if (parentBone) {
            parentBone.children.push(childId);
          }
        }
      }
    });

    // Remove from scene
    if (bone.object3d && bone.object3d.parent) {
      bone.object3d.parent.remove(bone.object3d);
    }

    // Clean up
    armature.bones.delete(boneId);
    this.bones.delete(boneId);

    return true;
  }

  /**
   * Add a constraint to a bone
   */
  addConstraint(armatureId, boneId, constraintData) {
    const bone = this.bones.get(boneId);
    if (!bone) return null;

    const constraint = {
      id: constraintData.id || Date.now(),
      type: constraintData.type,
      name: constraintData.name || constraintData.type,
      enabled: constraintData.enabled !== false,
      influence: constraintData.influence || 1.0,
      target: constraintData.target || null,
      properties: constraintData.properties || {},
      boneId
    };

    bone.constraints.push(constraint);
    this.constraints.set(constraint.id, constraint);

    return constraint;
  }

  /**
   * Remove a constraint from a bone
   */
  removeConstraint(constraintId) {
    const constraint = this.constraints.get(constraintId);
    if (!constraint) return false;

    const bone = this.bones.get(constraint.boneId);
    if (bone) {
      bone.constraints = bone.constraints.filter(c => c.id !== constraintId);
    }

    this.constraints.delete(constraintId);
    return true;
  }

  /**
   * Solve IK constraint
   */
  solveIK(constraint) {
    if (constraint.type !== 'ik' || !constraint.enabled) return;

    const bone = this.bones.get(constraint.boneId);
    if (!bone || !constraint.target) return;

    const chainLength = constraint.properties.chain_count || 2;
    const iterations = constraint.properties.iterations || 500;
    const tolerance = 0.001;

    // Get bone chain
    const chain = this.getBoneChain(bone.id, chainLength);
    if (chain.length < 2) return;

    // FABRIK IK solver
    this.solveFABRIK(chain, constraint.target, iterations, tolerance);
  }

  /**
   * Get bone chain for IK solving
   */
  getBoneChain(boneId, length) {
    const chain = [];
    let currentBone = this.bones.get(boneId);

    while (currentBone && chain.length < length) {
      chain.unshift(currentBone);
      currentBone = currentBone.parent ? this.bones.get(currentBone.parent) : null;
    }

    return chain;
  }

  /**
   * FABRIK IK solver implementation
   */
  solveFABRIK(chain, target, iterations, tolerance) {
    if (chain.length < 2) return;

    const positions = chain.map(bone => bone.tail.clone());
    const distances = [];
    
    // Calculate distances between joints
    for (let i = 0; i < chain.length - 1; i++) {
      distances.push(positions[i].distanceTo(positions[i + 1]));
    }

    const totalLength = distances.reduce((sum, dist) => sum + dist, 0);
    const targetDistance = positions[0].distanceTo(target);

    // Check if target is reachable
    if (targetDistance > totalLength) {
      // Stretch towards target
      const direction = target.clone().sub(positions[0]).normalize();
      for (let i = 1; i < positions.length; i++) {
        positions[i] = positions[i - 1].clone().add(direction.clone().multiplyScalar(distances[i - 1]));
      }
    } else {
      // FABRIK algorithm
      for (let iter = 0; iter < iterations; iter++) {
        // Forward pass
        positions[positions.length - 1] = target.clone();
        for (let i = positions.length - 2; i >= 0; i--) {
          const direction = positions[i].clone().sub(positions[i + 1]).normalize();
          positions[i] = positions[i + 1].clone().add(direction.multiplyScalar(distances[i]));
        }

        // Backward pass
        for (let i = 1; i < positions.length; i++) {
          const direction = positions[i].clone().sub(positions[i - 1]).normalize();
          positions[i] = positions[i - 1].clone().add(direction.multiplyScalar(distances[i - 1]));
        }

        // Check convergence
        if (positions[positions.length - 1].distanceTo(target) < tolerance) {
          break;
        }
      }
    }

    // Apply results back to bones
    for (let i = 0; i < chain.length; i++) {
      chain[i].tail.copy(positions[i]);
      if (i > 0) {
        chain[i].head.copy(positions[i - 1]);
      }
      this.updateBoneTransform(chain[i]);
    }
  }

  /**
   * Update bone transform based on head/tail positions
   */
  updateBoneTransform(bone) {
    if (!bone.object3d) return;

    bone.object3d.position.copy(bone.head);
    bone.object3d.lookAt(bone.tail);
    bone.length = bone.head.distanceTo(bone.tail);
  }

  /**
   * Update all constraints for an armature
   */
  updateConstraints(armatureId) {
    const armature = this.armatures.get(armatureId);
    if (!armature) return;

    // Process constraints in order of priority
    const constraintTypes = ['ik', 'track_to', 'copy_location', 'copy_rotation', 'copy_scale'];
    
    constraintTypes.forEach(type => {
      armature.bones.forEach(bone => {
        bone.constraints
          .filter(constraint => constraint.type === type && constraint.enabled)
          .forEach(constraint => {
            this.solveConstraint(constraint);
          });
      });
    });
  }

  /**
   * Solve individual constraint
   */
  solveConstraint(constraint) {
    switch (constraint.type) {
      case 'ik':
        this.solveIK(constraint);
        break;
      case 'copy_location':
        this.solveCopyLocation(constraint);
        break;
      case 'copy_rotation':
        this.solveCopyRotation(constraint);
        break;
      case 'copy_scale':
        this.solveCopyScale(constraint);
        break;
      case 'track_to':
        this.solveTrackTo(constraint);
        break;
      // Add more constraint solvers as needed
    }
  }

  /**
   * Solve copy location constraint
   */
  solveCopyLocation(constraint) {
    const bone = this.bones.get(constraint.boneId);
    if (!bone || !constraint.target) return;

    const influence = constraint.influence;
    const props = constraint.properties;

    if (props.use_x) {
      bone.head.x = THREE.MathUtils.lerp(bone.head.x, constraint.target.x, influence);
    }
    if (props.use_y) {
      bone.head.y = THREE.MathUtils.lerp(bone.head.y, constraint.target.y, influence);
    }
    if (props.use_z) {
      bone.head.z = THREE.MathUtils.lerp(bone.head.z, constraint.target.z, influence);
    }

    this.updateBoneTransform(bone);
  }

  /**
   * Solve copy rotation constraint
   */
  solveCopyRotation(constraint) {
    const bone = this.bones.get(constraint.boneId);
    if (!bone || !constraint.target || !bone.object3d) return;

    const influence = constraint.influence;
    const targetRotation = constraint.target.rotation || new THREE.Euler();

    bone.object3d.rotation.x = THREE.MathUtils.lerp(bone.object3d.rotation.x, targetRotation.x, influence);
    bone.object3d.rotation.y = THREE.MathUtils.lerp(bone.object3d.rotation.y, targetRotation.y, influence);
    bone.object3d.rotation.z = THREE.MathUtils.lerp(bone.object3d.rotation.z, targetRotation.z, influence);
  }

  /**
   * Solve copy scale constraint
   */
  solveCopyScale(constraint) {
    const bone = this.bones.get(constraint.boneId);
    if (!bone || !constraint.target || !bone.object3d) return;

    const influence = constraint.influence;
    const targetScale = constraint.target.scale || new THREE.Vector3(1, 1, 1);

    bone.object3d.scale.x = THREE.MathUtils.lerp(bone.object3d.scale.x, targetScale.x, influence);
    bone.object3d.scale.y = THREE.MathUtils.lerp(bone.object3d.scale.y, targetScale.y, influence);
    bone.object3d.scale.z = THREE.MathUtils.lerp(bone.object3d.scale.z, targetScale.z, influence);
  }

  /**
   * Solve track to constraint
   */
  solveTrackTo(constraint) {
    const bone = this.bones.get(constraint.boneId);
    if (!bone || !constraint.target || !bone.object3d) return;

    const targetPosition = constraint.target.position || new THREE.Vector3();
    bone.object3d.lookAt(targetPosition);
  }

  /**
   * Update armature display
   */
  updateArmatureDisplay(armatureId) {
    const armature = this.armatures.get(armatureId);
    if (!armature) return;

    armature.bones.forEach(bone => {
      if (bone.object3d) {
        bone.object3d.visible = armature.layers[0]; // Simplified layer system
        
        // Update bone visualization based on display type
        const mesh = bone.object3d.children[0];
        if (mesh && mesh.material) {
          mesh.material.color.setHex(bone.deform ? 0x60a0ff : 0xffa060);
        }
      }
    });
  }
}

// Create global rigging system instance
export const riggingSystem = new RiggingSystem();

// Export utility functions
export {
  RiggingSystem as default
};
