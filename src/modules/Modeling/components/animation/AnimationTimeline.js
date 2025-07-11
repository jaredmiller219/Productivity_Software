import React, { useState, useEffect, useRef } from 'react';
import './AnimationTimeline.css';

const AnimationTimeline = ({ 
  selectedObject, 
  onKeyframeAdd, 
  onKeyframeDelete, 
  onKeyframeUpdate,
  onTimelineUpdate,
  animationData = {},
  isPlaying = false,
  currentFrame = 1,
  totalFrames = 250,
  frameRate = 24,
  onPlayPause,
  onFrameChange,
  onFrameRateChange,
  onTotalFramesChange
}) => {
  const [keyframes, setKeyframes] = useState({});
  const [selectedKeyframes, setSelectedKeyframes] = useState([]);
  const [draggedKeyframe, setDraggedKeyframe] = useState(null);
  const [timelineZoom, setTimelineZoom] = useState(1);
  const [timelineScroll, setTimelineScroll] = useState(0);
  const [selectedChannels, setSelectedChannels] = useState(['location', 'rotation', 'scale']);
  const timelineRef = useRef(null);

  const animationChannels = [
    { id: 'location', name: 'Location', color: '#ff6b6b', subChannels: ['X', 'Y', 'Z'] },
    { id: 'rotation', name: 'Rotation', color: '#4ecdc4', subChannels: ['X', 'Y', 'Z'] },
    { id: 'scale', name: 'Scale', color: '#45b7d1', subChannels: ['X', 'Y', 'Z'] },
    { id: 'material', name: 'Material', color: '#96ceb4', subChannels: ['Color', 'Metalness', 'Roughness', 'Opacity'] },
    { id: 'visibility', name: 'Visibility', color: '#feca57', subChannels: ['Visible'] },
    { id: 'custom', name: 'Custom Properties', color: '#ff9ff3', subChannels: [] }
  ];

  useEffect(() => {
    if (selectedObject && animationData[selectedObject.uuid]) {
      setKeyframes(animationData[selectedObject.uuid]);
    } else {
      setKeyframes({});
    }
  }, [selectedObject, animationData]);

  const addKeyframe = (channel, subChannel, frame, value) => {
    const keyframeId = `${channel}_${subChannel}_${frame}`;
    const newKeyframe = {
      id: keyframeId,
      channel,
      subChannel,
      frame,
      value,
      interpolation: 'bezier',
      easing: 'ease-in-out'
    };

    const updatedKeyframes = {
      ...keyframes,
      [keyframeId]: newKeyframe
    };

    setKeyframes(updatedKeyframes);
    
    if (onKeyframeAdd) {
      onKeyframeAdd(selectedObject, newKeyframe);
    }
  };

  const deleteKeyframe = (keyframeId) => {
    const updatedKeyframes = { ...keyframes };
    delete updatedKeyframes[keyframeId];
    setKeyframes(updatedKeyframes);
    
    if (onKeyframeDelete) {
      onKeyframeDelete(selectedObject, keyframeId);
    }
  };

  const updateKeyframe = (keyframeId, updates) => {
    const updatedKeyframes = {
      ...keyframes,
      [keyframeId]: { ...keyframes[keyframeId], ...updates }
    };
    setKeyframes(updatedKeyframes);
    
    if (onKeyframeUpdate) {
      onKeyframeUpdate(selectedObject, keyframeId, updates);
    }
  };

  const handleKeyframeDrag = (keyframeId, newFrame) => {
    const keyframe = keyframes[keyframeId];
    if (!keyframe) return;

    const newKeyframeId = `${keyframe.channel}_${keyframe.subChannel}_${newFrame}`;
    
    // Remove old keyframe and add new one
    const updatedKeyframes = { ...keyframes };
    delete updatedKeyframes[keyframeId];
    updatedKeyframes[newKeyframeId] = {
      ...keyframe,
      id: newKeyframeId,
      frame: newFrame
    };
    
    setKeyframes(updatedKeyframes);
  };

  const getKeyframesForChannel = (channel, subChannel) => {
    return Object.values(keyframes).filter(
      kf => kf.channel === channel && kf.subChannel === subChannel
    ).sort((a, b) => a.frame - b.frame);
  };

  const getCurrentValue = (channel, subChannel) => {
    if (!selectedObject) return 0;
    
    switch (channel) {
      case 'location':
        return selectedObject.position[subChannel.toLowerCase()] || 0;
      case 'rotation':
        return selectedObject.rotation[subChannel.toLowerCase()] || 0;
      case 'scale':
        return selectedObject.scale[subChannel.toLowerCase()] || 1;
      case 'material':
        if (subChannel === 'Color') return selectedObject.material?.color?.getHex() || 0;
        if (subChannel === 'Metalness') return selectedObject.material?.metalness || 0;
        if (subChannel === 'Roughness') return selectedObject.material?.roughness || 0.5;
        if (subChannel === 'Opacity') return selectedObject.material?.opacity || 1;
        return 0;
      case 'visibility':
        return selectedObject.visible ? 1 : 0;
      default:
        return 0;
    }
  };

  const insertKeyframeAtCurrentFrame = (channel, subChannel) => {
    const value = getCurrentValue(channel, subChannel);
    addKeyframe(channel, subChannel, currentFrame, value);
  };

  const renderTimelineHeader = () => (
    <div className="timeline-header">
      <div className="timeline-controls">
        <button 
          className={`play-button ${isPlaying ? 'playing' : ''}`}
          onClick={onPlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button 
          className="stop-button"
          onClick={() => onFrameChange(1)}
          title="Stop"
        >
          ⏹️
        </button>
        <button 
          className="prev-frame"
          onClick={() => onFrameChange(Math.max(1, currentFrame - 1))}
          title="Previous Frame"
        >
          ⏮️
        </button>
        <button 
          className="next-frame"
          onClick={() => onFrameChange(Math.min(totalFrames, currentFrame + 1))}
          title="Next Frame"
        >
          ⏭️
        </button>
      </div>
      
      <div className="frame-info">
        <label>Frame:</label>
        <input
          type="number"
          min="1"
          max={totalFrames}
          value={currentFrame}
          onChange={(e) => onFrameChange(parseInt(e.target.value))}
          className="frame-input"
        />
        <span>/ {totalFrames}</span>
      </div>
      
      <div className="timeline-settings">
        <label>FPS:</label>
        <select 
          value={frameRate} 
          onChange={(e) => onFrameRateChange(parseInt(e.target.value))}
        >
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={30}>30</option>
          <option value={60}>60</option>
        </select>
        
        <label>End:</label>
        <input
          type="number"
          min="1"
          max="10000"
          value={totalFrames}
          onChange={(e) => onTotalFramesChange(parseInt(e.target.value))}
          className="end-frame-input"
        />
      </div>
      
      <div className="timeline-zoom">
        <label>Zoom:</label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={timelineZoom}
          onChange={(e) => setTimelineZoom(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );

  const renderChannelRow = (channel) => (
    <div key={channel.id} className="channel-row">
      <div className="channel-header">
        <div 
          className="channel-color" 
          style={{ backgroundColor: channel.color }}
        />
        <span className="channel-name">{channel.name}</span>
        <button
          className="channel-toggle"
          onClick={() => {
            const newSelected = selectedChannels.includes(channel.id)
              ? selectedChannels.filter(id => id !== channel.id)
              : [...selectedChannels, channel.id];
            setSelectedChannels(newSelected);
          }}
        >
          {selectedChannels.includes(channel.id) ? '👁️' : '🚫'}
        </button>
      </div>
      
      {selectedChannels.includes(channel.id) && channel.subChannels.map(subChannel => (
        <div key={`${channel.id}_${subChannel}`} className="subchannel-row">
          <div className="subchannel-header">
            <span className="subchannel-name">{subChannel}</span>
            <button
              className="add-keyframe-btn"
              onClick={() => insertKeyframeAtCurrentFrame(channel.id, subChannel)}
              title="Insert Keyframe"
            >
              🔑
            </button>
          </div>
          
          <div className="keyframe-track">
            {renderKeyframeTrack(channel.id, subChannel)}
          </div>
        </div>
      ))}
    </div>
  );

  const renderKeyframeTrack = (channel, subChannel) => {
    const channelKeyframes = getKeyframesForChannel(channel, subChannel);
    const trackWidth = totalFrames * timelineZoom * 10; // 10px per frame at 1x zoom
    
    return (
      <div 
        className="keyframe-track-container"
        style={{ width: `${trackWidth}px` }}
      >
        {/* Frame markers */}
        {Array.from({ length: Math.ceil(totalFrames / 10) }, (_, i) => (
          <div
            key={i}
            className="frame-marker"
            style={{ left: `${i * 10 * timelineZoom * 10}px` }}
          >
            {i * 10}
          </div>
        ))}
        
        {/* Current frame indicator */}
        <div
          className="current-frame-indicator"
          style={{ left: `${(currentFrame - 1) * timelineZoom * 10}px` }}
        />
        
        {/* Keyframes */}
        {channelKeyframes.map(keyframe => (
          <div
            key={keyframe.id}
            className={`keyframe ${selectedKeyframes.includes(keyframe.id) ? 'selected' : ''}`}
            style={{ 
              left: `${(keyframe.frame - 1) * timelineZoom * 10}px`,
              backgroundColor: animationChannels.find(c => c.id === channel)?.color || '#666'
            }}
            onClick={() => {
              if (selectedKeyframes.includes(keyframe.id)) {
                setSelectedKeyframes(selectedKeyframes.filter(id => id !== keyframe.id));
              } else {
                setSelectedKeyframes([...selectedKeyframes, keyframe.id]);
              }
            }}
            onDoubleClick={() => onFrameChange(keyframe.frame)}
            title={`Frame ${keyframe.frame}: ${keyframe.value}`}
          />
        ))}
        
        {/* Keyframe curves */}
        {channelKeyframes.length > 1 && (
          <svg className="keyframe-curves" style={{ width: `${trackWidth}px` }}>
            {channelKeyframes.slice(0, -1).map((keyframe, index) => {
              const nextKeyframe = channelKeyframes[index + 1];
              const x1 = (keyframe.frame - 1) * timelineZoom * 10;
              const x2 = (nextKeyframe.frame - 1) * timelineZoom * 10;
              
              return (
                <line
                  key={`${keyframe.id}_curve`}
                  x1={x1}
                  y1="10"
                  x2={x2}
                  y2="10"
                  stroke={animationChannels.find(c => c.id === channel)?.color || '#666'}
                  strokeWidth="2"
                  opacity="0.5"
                />
              );
            })}
          </svg>
        )}
      </div>
    );
  };

  return (
    <div className="animation-timeline">
      <div className="timeline-header-container">
        {renderTimelineHeader()}
      </div>
      
      {!selectedObject ? (
        <div className="no-selection">
          <p>Select an object to animate</p>
        </div>
      ) : (
        <div className="timeline-content" ref={timelineRef}>
          <div className="channels-container">
            {animationChannels.map(channel => renderChannelRow(channel))}
          </div>
          
          <div className="timeline-actions">
            <button
              className="clear-animation"
              onClick={() => {
                setKeyframes({});
                setSelectedKeyframes([]);
              }}
            >
              Clear All Keyframes
            </button>
            
            <button
              className="bake-animation"
              onClick={() => console.log('Bake animation')}
            >
              Bake Animation
            </button>
            
            <button
              className="export-animation"
              onClick={() => console.log('Export animation')}
            >
              Export Animation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimationTimeline;
