import { defineStore } from 'pinia'
import { keycloak } from "@/plugins/keycloak";
import * as ambClient from "@/clients/ambClient";

export const useNodeMenuStore = defineStore('nodeMenu', {
  state: () => ({
    node: null,
    display: false
  }),

  getters: {},

  actions: {
    retrieveViews(pid, succeedHandler=null, failedHandler=null) {
      ambClient.retrieveViews(keycloak.token, pid)
        .then(response => {
          this.views = response.views;
          if (succeedHandler) { succeedHandler(); }
        })
        .catch(reason => {
          console.error(reason);
          if (failedHandler) { failedHandler(reason?.message ? `: ${reason?.message}` : ""); }
        });
    },

  },
})
