<template>
  <v-container  class="px-0">
    <div class="d-flex justify-start mt-3 mb-5">
      <div class="d-flex align-center">
        <p class="font-weight-light">Font color</p>
        <v-menu location="end" :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" elevation="0" icon="mdi-palette-outline" class="ml-2 palette"
                   :color="mindStore.nodeMenu.node.style.color"></v-btn>
          </template>
          <v-color-picker v-model="mindStore.nodeMenu.node.style.color"
                          elevation="2" class="ma-2" show-swatches swatches-max-height="240px"></v-color-picker>
        </v-menu>
      </div>

      <div class="d-flex align-center ml-8">
        <p class="font-weight-light">Background color</p>
        <v-menu location="end" :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" elevation="0" icon="mdi-palette-outline" class="ml-2 palette"
                   :color="mindStore.nodeMenu.node.style.background"></v-btn>
          </template>
          <v-color-picker v-model="mindStore.nodeMenu.node.style.background"
                          elevation="2" class="ma-2" show-swatches swatches-max-height="240px"></v-color-picker>
        </v-menu>
      </div>
    </div>

    <v-select clearable v-model="mindStore.nodeMenu.node.style.fontSize" label="Font size" :items="fontSizes" variant="outlined"></v-select>
    <v-select clearable v-model="mindStore.nodeMenu.node.style.fontWeight" label="Font weight" :items="fontWeights" variant="outlined"></v-select>
    <v-select clearable v-model="mindStore.nodeMenu.node.style.textDecoration" label="Text decoration" :items="textDecorations" variant="outlined"></v-select>

  </v-container>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useMindStore } from "@/store/mind";
import { checkAndAppendOperationId } from "@/utils/commonUtils";
import { fontSizes, fontWeights, textDecorations, setStyleProperty } from "@/utils/styleUtils";

const mindStore = useMindStore();

onMounted(() => {
  console.log(`FBI --> onMounted nodeMenuStyle starting`);
})

watch(() => mindStore.nodeMenu.node.style.color, (newColor, oldColor) => {
  if (!mindStore.mind.currentNode) return
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { style: { color: newColor } });

  checkAndAppendOperationId(mindStore.mindOperationStorage.updatedNodesIds, mindStore.mind.currentNode.id);
});

watch(() => mindStore.nodeMenu.node.style.background, (newBackground, oldBackground) => {
  if (!mindStore.mind.currentNode) return
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { style: { background: newBackground } });

  checkAndAppendOperationId(mindStore.mindOperationStorage.updatedNodesIds, mindStore.mind.currentNode.id);
});

// watch change of font size
watch(() => mindStore.nodeMenu.node.style.fontSize, (newFontSize, oldFontSize) => {
  if (!mindStore.mind.currentNode) return
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { style: { fontSize: newFontSize } });

  checkAndAppendOperationId(mindStore.mindOperationStorage.updatedNodesIds, mindStore.mind.currentNode.id);
});

watch(() => mindStore.nodeMenu.node.style.fontWeight, (newFontWeight, oldFontWeight) => {
  if (!mindStore.mind.currentNode) return
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { style: { fontWeight: newFontWeight } });

  checkAndAppendOperationId(mindStore.mindOperationStorage.updatedNodesIds, mindStore.mind.currentNode.id);
});

watch(() => mindStore.nodeMenu.node.style.textDecoration, (newTextDecoration, oldTextDecoration) => {
  if (!mindStore.mind.currentNode) return
  mindStore.mind.currentNode.style.cssText = setStyleProperty(
    mindStore.mind.currentNode.style.cssText, "text-decoration", newTextDecoration);
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { style: { textDecoration: newTextDecoration } });

  checkAndAppendOperationId(mindStore.mindOperationStorage.updatedNodesIds, mindStore.mind.currentNode.id);
});


</script>

<style>
.palette {
  color: #d7d4d4;
  font-size: x-small;
  height: 24px !important;
  width: 24px !important;
}

</style>
