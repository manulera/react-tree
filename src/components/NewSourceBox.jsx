import React from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
// A component that is rendered on the side of the tree to add a new source
function NewSourceBox({ addSource, entity = null }) {
  const onClick = () => { addSource(entity === null ? [] : [entity]); };
  return (
    <button type="button" className="icon-hanging" onClick={onClick}>
      <div>
        <AiFillPlusCircle className="node-corner-icon" />
      </div>
    </button>
  );
}

export default NewSourceBox;
