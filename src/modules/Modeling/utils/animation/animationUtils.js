import * as THREE from 'three';

/**
 * Animation utilities for advanced keyframe animation and rigging
 */

export class AnimationSystem {
  constructor() {
    this.animations = new Map();
    this.armatures = new Map();
    this.constraints = new Map();
    this.isPlaying = false;
    this.currentFrame = 1;
    this.totalFrames = 250;
    this.frameRate = 24;
    this.playbackSpeed = 1.0;
    this.loopMode = 'repeat'; // 'once', 'repeat', 'pingpong'
  }

  /**
   * Create a new animation for an object
   */
  createAnimation(objectId, name = 'Animation') {
    const animation = {
      id: Date.now(),
      name,
      objectId,
      keyframes: new Map(),
      duration: this.totalFrames / this.frameRate,
      enabled: true
    };
    
    this.animations.set(animation.id, animation);
    return animation;
  }

  /**
   * Add a keyframe to an animation
   */
  addKeyframe(animationId, channel, subChannel, frame, value, interpolation = 'bezier') {
    const animation = this.animations.get(animationId);
    if (!animation) return null;

    const keyframeId = `${channel}_${subChannel}_${frame}`;
    const keyframe = {
      id: keyframeId,
      channel,
      subChannel,
      frame,
      value,
      interpolation,
      easing: 'ease-in-out',
      handles: {
        left: { x: frame - 1, y: value },
        right: { x: frame + 1, y: value }
      }
    };

    animation.keyframes.set(keyframeId, keyframe);
    return keyframe;
  }

  /**
   * Remove a keyframe from an animation
   */
  removeKeyframe(animationId, keyframeId) {
    const animation = this.animations.get(animationId);
    if (!animation) return false;

    return animation.keyframes.delete(keyframeId);
  }

  /**
   * Get keyframes for a specific channel
   */
  getKeyframes(animationId, channel, subChannel) {
    const animation = this.animations.get(animationId);
    if (!animation) return [];

    return Array.from(animation.keyframes.values())
      .filter(kf => kf.channel === channel && kf.subChannel === subChannel)
      .sort((a, b) => a.frame - b.frame);
  }

  /**
   * Interpolate value between keyframes
   */
  interpolateValue(keyframe1, keyframe2, frame, interpolation = 'bezier') {
    if (!keyframe1 || !keyframe2) return 0;
    if (frame <= keyframe1.frame) return keyframe1.value;
    if (frame >= keyframe2.frame) return keyframe2.value;

    const t = (frame - keyframe1.frame) / (keyframe2.frame - keyframe1.frame);
    
    switch (interpolation) {
      case 'constant':
        return keyframe1.value;
      
      case 'linear':
        return this.lerp(keyframe1.value, keyframe2.value, t);
      
      case 'bezier':
        return this.bezierInterpolate(keyframe1, keyframe2, t);
      
      case 'ease_in':
        return this.lerp(keyframe1.value, keyframe2.value, this.easeIn(t));
      
      case 'ease_out':
        return this.lerp(keyframe1.value, keyframe2.value, this.easeOut(t));
      
      case 'ease_in_out':
        return this.lerp(keyframe1.value, keyframe2.value, this.easeInOut(t));
      
      case 'bounce':
        return this.lerp(keyframe1.value, keyframe2.value, this.bounce(t));
      
      case 'elastic':
        return this.lerp(keyframe1.value, keyframe2.value, this.elastic(t));
      
      default:
        return this.lerp(keyframe1.value, keyframe2.value, t);
    }
  }

  /**
   * Linear interpolation
   */
  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /**
   * Bezier curve interpolation
   */
  bezierInterpolate(keyframe1, keyframe2, t) {
    const p0 = keyframe1.value;
    const p1 = keyframe1.handles.right.y;
    const p2 = keyframe2.handles.left.y;
    const p3 = keyframe2.value;

    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3;
  }

  /**
   * Easing functions
   */
  easeIn(t) {
    return t * t;
  }

  easeOut(t) {
    return 1 - (1 - t) * (1 - t);
  }

  easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  bounce(t) {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }

  elastic(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 :
      -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  }

  /**
   * Evaluate animation at a specific frame
   */
  evaluateAnimation(animationId, frame) {
    const animation = this.animations.get(animationId);
    if (!animation || !animation.enabled) return {};

    const result = {};
    const channels = ['location', 'rotation', 'scale', 'material', 'visibility'];
    
    channels.forEach(channel => {
      const subChannels = this.getSubChannels(channel);
      subChannels.forEach(subChannel => {
        const keyframes = this.getKeyframes(animationId, channel, subChannel);
        if (keyframes.length === 0) return;

        if (keyframes.length === 1) {
          result[`${channel}.${subChannel}`] = keyframes[0].value;
          return;
        }

        // Find surrounding keyframes
        let keyframe1 = null;
        let keyframe2 = null;

        for (let i = 0; i < keyframes.length - 1; i++) {
          if (frame >= keyframes[i].frame && frame <= keyframes[i + 1].frame) {
            keyframe1 = keyframes[i];
            keyframe2 = keyframes[i + 1];
            break;
          }
        }

        if (keyframe1 && keyframe2) {
          result[`${channel}.${subChannel}`] = this.interpolateValue(
            keyframe1, 
            keyframe2, 
            frame, 
            keyframe1.interpolation
          );
        } else if (frame <= keyframes[0].frame) {
          result[`${channel}.${subChannel}`] = keyframes[0].value;
        } else if (frame >= keyframes[keyframes.length - 1].frame) {
          result[`${channel}.${subChannel}`] = keyframes[keyframes.length - 1].value;
        }
      });
    });

    return result;
  }

  /**
   * Get sub-channels for a channel
   */
  getSubChannels(channel) {
    switch (channel) {
      case 'location':
      case 'rotation':
      case 'scale':
        return ['X', 'Y', 'Z'];
      case 'material':
        return ['Color', 'Metalness', 'Roughness', 'Opacity'];
      case 'visibility':
        return ['Visible'];
      default:
        return [];
    }
  }

  /**
   * Apply animation values to an object
   */
  applyAnimationToObject(object, animationValues) {
    Object.entries(animationValues).forEach(([key, value]) => {
      const [channel, subChannel] = key.split('.');
      
      switch (channel) {
        case 'location':
          if (object.position) {
            object.position[subChannel.toLowerCase()] = value;
          }
          break;
        
        case 'rotation':
          if (object.rotation) {
            object.rotation[subChannel.toLowerCase()] = value;
          }
          break;
        
        case 'scale':
          if (object.scale) {
            object.scale[subChannel.toLowerCase()] = value;
          }
          break;
        
        case 'material':
          if (object.material) {
            switch (subChannel) {
              case 'Color':
                object.material.color.setHex(value);
                break;
              case 'Metalness':
                if (object.material.metalness !== undefined) {
                  object.material.metalness = value;
                }
                break;
              case 'Roughness':
                if (object.material.roughness !== undefined) {
                  object.material.roughness = value;
                }
                break;
              case 'Opacity':
                object.material.opacity = value;
                object.material.transparent = value < 1;
                break;
            }
          }
          break;
        
        case 'visibility':
          object.visible = value > 0.5;
          break;
      }
    });
  }

  /**
   * Update animation system
   */
  update(deltaTime) {
    if (!this.isPlaying) return;

    const frameIncrement = (deltaTime * this.frameRate * this.playbackSpeed);
    this.currentFrame += frameIncrement;

    // Handle loop modes
    if (this.currentFrame > this.totalFrames) {
      switch (this.loopMode) {
        case 'once':
          this.currentFrame = this.totalFrames;
          this.isPlaying = false;
          break;
        case 'repeat':
          this.currentFrame = 1;
          break;
        case 'pingpong':
          this.currentFrame = this.totalFrames;
          this.playbackSpeed *= -1;
          break;
      }
    } else if (this.currentFrame < 1) {
      switch (this.loopMode) {
        case 'once':
          this.currentFrame = 1;
          this.isPlaying = false;
          break;
        case 'repeat':
          this.currentFrame = this.totalFrames;
          break;
        case 'pingpong':
          this.currentFrame = 1;
          this.playbackSpeed *= -1;
          break;
      }
    }
  }

  /**
   * Play animation
   */
  play() {
    this.isPlaying = true;
  }

  /**
   * Pause animation
   */
  pause() {
    this.isPlaying = false;
  }

  /**
   * Stop animation and reset to frame 1
   */
  stop() {
    this.isPlaying = false;
    this.currentFrame = 1;
  }

  /**
   * Set current frame
   */
  setFrame(frame) {
    this.currentFrame = Math.max(1, Math.min(this.totalFrames, frame));
  }

  /**
   * Bake animation to keyframes at every frame
   */
  bakeAnimation(animationId, startFrame = 1, endFrame = null) {
    const animation = this.animations.get(animationId);
    if (!animation) return false;

    const end = endFrame || this.totalFrames;
    const bakedKeyframes = new Map();

    for (let frame = startFrame; frame <= end; frame++) {
      const values = this.evaluateAnimation(animationId, frame);
      
      Object.entries(values).forEach(([key, value]) => {
        const [channel, subChannel] = key.split('.');
        const keyframeId = `${channel}_${subChannel}_${frame}`;
        
        bakedKeyframes.set(keyframeId, {
          id: keyframeId,
          channel,
          subChannel,
          frame,
          value,
          interpolation: 'linear'
        });
      });
    }

    animation.keyframes = bakedKeyframes;
    return true;
  }
}

// Create global animation system instance
export const animationSystem = new AnimationSystem();

// Export utility functions
export {
  AnimationSystem as default
};
