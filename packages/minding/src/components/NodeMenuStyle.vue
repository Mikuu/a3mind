<template>
  <v-container>
    <div class="d-flex justify-start mt-3 mb-5">
      <div class="d-flex align-center">
        <p class="font-weight-light">Font color</p>
        <v-menu location="end" :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" elevation="0" icon="mdi-palette-outline" class="ml-2 palette" :color="fontColor"></v-btn>
          </template>
          <v-color-picker v-model="fontColor" elevation="2" class="ma-2" show-swatches swatches-max-height="240px"></v-color-picker>
        </v-menu>
      </div>

      <div class="d-flex align-center ml-8">
        <p class="font-weight-light">Background color</p>
        <v-menu location="end" :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" elevation="0" icon="mdi-palette-outline" class="ml-2 palette" :color="backgroundColor"></v-btn>
          </template>
          <v-color-picker v-model="backgroundColor" elevation="2" class="ma-2" show-swatches swatches-max-height="240px"></v-color-picker>
        </v-menu>
      </div>
    </div>

    <v-select clearable label="Font size" :items="fontSizes" variant="outlined"></v-select>
    <v-select clearable label="Font weight" :items="fontWeights" variant="outlined"></v-select>
    <v-select clearable label="Text decoration" :items="textDecoration" variant="outlined"></v-select>

  </v-container>
</template>

<script setup>
import {onMounted, ref} from 'vue';
const fontSizes = ['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming'];
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

const fontColor = ref('#777777');
const backgroundColor = ref('transparent');

onMounted(() => {
  console.log(`FBI --> onMounted nodeMenuStyle starting`);
})
</script>

<style>
.palette {
  color: #d7d4d4;
  font-size: x-small;
  height: 24px !important;
  width: 24px !important;
}

</style>
