<template>
  <div
    class="main-island-floating-position main-island-rounded py-0 px-3"
  >
    <v-btn icon="mdi-heart" :style="buttonIconStyle" size="small" @click="checkMindData"></v-btn>
    <v-btn icon="mdi-content-save-outline" :style="buttonIconStyle" size="small" @click="saveMindData"></v-btn>
    <v-btn icon="mdi-cloud-download-outline" :style="buttonIconStyle" size="small" @click="pullMindData"></v-btn>
    <v-btn icon="mdi-tools" :style="buttonIconStyle" size="small"></v-btn>
    <v-btn icon="mdi-cog" :style="buttonIconStyle" size="small"></v-btn>
    <AccountMenu usedIn="island"/>
  </div>
</template>

<script setup>
import { onMounted, ref, inject, watch, computed } from 'vue';

const buttonIconStyle = "box-shadow: none; background-color: #2D3748 !important;";

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
  // mindStore.checkMindData();
  // console.log(`keycloak.tokenParsed:`);
  // const tokenParsed = keycloak.value.idTokenParsed;
  // console.log(JSON.parse(JSON.stringify(tokenParsed)));
  // console.log(`iat: ${new Date(tokenParsed.iat * 1000).toISOString()}, exp: ${new Date(tokenParsed.exp * 1000).toISOString()}`)
  // console.log(`keycloak.subject: ${keycloak.value.subject}`);
  // console.log(`keycloak.idTokenParsed:`);
  // console.log(JSON.parse(JSON.stringify(keycloak.value.idTokenParsed)));
};

const saveMindData = () => {
  // mindStore.saveMindData(
  //   () => {
  //     saveDataSucceed.value = true;
  //     saveDataMessage.value = 'Save mind data succeed';
  //     displaySnackbar.value = true;
  //     setTimeout(() => { displaySnackbar.value = false }, 2000);
  //   },
  //   () => {
  //     saveDataSucceed.value = false;
  //     saveDataMessage.value = 'Save mind data failed';
  //     displaySnackbar.value = true;
  //     setTimeout(() => { displaySnackbar.value = false }, 3000);
  //   },
  // );
};

const pullMindData = () => {
  // mindStore.pullMindData(
  //   () => {
  //     saveDataSucceed.value = true;
  //     saveDataMessage.value = 'Pull mind data succeed';
  //     displaySnackbar.value = true;
  //     setTimeout(() => { displaySnackbar.value = false }, 2000);
  //   },
  //   () => {
  //     saveDataSucceed.value = false;
  //     saveDataMessage.value = 'Pull mind data failed';
  //     displaySnackbar.value = true;
  //     setTimeout(() => { displaySnackbar.value = false }, 3000);
  //   });
};

</script>

<style>
.main-island-floating-position {
  position: fixed;
  top: 20px;
  right: 20px;
  color: #ffffff;
  background-color: #2D3748;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  //z-index: 9999;
  z-index: 999;
}
.main-island-rounded {
  border-radius: 8px;
}
</style>
