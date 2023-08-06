<template>
  <v-container>
    <div class="d-flex justify-start mb-4">
      <v-btn variant="text" rounded="xs" append-icon="mdi-palette" class="pl-0 text-capitalize">
        Font color
        <template v-slot:append>
          <v-icon color="warning"></v-icon>
        </template>
      </v-btn>

      <v-btn variant="text" rounded="xs" append-icon="mdi-palette" class="ml-2 text-capitalize">
        Background color
        <template v-slot:append>
          <v-icon color="warning"></v-icon>
        </template>
      </v-btn>
    </div>

    <v-select clearable label="Font size" :items="fontSizes" variant="outlined"></v-select>
    <v-select clearable label="Font weight" :items="fontWeights" variant="outlined"></v-select>
    <v-select clearable label="Text decoration" :items="textDecoration" variant="outlined"></v-select>

  </v-container>
</template>

<script setup>
import { ref } from 'vue';

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
</script>

<style>

</style>
