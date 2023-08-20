<template>
  <div
    class="navigation-island-floating-position navigation-island-rounded py-0 px-3"
  >
    <router-link to="/home" class="custom-router-link" active-class="custom-active-link">
      <v-btn icon="mdi-home" :style="buttonIconStyle" size="small"></v-btn>
    </router-link>
    <router-link :to="`/project/${viewStore.view?.pid}`" class="custom-router-link" active-class="custom-active-link">
      <v-btn icon="mdi-arrow-left" :style="buttonIconStyle" size="small"></v-btn>
    </router-link>
  </div>
</template>

<script setup>
import { useViewStore } from "@/store/view";
import {onMounted} from "vue";

const buttonIconStyle = "box-shadow: none; background-color: #2D3748 !important;";
const viewStore = useViewStore();
const props = defineProps(['vid']);

onMounted(() => {
  fetchView();
});

const fetchView = async () => {
  await viewStore.getView(props.vid);
};
</script>

<style>
.navigation-island-floating-position {
  position: fixed;
  top: 20px;
  left: 20px;
  color: #ffffff;
  background-color: #2D3748;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  //z-index: 9999;
  z-index: 999;
}
.navigation-island-rounded {
  border-radius: 8px;
}
</style>
