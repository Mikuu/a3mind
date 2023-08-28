<template>
  <v-app-bar :elevation="1">
    <v-app-bar-title class="flex-none">Autominding</v-app-bar-title>
    <v-breadcrumbs class="pl-12 text-body-2" :items="props.breadcrumbs" divider="/"></v-breadcrumbs>
    <template v-slot:append>
      <v-btn icon="mdi-heart" @click="checkMindData"></v-btn>
      <v-btn icon="mdi-content-save-outline" @click="saveMindData"></v-btn>
      <v-btn icon="mdi-cloud-download-outline" @click="pullMindData"></v-btn>
      <AccountMenu usedIn="menu"/>
    </template>
  </v-app-bar>
</template>

<script setup>
  import { ref, inject } from 'vue';
  import { useMindStore } from "@/store/mind";
  import { useStatusStore } from "@/store/status";
  import AccountMenu from "./AccountMenu.vue";

  const keycloak = ref(inject('keycloak'));
  const mindStore = useMindStore();
  const statusStore = useStatusStore();

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
      statusStore.requestSucceedHandler("Save mind data succeed"),
      statusStore.requestFailedHandler("Save mind data failed")
    );
  };

  const pullMindData = () => {
    mindStore.pullMindData(
      statusStore.requestSucceedHandler("Pull mind data succeed"),
      statusStore.requestFailedHandler("Pull mind data failed")
    );
  };

</script>

<style>
.flex-none {
  flex: none;
}
</style>
