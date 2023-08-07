// Utilities
import { defineStore } from 'pinia'
import MindElixir from "mind-elixir";
import nodeMenu from '@mind-elixir/node-menu';
import { useLocalStorage } from '@vueuse/core';
import { extractViewData, flattenNodeData, nodesToMindData } from "@/utils/dataUtils";
import { keycloak } from "@/plugins/keycloak";
import * as ambClient from "@/clients/ambClient";
import { latteTheme } from "@/utils/themeUtils";
import { getNodeWithInitialAttributes, assignNodeData } from "@/utils/commonUtils";

const SYNC_MIND_DATA_INTERVAL = 5000;

const nodeMenuPlugin = (mind, state) => {
  return (mind) => {
    console.log("install node menu adv")

    // handle node selection
    mind.bus.addListener("unselectNode", function() {
      state.nodeMenu.display = false;
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

      if (!clickEvent) return
      state.nodeMenu.display = true;

      ambClient.getNode(keycloak.token, nodeObj.id)
        .then(response => {
          state.nodeMenu.node = response;
        })
        .catch(reason => {
          console.error(reason);
        });
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
      node: getNodeWithInitialAttributes(),
      display: null
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
      this.mind.install(nodeMenu);
      this.mind.install(nodeMenuPlugin(this.mind, this));
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
      // const viewDataResponse = await ambClient.getView(keycloak.token, this.vid);

      /** pulling data from backend **/
      ambClient.fetchNodeBulk(keycloak.token, this.pid, this.vid)
        .then(async response => {
          const mindData = nodesToMindData(response.nodes);
          // console.log(`FBI --> response:`);
          // console.log(response);
          // console.log(response.nodes);
          // console.log(mindData);

          await this.loadBackendMindDataOrInitializeNewMind(this.vid, mindData);
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

      // console.log(`FBI --> mindData: `);
      // console.log(mindData);

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
