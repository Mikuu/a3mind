import { defineStore } from 'pinia'
import { keycloak } from "@/plugins/keycloak";
import * as ambClient from "@/clients/ambClient";

export const useNodeStore = defineStore('node', {
  state: () => ({
    node: null,
  }),

  getters: {},

  actions: {

  },
})
