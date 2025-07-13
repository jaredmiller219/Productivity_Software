import React, { useState, useRef, useEffect } from 'react';
import './DebugPanel.css';

const DEBUG_STATES = {
  STOPPED: 'stopped',
  RUNNING: 'running',
  PAUSED: 'paused',
  STEPPING: 'stepping'
};

const BREAKPOINT_TYPES = {
  LINE: 'line',
  CONDITIONAL: 'conditional',
  LOGPOINT: 'logpoint'
};

function DebugPanel({ 
  isVisible, 
  onClose, 
  currentFile, 
  onBreakpointToggle,
  onDebugStart,
  onDebugStop,
  onDebugStep,
  onDebugContinue
}) {
  const [debugState, setDebugState] = useState(DEBUG_STATES.STOPPED);
  const [breakpoints, setBreakpoints] = useState([]);
  const [watchExpressions, setWatchExpressions] = useState([]);
  const [callStack, setCallStack] = useState([]);
  const [variables, setVariables] = useState([]);
  const [console, setConsole] = useState([]);
  const [activeTab, setActiveTab] = useState('variables');
  const [newWatchExpression, setNewWatchExpression] = useState('');
  const [selectedBreakpoint, setSelectedBreakpoint] = useState(null);
  const consoleRef = useRef(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [console]);

  const handleStartDebugging = () => {
    setDebugState(DEBUG_STATES.RUNNING);
    setCallStack([
      { name: 'main', file: currentFile, line: 1, column: 1 },
      { name: 'init', file: 'app.js', line: 15, column: 5 }
    ]);
    setVariables([
      { name: 'x', value: '10', type: 'number', scope: 'local' },
      { name: 'message', value: '"Hello World"', type: 'string', scope: 'local' },
      { name: 'isActive', value: 'true', type: 'boolean', scope: 'local' },
      { name: 'config', value: '{...}', type: 'object', scope: 'global', expandable: true }
    ]);
    addConsoleMessage('Debug session started', 'info');
    onDebugStart?.();
  };

  const handleStopDebugging = () => {
    setDebugState(DEBUG_STATES.STOPPED);
    setCallStack([]);
    setVariables([]);
    addConsoleMessage('Debug session ended', 'info');
    onDebugStop?.();
  };

  const handlePauseResume = () => {
    if (debugState === DEBUG_STATES.RUNNING) {
      setDebugState(DEBUG_STATES.PAUSED);
      addConsoleMessage('Execution paused', 'info');
    } else if (debugState === DEBUG_STATES.PAUSED) {
      setDebugState(DEBUG_STATES.RUNNING);
      addConsoleMessage('Execution resumed', 'info');
      onDebugContinue?.();
    }
  };

  const handleStepOver = () => {
    setDebugState(DEBUG_STATES.STEPPING);
    addConsoleMessage('Step over', 'debug');
    onDebugStep?.('over');
    setTimeout(() => setDebugState(DEBUG_STATES.PAUSED), 500);
  };

  const handleStepInto = () => {
    setDebugState(DEBUG_STATES.STEPPING);
    addConsoleMessage('Step into', 'debug');
    onDebugStep?.('into');
    setTimeout(() => setDebugState(DEBUG_STATES.PAUSED), 500);
  };

  const handleStepOut = () => {
    setDebugState(DEBUG_STATES.STEPPING);
    addConsoleMessage('Step out', 'debug');
    onDebugStep?.('out');
    setTimeout(() => setDebugState(DEBUG_STATES.PAUSED), 500);
  };

  const addBreakpoint = (line, type = BREAKPOINT_TYPES.LINE, condition = '') => {
    const newBreakpoint = {
      id: Date.now(),
      file: currentFile,
      line,
      type,
      condition,
      enabled: true,
      hitCount: 0
    };
    setBreakpoints(prev => [...prev, newBreakpoint]);
    onBreakpointToggle?.(newBreakpoint, true);
  };

  const removeBreakpoint = (id) => {
    const breakpoint = breakpoints.find(bp => bp.id === id);
    setBreakpoints(prev => prev.filter(bp => bp.id !== id));
    onBreakpointToggle?.(breakpoint, false);
  };

  const toggleBreakpoint = (id) => {
    setBreakpoints(prev => prev.map(bp => 
      bp.id === id ? { ...bp, enabled: !bp.enabled } : bp
    ));
  };

  const addWatchExpression = () => {
    if (newWatchExpression.trim()) {
      const newWatch = {
        id: Date.now(),
        expression: newWatchExpression.trim(),
        value: 'undefined',
        type: 'undefined'
      };
      setWatchExpressions(prev => [...prev, newWatch]);
      setNewWatchExpression('');
      evaluateWatchExpression(newWatch);
    }
  };

  const removeWatchExpression = (id) => {
    setWatchExpressions(prev => prev.filter(watch => watch.id !== id));
  };

  const evaluateWatchExpression = (watch) => {
    // Simulate expression evaluation
    setTimeout(() => {
      setWatchExpressions(prev => prev.map(w => 
        w.id === watch.id ? { 
          ...w, 
          value: Math.random() > 0.5 ? '42' : '"Hello"',
          type: Math.random() > 0.5 ? 'number' : 'string'
        } : w
      ));
    }, 100);
  };

  const addConsoleMessage = (message, type = 'log') => {
    const newMessage = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setConsole(prev => [...prev, newMessage]);
  };

  const clearConsole = () => {
    setConsole([]);
  };

  const renderDebugControls = () => (
    <div className="debug-controls">
      <div className="control-group">
        {debugState === DEBUG_STATES.STOPPED ? (
          <button 
            className="debug-btn start"
            onClick={handleStartDebugging}
            title="Start Debugging (F5)"
          >
            ▶️ Start
          </button>
        ) : (
          <button 
            className="debug-btn stop"
            onClick={handleStopDebugging}
            title="Stop Debugging (Shift+F5)"
          >
            ⏹️ Stop
          </button>
        )}
        
        <button 
          className="debug-btn pause-resume"
          onClick={handlePauseResume}
          disabled={debugState === DEBUG_STATES.STOPPED}
          title={debugState === DEBUG_STATES.RUNNING ? "Pause (F6)" : "Continue (F5)"}
        >
          {debugState === DEBUG_STATES.RUNNING ? '⏸️' : '▶️'}
        </button>
      </div>
      
      <div className="control-group">
        <button 
          className="debug-btn step"
          onClick={handleStepOver}
          disabled={debugState !== DEBUG_STATES.PAUSED}
          title="Step Over (F10)"
        >
          ⤵️
        </button>
        <button 
          className="debug-btn step"
          onClick={handleStepInto}
          disabled={debugState !== DEBUG_STATES.PAUSED}
          title="Step Into (F11)"
        >
          ⤴️
        </button>
        <button 
          className="debug-btn step"
          onClick={handleStepOut}
          disabled={debugState !== DEBUG_STATES.PAUSED}
          title="Step Out (Shift+F11)"
        >
          ⤴️
        </button>
      </div>
    </div>
  );

  const renderVariablesTab = () => (
    <div className="debug-tab-content">
      <div className="variables-section">
        <h4>Local Variables</h4>
        <div className="variables-list">
          {variables.filter(v => v.scope === 'local').map(variable => (
            <div key={variable.name} className="variable-item">
              <span className="variable-name">{variable.name}</span>
              <span className="variable-value">{variable.value}</span>
              <span className="variable-type">{variable.type}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="variables-section">
        <h4>Global Variables</h4>
        <div className="variables-list">
          {variables.filter(v => v.scope === 'global').map(variable => (
            <div key={variable.name} className="variable-item">
              <span className="variable-name">{variable.name}</span>
              <span className="variable-value">{variable.value}</span>
              <span className="variable-type">{variable.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWatchTab = () => (
    <div className="debug-tab-content">
      <div className="watch-input">
        <input
          type="text"
          value={newWatchExpression}
          onChange={(e) => setNewWatchExpression(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addWatchExpression()}
          placeholder="Add expression to watch..."
          className="watch-expression-input"
        />
        <button onClick={addWatchExpression} className="add-watch-btn">+</button>
      </div>
      
      <div className="watch-list">
        {watchExpressions.map(watch => (
          <div key={watch.id} className="watch-item">
            <span className="watch-expression">{watch.expression}</span>
            <span className="watch-value">{watch.value}</span>
            <button 
              onClick={() => removeWatchExpression(watch.id)}
              className="remove-watch-btn"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCallStackTab = () => (
    <div className="debug-tab-content">
      <div className="call-stack-list">
        {callStack.map((frame, index) => (
          <div key={index} className="call-stack-item">
            <span className="frame-name">{frame.name}</span>
            <span className="frame-location">{frame.file}:{frame.line}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBreakpointsTab = () => (
    <div className="debug-tab-content">
      <div className="breakpoints-list">
        {breakpoints.map(breakpoint => (
          <div key={breakpoint.id} className="breakpoint-item">
            <input
              type="checkbox"
              checked={breakpoint.enabled}
              onChange={() => toggleBreakpoint(breakpoint.id)}
            />
            <span className="breakpoint-location">
              {breakpoint.file}:{breakpoint.line}
            </span>
            <span className="breakpoint-type">{breakpoint.type}</span>
            <button 
              onClick={() => removeBreakpoint(breakpoint.id)}
              className="remove-breakpoint-btn"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConsoleTab = () => (
    <div className="debug-tab-content">
      <div className="console-header">
        <button onClick={clearConsole} className="clear-console-btn">Clear</button>
      </div>
      <div ref={consoleRef} className="console-output">
        {console.map(message => (
          <div key={message.id} className={`console-message ${message.type}`}>
            <span className="message-timestamp">{message.timestamp}</span>
            <span className="message-text">{message.message}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (!isVisible) return null;

  return (
    <div className="debug-panel">
      <div className="debug-header">
        <h3>Debug Console</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      {renderDebugControls()}
      
      <div className="debug-status">
        <span className={`status-indicator ${debugState}`}></span>
        <span className="status-text">
          {debugState === DEBUG_STATES.STOPPED && 'Ready to debug'}
          {debugState === DEBUG_STATES.RUNNING && 'Running...'}
          {debugState === DEBUG_STATES.PAUSED && 'Paused'}
          {debugState === DEBUG_STATES.STEPPING && 'Stepping...'}
        </span>
      </div>
      
      <div className="debug-tabs">
        <button
          className={`tab-btn ${activeTab === 'variables' ? 'active' : ''}`}
          onClick={() => setActiveTab('variables')}
        >
          Variables
        </button>
        <button
          className={`tab-btn ${activeTab === 'watch' ? 'active' : ''}`}
          onClick={() => setActiveTab('watch')}
        >
          Watch
        </button>
        <button
          className={`tab-btn ${activeTab === 'callstack' ? 'active' : ''}`}
          onClick={() => setActiveTab('callstack')}
        >
          Call Stack
        </button>
        <button
          className={`tab-btn ${activeTab === 'breakpoints' ? 'active' : ''}`}
          onClick={() => setActiveTab('breakpoints')}
        >
          Breakpoints
        </button>
        <button
          className={`tab-btn ${activeTab === 'console' ? 'active' : ''}`}
          onClick={() => setActiveTab('console')}
        >
          Console
        </button>
      </div>
      
      <div className="debug-content">
        {activeTab === 'variables' && renderVariablesTab()}
        {activeTab === 'watch' && renderWatchTab()}
        {activeTab === 'callstack' && renderCallStackTab()}
        {activeTab === 'breakpoints' && renderBreakpointsTab()}
        {activeTab === 'console' && renderConsoleTab()}
      </div>
    </div>
  );
}

export { DEBUG_STATES, BREAKPOINT_TYPES };
export default DebugPanel;
