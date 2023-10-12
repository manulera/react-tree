import React from 'react';
import './App.css';
import { constructNetwork } from './network';
import NetWorkNode from './components/NetworkNode';
import NewSourceBox from './components/NewSourceBox';


function App() {
  // A counter with the next unique id to be assigned to a node
  const [nextUniqueId, setNextUniqueId] = React.useState(2);

  // A function to produce unique identifiers for entities
  // TODO check async behaviour of this
  const uniqueIdDispatcher = () => {
    const idReturn = nextUniqueId;
    setNextUniqueId(nextUniqueId + 1);
    return idReturn;
  };

  const [entities, setEntities] = React.useState([]);
  const [sources, setSources] = React.useState([
    {
      id: 1,
      input: [],
      output: null,
      type: null,
      kind: 'source',
    },
  ]);




  // We pass this set function to the constructor of the tree, so that when you click on a
  // toggle button, the sequence in that node is displayed in the main editor
  const [mainSequenceId, setMainSequenceId] = React.useState(null);

  // Update the entities state variable with a new entity
  // we pass also the source to delete an entity
  // with the same source, if existed
  const updateOrCreateEntity = (newEntity, newSource) => {
    // If any of the entities was coming from that source, we delete it
    // TODO switch to different array method and move this out of this function
    const oldSource = sources.filter(
      (s) => s.id === newSource.id,
    )[0];
    // TODO Here we could consider simply to iterate through all orphan entities, and remove those
    // for now I don't see a case where the orphaning would not happen here.
    const newEntities = entities.filter(
      (entity) => entity.id !== oldSource.output,
    );
    // We add the new entity
    newEntities.push(newEntity);
    setEntities(newEntities);
  };

  // TODO this is probably not great
  // Update the state by adding a new source, and possibly executing the step associated with
  // the source. For example, we may set a source partially, e.g. specify that it is restriction,
  // but not specify the enzymes. This will add the source, but not execute the step.
  const updateSource = (newSource, newEntityWithoutId = null) => {
    // If the entity is not passed, just update the source
    if (newEntityWithoutId === null) {
      setSources(sources.map((source) => (source.id === newSource.id ? { ...source, ...newSource } : source)));
      return;
    }
    const newEntity = { ...newEntityWithoutId, id: uniqueIdDispatcher() };

    // // Add the entity
    updateOrCreateEntity(newEntity, newSource);
    setSources(sources.map((source) => (source.id === newSource.id ? { ...newSource, output: newEntity.id } : source)));
  };

  // Return an entity from its id. This is used for executing sources that take inputs,
  // since source.input is an array with the ids of input entities
  const getEntityFromId = (id) => entities.filter((entity) => entity.id === id)[0];
  const getSourceWhereEntityIsInput = (id) => sources.find((source) => source.input.includes(id));
  // Add a new source
  const addSource = (inputEntities) => {
    const inputEntitiesIds = inputEntities.map((entity) => entity.id);
    setSources(sources.concat([
      {
        id: uniqueIdDispatcher(),
        input: inputEntitiesIds,
        output: null,
        type: null,
        kind: 'source',
      },
    ]));
  };

  // Here we find the entities that don't have a child source, and could be linked
  // to a source with multiple inputs.
  let idsEntitiesWithChildSource = [];
  sources.forEach((source) => {
    idsEntitiesWithChildSource = idsEntitiesWithChildSource.concat(source.input);
  });
  const entitiesNotChildSource = [];

  entities.forEach((entity) => {
    if (!idsEntitiesWithChildSource.includes(entity.id)) {
      entitiesNotChildSource.push(entity);
    }
  });

  const getEntitiesNotChildSource = () => entities.filter((entity) => !idsEntitiesWithChildSource.includes(entity.id));

  // This function sets the state of mainSequenceId (the id of the sequence that is displayed
  // outside of the tree in the rich editor). It is passed to the MainSequenceCheckBox, to
  // have one at each node.
  const updateMainSequenceId = (id) => {
    const newMainSequenceId = mainSequenceId !== id ? id : null;
    setMainSequenceId(newMainSequenceId);
  };

  const network2 = constructNetwork(entities, sources);
  // A function to delete a source and its children
  const deleteSource = (sourceId) => {
    const sources2delete = [];
    const entities2delete = [];
    let currentSource = sources.find((s) => s.id === sourceId);
    while (currentSource !== undefined) {
      sources2delete.push(currentSource.id);
      if (currentSource.output === null) { break; }
      entities2delete.push(currentSource.output);
      currentSource = sources.find((ss) => ss.input.includes(currentSource.output));
    }

    setSources(sources.filter((s) => !sources2delete.includes(s.id)));
    setEntities(entities.filter((e) => !entities2delete.includes(e.id)));
  };

  return (
    <div className="App">
      <div className="app-container">
        <div className="network-container">
          <div className="tf-tree tf-ancestor-tree">
            <ul>
              {network2.map((node) => (
                <NetWorkNode node={node} key={node.source.id} {...{updateSource, getEntitiesNotChildSource, addSource, getSourceWhereEntityIsInput}}/>)
              )}
              {/* There is always a box on the right side to add a source*/}
              <li key="new_source_box">
                <span className="tf-nc"><span className="node-text"><NewSourceBox {...{ addSource }} /></span></span>
              </li>
            </ul>
          </div>
        </div>
        <code style={{whiteSpace: 'pre-wrap', textAlign: 'left', display: 'inline-block'}}>
          {JSON.stringify(network2, null, 4)}
        </code>
      </div>
    </div>
  );
}

export default App;
