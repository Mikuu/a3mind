import { get, post, del, put } from '@/utils/httpUtils';
import {
  HOST,
  BATH_PATH,
  PATH_NODES_BULK,
  PATH_VIEW,
  PATH_PROJECT,
  PATH_PROJECTS,
  PATH_VIEWS,
  PATH_NODE,
  PATH_RESULTS_CLEAR,
} from '@/configs/ambConfig';

const buildUrl = resourcePath => {
  return `${HOST}${BATH_PATH}${resourcePath}`;
};

export const retrieveProjects = async (accessToken, idTokenParsed) => {
  const url = buildUrl(PATH_PROJECTS)
  return await get(url, accessToken);
};

export const createProject = async (accessToken, projectName) => {
  const url = buildUrl(PATH_PROJECT);
  const payload = { projectName };
  return await post(url, accessToken, payload);
};

export const getProject = async (accessToken, pid) => {
  const url = buildUrl(PATH_PROJECT) + `/${pid}`;
  return await get(url, accessToken);
};

export const deleteProject = async (accessToken, pid) => {
  const url = buildUrl(PATH_PROJECT) + `/${pid}`;
  return await del(url, accessToken);
};

export const createView = async (accessToken, pid, viewType, viewName) => {
  const url = buildUrl(PATH_VIEW);
  const payload = { pid, viewType, viewName };
  return await post(url, accessToken, payload);
};

export const retrieveViews = async (accessToken, pid) => {
  const url = buildUrl(PATH_VIEWS) + `?pid=${pid}`;
  return await get(url, accessToken);
};

export const getView = async (accessToken, vid) => {
  const url = buildUrl(PATH_VIEW) + `/${vid}`;
  return await get(url, accessToken);
};

export const deleteView = async (accessToken, vid) => {
  const url = buildUrl(PATH_VIEW) + `/${vid}`;
  return await del(url, accessToken);
};

export const deleteViews = async (accessToken, pid) => {
  const url = buildUrl(PATH_VIEWS) + `?pid=${pid}`;
  return await del(url, accessToken);
}

export const fetchNodeBulk = async (accessToken, pid, vid) => {
  const url = buildUrl(PATH_NODES_BULK) + `?pid=${pid}&vid=${vid}`;
  return await get(url, accessToken);
};

export const updateNodeBulk = async (accessToken, pid, vid, updateNodes, deleteNodeIds) => {
  const url = buildUrl(PATH_NODES_BULK);
  const payload = { pid, vid, updateNodes, deleteNodeIds }
  console.log(payload);
  return await post(url, accessToken, payload);
};

export const getNode = async (accessToken, id) => {
  const url = buildUrl(PATH_NODE) + `?id=${id}`;
  return await get(url, accessToken);
};

export const updateNode = async (accessToken, nodeData) => {
  const url = buildUrl(PATH_NODE);
  const payload = {
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
  return await put(url, accessToken, payload);
};

export const clearResults = async (accessToken, vid) => {
  const url = buildUrl(PATH_RESULTS_CLEAR);
  const payload = { vid };
  return await post(url, accessToken, payload);
};
