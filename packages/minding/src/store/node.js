import { defineStore } from 'pinia'
import { keycloak } from "@/plugins/keycloak";
import * as ambClient from "@/clients/ambClient";

export const useNodeStore = defineStore('node', {
  state: () => ({
    node: null,
  }),

  getters: {},

  actions: {
    clearResults(vid, succeedHandler=null, failedHandler=null) {
      ambClient.clearResults(keycloak.token, vid)
        .then(response => {
          if (succeedHandler) { succeedHandler(); }
        })
        .catch(reason => {
          console.error(reason);
          if (failedHandler) { failedHandler(); }
        });
    },

  },
})
