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

export const getDefaultNodeStyle = () => {
  return {
    color: '#777777',
    background: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'font-weight-regular'
  }
}

export const getNodeWithInitialAttributes = () => {
  return {
    // Elixir default attributes
    id: null,
    root: null,
    tags: null,
    memo: null,
    style: getDefaultNodeStyle(),
    topic: null,
    icons: null,
    direction: null,
    hyperLink: null,
    childrenIds: null,

    // a3mind attributes
    parentId: null,
    nodeType: null,
    testTitle: null,
    testDescription: null,
    a3ClassName: null
  }
}

export const updateClassName = (currentClasses, classNames, className) => {
  const classList = currentClasses.split(' ');

  if (classList.includes(className)) {
    classList.splice(classList.indexOf(className), 1);
  }

  classNames.forEach(cls => {
    if (classList.includes(cls)) {
      classList.splice(classList.indexOf(cls), 1);
    }
  });

  classList.push(className);
  const updatedClassName = classList.join(' ');
  return updatedClassName;
}

export const removeClass = (currentClasses, classToRemove) => {
  const classList = currentClasses.split(' ');

  if (classList.includes(classToRemove)) {
    classList.splice(classList.indexOf(classToRemove), 1);
  }

  const updatedClassName = classList.join(' ');
  return updatedClassName;
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
