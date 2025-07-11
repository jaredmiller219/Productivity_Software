import React from 'react';
import Notes from '../modules/Notes/Notes.js';
import SimpleTerminal from '../modules/Terminal/SimpleTerminal.js';
import Browser from '../modules/Browser/Browser.js';
import IDE from '../modules/IDE/IDE.js';
import Modeling from '../modules/Modeling/Modeling.js';
import './Workspace.css';

function Workspace({ activeModule, showNotes }) {
  const renderModule = () => {
    switch (activeModule) {
      case 'notes':
        return showNotes ? <Notes /> : <Modeling />;
      case 'terminal':
        return <SimpleTerminal />;
      case 'browser':
        return <Browser />;
      case 'ide':
        return <IDE />;
      case 'modeling':
        return <Modeling />;
      default:
        return showNotes ? <Notes /> : <Modeling />;
    }
  };

  return (
    <div className="workspace">
      {renderModule()}
    </div>
  );
}

export default Workspace;
