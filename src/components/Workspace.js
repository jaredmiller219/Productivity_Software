import React from 'react';
import Notes from '../modules/Notes/Notes';
import SimpleTerminal from '../modules/Terminal/SimpleTerminal';
import Browser from '../modules/Browser/Browser';
import IDE from '../modules/IDE/IDE';
import Modeling from '../modules/Modeling/Modeling';
import './Workspace.css';

function Workspace({ activeModule }) {
  const renderModule = () => {
    switch (activeModule) {
      case 'notes':
        return <Notes />;
      case 'terminal':
        return <SimpleTerminal />;
      case 'browser':
        return <Browser />;
      case 'ide':
        return <IDE />;
      case 'modeling':
        return <Modeling />;
      default:
        return <Notes />;
    }
  };

  return (
    <div className="workspace">
      {renderModule()}
    </div>
  );
}

export default Workspace;
