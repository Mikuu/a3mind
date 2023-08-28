<template>
  <div
    class="main-island-floating-position main-island-rounded py-0 px-3"
  >
    <v-btn icon="mdi-heart" :style="buttonIconStyle" size="small" @click="checkMindData"></v-btn>
    <v-btn icon="mdi-content-save-outline" :style="buttonIconStyle" size="small" @click="saveMindData"></v-btn>
    <v-btn icon="mdi-cloud-download-outline" :style="buttonIconStyle" size="small" @click="pullMindData"></v-btn>
    <ToolsMenu :vid="props.vid"/>
    <v-btn icon="mdi-cog" :style="buttonIconStyle" size="small"></v-btn>
    <AccountMenu usedIn="island"/>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useMindStore } from "@/store/mind";
import { useStatusStore } from "@/store/status";
import AccountMenu from "./AccountMenu.vue";
import ToolsMenu from "@/components/ToolsMenu.vue";

const mindStore = useMindStore();
const statusStore = useStatusStore();

const props = defineProps(['vid']);
const buttonIconStyle = "box-shadow: none; background-color: #2D3748 !important;";

onMounted(async () => {
  console.log(`FBI --> onMounted nodeMenuAdv starting`);
});

const checkMindData = () => {
};

const saveMindData = () => {
  mindStore.saveMindData(
    statusStore.requestSucceedHandler('Save mind data succeed'),
    statusStore.requestFailedHandler('Save mind data failed')
  );
};

const pullMindData = () => {
  mindStore.pullMindData(
    statusStore.requestSucceedHandler('Pull mind data succeed'),
    statusStore.requestFailedHandler('Pull mind data failed')
  );
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
