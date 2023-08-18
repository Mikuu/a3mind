<template>
  <div
    class="floating-position"
  >
    <v-btn icon="mdi-heart" class="island-icon" color="success" @click="checkMindData"></v-btn>
    <v-btn icon="mdi-content-save-outline" color="white" @click="saveMindData"></v-btn>
    <v-btn icon="mdi-cloud-download-outline" color="white" @click="pullMindData"></v-btn>
    <AccountMenu/>
  </div>
</template>

<script setup>
import { onMounted, ref, inject, watch, computed } from 'vue';
import NodeMenuGeneral from "@/components/NodeMenuGeneral.vue";
import NodeMenuStyle from "@/components/NodeMenuStyle.vue";
import NodeMenuTest from "@/components/NodeMenuTest";
import NodeMenuTestResult from "@/components/NodeMenuTestResult";



onMounted(async () => {
  console.log(`FBI --> onMounted nodeMenuAdv starting`);
});

import { useMindStore } from "@/store/mind";
import NetworkSnackbar from "./NetworkSnackbar.vue";
import AccountMenu from "./AccountMenu.vue";

const saveDataMessage = ref('');
const saveDataSucceed = ref(true);
const displaySnackbar = ref(false);
const keycloak = ref(inject('keycloak'));
const mindStore = useMindStore();

const props = defineProps(['breadcrumbs']);

const checkMindData = () => {
  mindStore.checkMindData();
  console.log(`keycloak.tokenParsed:`);
  const tokenParsed = keycloak.value.idTokenParsed;
  console.log(JSON.parse(JSON.stringify(tokenParsed)));
  console.log(`iat: ${new Date(tokenParsed.iat * 1000).toISOString()}, exp: ${new Date(tokenParsed.exp * 1000).toISOString()}`)
  console.log(`keycloak.subject: ${keycloak.value.subject}`);
  console.log(`keycloak.idTokenParsed:`);
  console.log(JSON.parse(JSON.stringify(keycloak.value.idTokenParsed)));
};

const saveMindData = () => {
  mindStore.saveMindData(
    () => {
      saveDataSucceed.value = true;
      saveDataMessage.value = 'Save mind data succeed';
      displaySnackbar.value = true;
      setTimeout(() => { displaySnackbar.value = false }, 2000);
    },
    () => {
      saveDataSucceed.value = false;
      saveDataMessage.value = 'Save mind data failed';
      displaySnackbar.value = true;
      setTimeout(() => { displaySnackbar.value = false }, 3000);
    },
  );
};

const pullMindData = () => {
  mindStore.pullMindData(
    () => {
      saveDataSucceed.value = true;
      saveDataMessage.value = 'Pull mind data succeed';
      displaySnackbar.value = true;
      setTimeout(() => { displaySnackbar.value = false }, 2000);
    },
    () => {
      saveDataSucceed.value = false;
      saveDataMessage.value = 'Pull mind data failed';
      displaySnackbar.value = true;
      setTimeout(() => { displaySnackbar.value = false }, 3000);
    });
};

</script>

<style>

// this class can change mind-elixir's icon color
//.icon {
  //color: #ffffff;
  //color: #2D3748 !important;
  //background-color: #2D3748 !important;
//}

.island-icon {
//color: #ffffff;
//color: #2D3748 !important;
//background-color: #2D3748 !important;
}

.floating-position {
  position: fixed;
  top: 120px;
  right: 40px;
  color: #ffffff;
  background-color: #2D3748;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  //z-index: 9999;
  z-index: 999;
}
</style>
