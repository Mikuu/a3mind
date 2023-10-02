import { getDefaultNodeStyle } from "@/utils/styleUtils";

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
    style: getDefaultNodeStyle(),
    topic: null,
    icons: null,
    direction: null,
    hyperLink: null,
    childrenIds: null,

    // a3mind attributes
    parentId: null,
    nodeType: "general",
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

export const checkAndAppendOperationId = (operationIdList, operationId) => {
  if (!operationIdList.includes(operationId)) {
    operationIdList.push(operationId);
  }
};

export const idToTestId = (id) => {
  return `TID${id.toUpperCase()}`;
};

export const testIdToId = (testId) => {
  return testId.replace('TID', '').toLowerCase();
};

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
