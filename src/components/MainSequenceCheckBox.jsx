import React from 'react';
import { AiFillEye } from 'react-icons/ai';

function MainSequenceCheckBox({ id, mainSequenceId, updateMainSequenceId }) {
  const toggleMain = () => updateMainSequenceId(id);
  const tooltipText = <div className="tooltip-text">See sequence in main editor</div>;
  return (
    <div className="node-corner">
        <input id={`checkbox-main${id}`} type="checkbox" className="hidden-checkbox" onChange={toggleMain} checked={id === mainSequenceId} />
        <label htmlFor={`checkbox-main${id}`}>
              <AiFillEye className="node-corner-icon" />
        </label>
    </div>
  );
}

export default MainSequenceCheckBox;
