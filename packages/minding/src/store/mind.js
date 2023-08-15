import { defineStore } from 'pinia'
import MindElixir, { E } from 'mind-elixir'
import { useLocalStorage } from '@vueuse/core';
import { extractViewData, flattenNodeData, nodesToMindData } from "@/utils/dataUtils";
import { keycloak } from "@/plugins/keycloak";
import * as ambClient from "@/clients/ambClient";
import { latteTheme } from "@/utils/themeUtils";
import { getNodeWithInitialAttributes, assignNodeData } from "@/utils/commonUtils";
import * as styleUtils from "@/utils/styleUtils";

const SYNC_MIND_DATA_INTERVAL = 5000;

const nodeMenuPlugin = (state) => {
  return (mind) => {
    console.log("install node menu adv")

    mind.bus.addListener('operation', function(operation) {
      switch (operation.name) {
        case "addChild":
        case "insertSibling":
        case "insertParent":

          state.nodeMenu.display = false;
          break;

        case "removeNode":
          state.nodeMenu.display = false;
          break;
      }
    })

    // handle node selection
    mind.bus.addListener("unselectNode", function() {
      if (!state.nodeMenu.display) return

      state.nodeMenu.display = false;
      state.nodeMenu.node = null;
    })

    mind.bus.addListener("selectNode", function(nodeObj, clickEvent) {
      /**
       * nodeObj.style
       * nodeObj.style.fontSize
       * nodeObj.style.fontWeight
       * nodeObj.style.color
       * nodeObj.tags
       * nodeObj.icons
       * nodeObj.hyperLink
       * nodeObj.memo
       * nodeObj.topic
       * nodeObj.id
       * nodeObj.children
       * nodeObj.parent
       * nodeObj.direction
       * **/
      if (nodeObj.root) return;
      if (!clickEvent) return
      state.nodeMenu.display = true;

      // select or switch node.
      state.nodeMenu.node = { ...nodeObj };

      console.log(`selectNode[node data]: `);
      console.log(state.nodeMenu.node);

      /**
       * state.mind.currentNode.className can be used to update the element class, but mind-elixir-core has some hardcode
       * work which will override the class name, that it set className='selected' at selectNode event, and set
       * className='' at unselectNode event, similarly, addChild, insertParent and insertSibling also impacts on it,
       * additionally, when reload data from backend, customized style class will not be applied, it needs use E() to
       * iterate all nodes returned by mind.getData() to update the class name, but it may cause performance issue,
       * thus it needs lots of works to make customized style class work.
       */
      console.log(`selectNode[node element]: `);
      console.log(state.mind.currentNode);

      const defaultNode = getNodeWithInitialAttributes();
      if (!state.nodeMenu.node.style) {
        // handle newly created node, it doesn't have style object.
        state.nodeMenu.node.style = defaultNode.style;
      }
      state.nodeMenu.node.style.color ||= defaultNode.style.color;
      state.nodeMenu.node.style.background ||= defaultNode.style.background;
      state.nodeMenu.node.style.fontSize ||= defaultNode.style.fontSize;
      state.nodeMenu.node.style.fontWeight ||= defaultNode.style.fontWeight;
      state.nodeMenu.node.style.textDecoration ||= defaultNode.style.textDecoration;

      state.nodeMenu.node.nodeType ||= defaultNode.nodeType;

      state.nodeMenu.currentNodeId = nodeObj.id;
    })
  }
}

export const useMindStore = defineStore('mind', {
  state: () => ({
    pid: null,
    vid: null,
    mind: null,
    mindDataStorage: useLocalStorage('mind-data', null),
    mindOperationStorage: useLocalStorage('mind-operation', {
      updatedNodesIds: [],
      removedNodesIds: []
    }),
    nodeMenu: {
      display: null,
      node: getNodeWithInitialAttributes(),
      currentNodeId: null,
      classNameCache: null,
    }
  }),

  getters: {
    mindDataSync: (state) => state.mind.getData(),
    mindDataStored: (state) => JSON.parse(state.mindDataStorage),
  },

  actions: {
    /***
     * This action must be called before pull and save data.
     * **/
    async chargeMetaData(vid) {
      const viewDataResponse = await ambClient.getView(keycloak.token, vid);
      this.pid = viewDataResponse.pid;
      this.vid = viewDataResponse.vid;
    },

    initializeMind(elementLocator) {
      const eventListener = operation => {
        const logOperation = operation => {
          console.log('operation: ' + operation.name + ' -->');
          console.log(operation);
        };

        switch (operation.name) {
          case 'finishEdit':
          case 'reshapeNode':
          case 'updateMemo':
            logOperation(operation);
            if (!this.mindOperationStorage.updatedNodesIds.includes(operation.obj.id)) {
              this.mindOperationStorage.updatedNodesIds.push(operation.obj.id);
            }
            break;
          case 'moveNode':
          case 'moveNodeBefore':
          case 'moveNodeAfter':
            logOperation(operation);
            if (!this.mindOperationStorage.updatedNodesIds.includes(operation.obj.fromObj.id)) {
              this.mindOperationStorage.updatedNodesIds.push(operation.obj.fromObj.id);
            }
            break;
          case 'removeNode':
            logOperation(operation);
            this.mindOperationStorage.removedNodesIds.push(operation.obj.id);
            break;
          default:
            logOperation(operation);
        }
      };

      const options = { el: elementLocator, theme: latteTheme };
      const rootNode = MindElixir.new("");

      this.mind = new MindElixir(options);

      // The original nodeMenu hardcoded limited color, cannot support customized color and throw errors, thus
      //  it cannot be use together with my nodeMenuPlugin.
      // this.mind.install(nodeMenu);
      // this.mind.install(nodeMenuLocal);

      this.mind.install(nodeMenuPlugin(this));
      this.mind.init(rootNode);
      this.mind.bus.addListener('operation', eventListener);
    },

    initializeMindData(rootNodeName) {
      const rootNode = MindElixir.new(rootNodeName);
      this.mind.init(rootNode);
    },

    checkMindData() {
      console.log(this.mindDataSync);
      console.log(this.mindDataStored);
      console.log(this.mindDataStorage.toString());

      console.log(`authenticated: ${keycloak.authenticated}`);
      console.log(`token: ${keycloak.token}`);
    },

    async saveMindData(succeedHandler, failedHandler) {
      const fullData = this.mind.getData();
      const viewData = extractViewData(this.vid, fullData);
      const updateNodes = flattenNodeData(fullData.nodeData, this.mindOperationStorage.updatedNodesIds);

      /** saving to backend **/
      ambClient.updateNodeBulk(keycloak.token, this.pid, this.vid, updateNodes, this.mindOperationStorage.removedNodesIds)
        .then(() => {
          this.cleanMindOperationStorage();
          if (typeof succeedHandler === 'function') succeedHandler();

        }).catch((reason) => {
          console.error(reason);
          if (typeof failedHandler === 'function') failedHandler();
      });
    },

    async pullMindData(succeedHandler=null, failedHandler=null) {
      const applyA3Style = (nodes) => {
        /**
         * mind-elixir-core only apply style to fontSize, fontWeight, color and background, other customized style will
         * not be applied at refreshing|loading data from backend, thus it needs to use E() to iterate all nodes to
         * apply customized styling. However, the performance of this method is not validated with large amount of nodes,
         * if it has performance issue, then consider not to use customized style.
         * */
        for (const node of nodes) {
          const nodeElement = E(node.id);
          nodeElement.style.cssText = styleUtils.makeStyleString(node.style);
        }
      };

      /** pulling data from backend **/
      ambClient.fetchNodeBulk(keycloak.token, this.pid, this.vid)
        .then(async response => {
          const mindData = nodesToMindData(response.nodes);

          await this.loadBackendMindDataOrInitializeNewMind(this.vid, mindData);
          applyA3Style(response.nodes);

          if (typeof succeedHandler === 'function') succeedHandler();

        })
        .catch((reason) => {
          console.error(reason);
          if (typeof failedHandler === 'function') failedHandler();
        })
    },

    cleanMindOperationStorage() {
      this.mindOperationStorage.updatedNodesIds = [];
      this.mindOperationStorage.removedNodesIds = [];
    },

    setupAutoSyncMindDataToStorage() {
      setInterval(() => {
        this.mindDataStorage = JSON.stringify(this.mind.getData());
      }, SYNC_MIND_DATA_INTERVAL);
    },

    async loadBackendMindDataOrInitializeNewMind(vid, mindData) {
      const viewDataResponse = await ambClient.getView(keycloak.token, vid);

      if (mindData) {
        this.loadMindData({
          /** backend doesn't support and never save frontend linkData, thus always create empty object when fetch
           * from backend **/
          linkData: {},
          theme: viewDataResponse.theme,
          direction: viewDataResponse.direction,
          nodeData: mindData
        });

      } else {
        this.initializeMindData(viewDataResponse.viewName);
      }
    },

    loadMindData(mindData) {
      this.mind.refresh(mindData);
    },

    fetchNode(id, succeedHandler=null, failedHandler=null) {
      ambClient.getNode(keycloak.token, id)
        .then(response => {
          this.nodeMenu.node = response;
          if (succeedHandler) { succeedHandler(); }
        })
        .catch(reason => {
          console.error(reason);
          if (failedHandler) { failedHandler(reason?.message ? `: ${reason?.message}` : ""); }
        });
    },

    updateNode(succeedHandler=null, failedHandler=null) {
      const nodeData = assignNodeData(this.nodeMenu.node);
      ambClient.updateNode(keycloak.token, nodeData)
        .then(response => {
          if (succeedHandler) { succeedHandler(); }
        })
        .catch(reason => {
          console.error(reason);
          if (failedHandler) { failedHandler(reason?.message ? `: ${reason?.message}` : ""); }
        });
    }
  },

})
