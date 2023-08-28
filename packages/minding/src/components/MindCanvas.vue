<template>
  <v-main>
    <v-container class="pa-0" fluid>
      <div id="mind-map"></div>
    </v-container>
  </v-main>
  <NodeMenuAdv/>
  <NavigationIsland :vid="props.vid"/>
  <MainIsland :vid="props.vid"/>
</template>

<script setup>
import { onMounted } from "vue";
import { useMindStore } from "@/store/mind";
import NodeMenuAdv from "@/components/NodeMenuAdv.vue";
import NavigationIsland from "@/components/NavigationIsland.vue";
import MainIsland from "@/components/MainIsland.vue";
import '@mind-elixir/node-menu/dist/style.css'

const props = defineProps(['vid']);

onMounted(async () => {
  const mindStore = useMindStore();
  await mindStore.chargeMetaData(props.vid);

  mindStore.initializeMind('#mind-map');
  await mindStore.pullMindData();

  mindStore.setupAutoSyncMindDataToStorage();
});

</script>

<style>
#mind-map {
  width: 100vw;
  height: 100vh;
  box-sizing: content-box;
}
.map-container .mind-elixir-toolbar.lt {
  top: unset;
  bottom: 20px;
}

</style>
