import React, { useState, useRef, useEffect } from 'react';
import './AnimationCurves.css';

const AnimationCurves = ({ 
  selectedObject,
  keyframes = {},
  onCurveUpdate,
  currentFrame = 1,
  totalFrames = 250
}) => {
  const [selectedCurves, setSelectedCurves] = useState(['location.x']);
  const [curveZoom, setCurveZoom] = useState({ x: 1, y: 1 });
  const [curvePan, setCurvePan] = useState({ x: 0, y: 0 });
  const [selectedKeyframes, setSelectedKeyframes] = useState([]);
  const [draggedKeyframe, setDraggedKeyframe] = useState(null);
  const [interpolationMode, setInterpolationMode] = useState('bezier');
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });

  const interpolationModes = [
    { value: 'constant', name: 'Constant', icon: '⬜' },
    { value: 'linear', name: 'Linear', icon: '📈' },
    { value: 'bezier', name: 'Bezier', icon: '🌊' },
    { value: 'ease_in', name: 'Ease In', icon: '📉' },
    { value: 'ease_out', name: 'Ease Out', icon: '📈' },
    { value: 'ease_in_out', name: 'Ease In-Out', icon: '🌊' },
    { value: 'bounce', name: 'Bounce', icon: '🏀' },
    { value: 'elastic', name: 'Elastic', icon: '🎾' }
  ];

  const curveChannels = [
    { id: 'location.x', name: 'Location X', color: '#ff6b6b' },
    { id: 'location.y', name: 'Location Y', color: '#4ecdc4' },
    { id: 'location.z', name: 'Location Z', color: '#45b7d1' },
    { id: 'rotation.x', name: 'Rotation X', color: '#ff9ff3' },
    { id: 'rotation.y', name: 'Rotation Y', color: '#54a0ff' },
    { id: 'rotation.z', name: 'Rotation Z', color: '#5f27cd' },
    { id: 'scale.x', name: 'Scale X', color: '#00d2d3' },
    { id: 'scale.y', name: 'Scale Y', color: '#ff9f43' },
    { id: 'scale.z', name: 'Scale Z', color: '#10ac84' },
    { id: 'material.opacity', name: 'Material Opacity', color: '#a55eea' },
    { id: 'material.metalness', name: 'Material Metalness', color: '#26de81' },
    { id: 'material.roughness', name: 'Material Roughness', color: '#fd79a8' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      setCanvasSize({ width: rect.width, height: rect.height });
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  }, []);

  useEffect(() => {
    drawCurves();
  }, [selectedCurves, keyframes, curveZoom, curvePan, currentFrame, canvasSize]);

  const getKeyframesForCurve = (curveId) => {
    const [channel, subChannel] = curveId.split('.');
    return Object.values(keyframes).filter(
      kf => kf.channel === channel && kf.subChannel === subChannel.toUpperCase()
    ).sort((a, b) => a.frame - b.frame);
  };

  const screenToCanvas = (screenX, screenY) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: (screenX - rect.left - curvePan.x) / curveZoom.x,
      y: (screenY - rect.top - curvePan.y) / curveZoom.y
    };
  };

  const canvasToScreen = (canvasX, canvasY) => {
    return {
      x: canvasX * curveZoom.x + curvePan.x,
      y: canvasY * curveZoom.y + curvePan.y
    };
  };

  const frameToX = (frame) => {
    return (frame / totalFrames) * canvasSize.width;
  };

  const valueToY = (value, minValue = -10, maxValue = 10) => {
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    return canvasSize.height - (normalizedValue * canvasSize.height);
  };

  const interpolateValue = (keyframe1, keyframe2, frame, mode = 'bezier') => {
    if (!keyframe1 || !keyframe2) return 0;
    
    const t = (frame - keyframe1.frame) / (keyframe2.frame - keyframe1.frame);
    
    switch (mode) {
      case 'constant':
        return keyframe1.value;
      case 'linear':
        return keyframe1.value + (keyframe2.value - keyframe1.value) * t;
      case 'bezier':
        // Simplified bezier interpolation
        const t2 = t * t;
        const t3 = t2 * t;
        return keyframe1.value + (keyframe2.value - keyframe1.value) * (3 * t2 - 2 * t3);
      case 'ease_in':
        return keyframe1.value + (keyframe2.value - keyframe1.value) * (t * t);
      case 'ease_out':
        return keyframe1.value + (keyframe2.value - keyframe1.value) * (1 - (1 - t) * (1 - t));
      case 'ease_in_out':
        const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        return keyframe1.value + (keyframe2.value - keyframe1.value) * easeT;
      case 'bounce':
        const bounceT = t < 0.5 ? 
          4 * t * t * t : 
          1 - Math.pow(-2 * t + 2, 3) / 2;
        return keyframe1.value + (keyframe2.value - keyframe1.value) * bounceT;
      case 'elastic':
        const c4 = (2 * Math.PI) / 3;
        const elasticT = t === 0 ? 0 : t === 1 ? 1 :
          t < 0.5 ?
            -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c4)) / 2 :
            (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c4)) / 2 + 1;
        return keyframe1.value + (keyframe2.value - keyframe1.value) * elasticT;
      default:
        return keyframe1.value + (keyframe2.value - keyframe1.value) * t;
    }
  };

  const drawCurves = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid(ctx);
    
    // Draw curves
    selectedCurves.forEach(curveId => {
      const channel = curveChannels.find(c => c.id === curveId);
      if (!channel) return;
      
      const curveKeyframes = getKeyframesForCurve(curveId);
      if (curveKeyframes.length === 0) return;
      
      drawCurve(ctx, curveKeyframes, channel.color, interpolationMode);
      drawKeyframes(ctx, curveKeyframes, channel.color);
    });
    
    // Draw current frame indicator
    drawCurrentFrameIndicator(ctx);
  };

  const drawGrid = (ctx) => {
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = 1;
    
    // Vertical lines (frames)
    const frameStep = Math.max(1, Math.floor(50 / curveZoom.x));
    for (let frame = 0; frame <= totalFrames; frame += frameStep) {
      const x = frameToX(frame);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasSize.height);
      ctx.stroke();
      
      // Frame labels
      if (frame % (frameStep * 5) === 0) {
        ctx.fillStyle = '#666666';
        ctx.font = '10px Arial';
        ctx.fillText(frame.toString(), x + 2, 12);
      }
    }
    
    // Horizontal lines (values)
    const valueStep = Math.max(0.1, Math.floor(1 / curveZoom.y));
    for (let value = -10; value <= 10; value += valueStep) {
      const y = valueToY(value);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasSize.width, y);
      ctx.stroke();
      
      // Value labels
      if (Math.abs(value % 1) < 0.01) {
        ctx.fillStyle = '#666666';
        ctx.font = '10px Arial';
        ctx.fillText(value.toFixed(1), 2, y - 2);
      }
    }
  };

  const drawCurve = (ctx, keyframes, color, mode) => {
    if (keyframes.length < 2) return;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const startFrame = Math.max(1, keyframes[0].frame);
    const endFrame = Math.min(totalFrames, keyframes[keyframes.length - 1].frame);
    
    for (let frame = startFrame; frame <= endFrame; frame += 0.5) {
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
      
      if (!keyframe1 || !keyframe2) continue;
      
      const value = interpolateValue(keyframe1, keyframe2, frame, mode);
      const x = frameToX(frame);
      const y = valueToY(value);
      
      if (frame === startFrame) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
  };

  const drawKeyframes = (ctx, keyframes, color) => {
    keyframes.forEach(keyframe => {
      const x = frameToX(keyframe.frame);
      const y = valueToY(keyframe.value);
      
      ctx.fillStyle = color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      
      // Draw keyframe diamond
      ctx.beginPath();
      ctx.moveTo(x, y - 6);
      ctx.lineTo(x + 6, y);
      ctx.lineTo(x, y + 6);
      ctx.lineTo(x - 6, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Highlight selected keyframes
      if (selectedKeyframes.includes(keyframe.id)) {
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });
  };

  const drawCurrentFrameIndicator = (ctx) => {
    const x = frameToX(currentFrame);
    
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasSize.height);
    ctx.stroke();
  };

  const handleCanvasClick = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if clicking on a keyframe
    let clickedKeyframe = null;
    
    selectedCurves.forEach(curveId => {
      const curveKeyframes = getKeyframesForCurve(curveId);
      curveKeyframes.forEach(keyframe => {
        const kfX = frameToX(keyframe.frame);
        const kfY = valueToY(keyframe.value);
        
        if (Math.abs(x - kfX) < 8 && Math.abs(y - kfY) < 8) {
          clickedKeyframe = keyframe;
        }
      });
    });
    
    if (clickedKeyframe) {
      if (event.ctrlKey || event.metaKey) {
        // Add to selection
        if (selectedKeyframes.includes(clickedKeyframe.id)) {
          setSelectedKeyframes(selectedKeyframes.filter(id => id !== clickedKeyframe.id));
        } else {
          setSelectedKeyframes([...selectedKeyframes, clickedKeyframe.id]);
        }
      } else {
        // Select only this keyframe
        setSelectedKeyframes([clickedKeyframe.id]);
      }
    } else {
      // Clear selection
      setSelectedKeyframes([]);
    }
  };

  const handleZoom = (delta, centerX, centerY) => {
    const zoomFactor = delta > 0 ? 1.1 : 0.9;
    const newZoomX = Math.max(0.1, Math.min(10, curveZoom.x * zoomFactor));
    const newZoomY = Math.max(0.1, Math.min(10, curveZoom.y * zoomFactor));
    
    setCurveZoom({ x: newZoomX, y: newZoomY });
  };

  return (
    <div className="animation-curves">
      <div className="curves-header">
        <h3>Animation Curves</h3>
        {!selectedObject && (
          <p className="no-selection">Select an object to edit animation curves</p>
        )}
      </div>

      {selectedObject && (
        <>
          <div className="curves-controls">
            <div className="curve-channels">
              <label>Channels:</label>
              <div className="channel-checkboxes">
                {curveChannels.map(channel => (
                  <label key={channel.id} className="channel-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCurves.includes(channel.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCurves([...selectedCurves, channel.id]);
                        } else {
                          setSelectedCurves(selectedCurves.filter(id => id !== channel.id));
                        }
                      }}
                    />
                    <span 
                      className="channel-color" 
                      style={{ backgroundColor: channel.color }}
                    />
                    <span className="channel-name">{channel.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="interpolation-controls">
              <label>Interpolation:</label>
              <div className="interpolation-buttons">
                {interpolationModes.map(mode => (
                  <button
                    key={mode.value}
                    className={`interpolation-btn ${interpolationMode === mode.value ? 'active' : ''}`}
                    onClick={() => setInterpolationMode(mode.value)}
                    title={mode.name}
                  >
                    {mode.icon}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="curve-tools">
              <button className="curve-tool" onClick={() => setCurveZoom({ x: 1, y: 1 })}>
                🔍 Reset Zoom
              </button>
              <button className="curve-tool" onClick={() => setCurvePan({ x: 0, y: 0 })}>
                🎯 Reset Pan
              </button>
              <button className="curve-tool">
                📈 Frame All
              </button>
              <button className="curve-tool">
                🔧 Normalize
              </button>
            </div>
          </div>
          
          <div className="curves-viewport">
            <canvas
              ref={canvasRef}
              className="curves-canvas"
              onClick={handleCanvasClick}
              onWheel={(e) => {
                e.preventDefault();
                handleZoom(e.deltaY, e.clientX, e.clientY);
              }}
              style={{ width: '100%', height: '400px' }}
            />
          </div>
          
          <div className="curves-info">
            <div className="zoom-info">
              Zoom: {curveZoom.x.toFixed(2)}x, {curveZoom.y.toFixed(2)}x
            </div>
            <div className="selection-info">
              Selected: {selectedKeyframes.length} keyframes
            </div>
            <div className="frame-info">
              Frame: {currentFrame} / {totalFrames}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnimationCurves;
