import React, { useEffect } from 'react';
import NewSourceBox from './NewSourceBox';

function SequenceEditor({ entity, addSource, getSourceWhereEntityIsInput }) {

  const renderCount = React.useRef(0);
  console.log(entity)
  const addSourceButton = getSourceWhereEntityIsInput(entity.id) !== undefined ? null : (
    <div className="hang-from-node">
      <p>
        <NewSourceBox {...{ addSource, entity }} />
      </p>
    </div>
  );


  return (
    <div>
      <h3>Renders: {renderCount.current++}</h3>
      entitity {entity.id}
      {addSourceButton}
    </div>
  );
}
export default SequenceEditor;
