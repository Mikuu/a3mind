import { defineStore } from 'pinia'

export const useStatusStore = defineStore('status', {
  state: () => ({
    networkRequestShow: false,
    networkRequestMessage: '',
    networkRequestSuccess: false
  }),

  getters: {},

  actions: {
    requestSucceedHandler(message="Request succeed", timeout=2000) {
      return () => {
        this.networkRequestShow = true;
        this.networkRequestSuccess = true;
        this.networkRequestMessage = message;
        setTimeout(() => { this.networkRequestShow = false }, timeout);
      }
    },

    requestFailedHandler(message="Request failed", timeout=3000) {
      return () => {
        this.networkRequestShow = true;
        this.networkRequestSuccess = false;
        this.networkRequestMessage = message;
        setTimeout(() => { this.networkRequestShow = false }, timeout);
      }
    },

  },
})
