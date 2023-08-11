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
    <v-select clearable label="Font weight" :items="fontWeights" variant="outlined"></v-select>
    <v-select clearable label="Text decoration" :items="textDecoration" variant="outlined"></v-select>

  </v-container>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useMindStore } from "@/store/mind";

const mindStore = useMindStore();
const fontSizes = ['unset', 'small', 'smaller', 'medium', 'large', 'larger', 'x-large', 'xx-large', 'xxx-large'];
const fontWeights = [
  'Black text',
  'Bold text',
  'Medium weight text',
  'Normal weight text',
  'Light weight text',
  'Thin weight text',
  'Italic text'
];
const textDecoration = ['none', 'underline', 'overline', 'line-through'];

// const fontColor = ref('#777777');
const backgroundColor = ref('transparent');

onMounted(() => {
  console.log(`FBI --> onMounted nodeMenuStyle starting`);
})

watch(() => mindStore.nodeMenu.node.style.color, (newColor, oldColor) => {
  if (!mindStore.mind.currentNode) return
  // const currentNodeStyle = { ...mindStore.mind.currentNode.style };
  // currentNodeStyle.color = newColor;
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { style: { color: newColor } });
});

watch(() => mindStore.nodeMenu.node.style.background, (newBackground, oldBackground) => {
  if (!mindStore.mind.currentNode) return
  // const currentNodeStyle = { ...mindStore.mind.currentNode.style };
  // currentNodeStyle.background = newBackground;
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { style: { background: newBackground } });
});

// watch change of font size
watch(() => mindStore.nodeMenu.node.style.fontSize, (newFontSize, oldFontSize) => {
  if (!mindStore.mind.currentNode) return
  // const currentNodeStyle = { ...mindStore.mind.currentNode.style };
  // currentNodeStyle.fontSize = newFontSize;
  // mindStore.mind.reshapeNode(mindStore.mind.currentNode, { style: { fontSize: newFontSize } });


  console.log(`FBI --> nodeMenuStyle watch change currentNode`);
  console.log(mindStore.mind.currentNode);

  // const currentNodeClass = mindStore.mind.currentNode.className;
  mindStore.mind.currentNode.className += ' font-weight-black';
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { styleClass: 'font-weight-black' });

  /**
   * mind-elixir-core cleared all className when unselect node. Need to figure out how to solve this to support adding className.
   * **/

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
