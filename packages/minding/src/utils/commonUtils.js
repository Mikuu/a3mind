/** the current mind-elixir-core has a bug that cannot return correct style value of root node, therefor it need
 * be checked if the style object can be stringify successfully. **/
export const checkAndReturnStyleObject = styleObject => {
  try {
    JSON.stringify(styleObject);
    return styleObject;
  } catch (e) {
    console.warn(`FBI --> style object cannot be stringify: ${e.toString()}`);
  }

  return {};
};

export const getNodeWithInitialAttributes = () => {
  return {
    // Elixir default attributes
    id: null,
    root: null,
    tags: null,
    memo: null,
    style: null,
    topic: null,
    icons: null,
    direction: null,
    hyperLink: null,
    childrenIds: null,

    // a3mind attributes
    parentId: null,
    nodeType: null,
    testTitle: null,
    testDescription: null
  }
}

export const assignNodeData = (nodeData) => {
  return {
    // Elixir default attributes
    id: nodeData.id,
    root: nodeData.root,
    tags: nodeData.tags,
    memo: nodeData.memo,
    style: nodeData.style,
    topic: nodeData.topic,
    icons: nodeData.icons,
    direction: nodeData.direction,
    hyperLink: nodeData.hyperLink,
    childrenIds: nodeData.childrenIds,

    // a3mind attributes
    parentId: nodeData.parentId,
    nodeType: nodeData.nodeType,
    testTitle: nodeData.testTitle,
    testDescription: nodeData.testDescription
  }
}
