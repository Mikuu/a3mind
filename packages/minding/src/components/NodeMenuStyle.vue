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
    <v-select clearable label="Text decoration" :items="textDecoration" variant="outlined"></v-select>

  </v-container>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useMindStore } from "@/store/mind";
import { updateClassName } from "@/utils/commonUtils";

const mindStore = useMindStore();
// const fontSizes = ['unset', 'small', 'smaller', 'medium', 'large', 'larger', 'x-large', 'xx-large', 'xxx-large'];
const fontSizes = [10, 15, 24, 32];
const fontWeights = [
  'font-weight-black',
  'font-weight-bold',
  'font-weight-medium',
  'font-weight-regular',
  'font-weight-light',
  'font-weight-thin',
  'font-italic'
];
const textDecoration = ['none', 'underline', 'overline', 'line-through'];

onMounted(() => {
  console.log(`FBI --> onMounted nodeMenuStyle starting`);
})

watch(() => mindStore.nodeMenu.node.style.color, (newColor, oldColor) => {
  if (!mindStore.mind.currentNode) return
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { style: { color: newColor } });
});

watch(() => mindStore.nodeMenu.node.style.background, (newBackground, oldBackground) => {
  if (!mindStore.mind.currentNode) return
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { style: { background: newBackground } });
});

// watch change of font size
watch(() => mindStore.nodeMenu.node.style.fontSize, (newFontSize, oldFontSize) => {
  if (!mindStore.mind.currentNode) return
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { style: { fontSize: newFontSize } });
});

watch(() => mindStore.nodeMenu.node.style.fontWeight, (newFontWeight, oldFontWeight) => {
  if (!mindStore.mind.currentNode) return

  /**
   * mind-elixir-core cleared all className when unselect node. Need to figure out how to solve this to support adding className.
   * **/
  // update node to change the display, currentNode is html element.
  mindStore.mind.currentNode.className = updateClassName(mindStore.mind.currentNode.className, fontWeights, newFontWeight);

  // store into mind to enable re-select when next time click on the node before saving, consumed in selectNode listener.
  // mindStore.nodeMenu.node reference to node data in mind-elixir.
  mindStore.nodeMenu.node.a3ClassName = mindStore.mind.currentNode.className;

  // store into stare.nodeMenu, just for cache, because mind-elixir will hardcode className='' when unselect node, so this
  // cache can be consumed in unselectNode listener to keep the className.
  mindStore.nodeMenu.classNameCache = mindStore.mind.currentNode.className;

  console.log(`watching fontWeight`);
  console.log(mindStore.nodeMenu.node);
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
