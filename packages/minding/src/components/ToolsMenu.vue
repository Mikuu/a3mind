<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-tools" style="box-shadow: none; background-color: #2D3748 !important;" size="small" v-bind="props"></v-btn>
    </template>
    <v-list>
      <v-list-item link @click="openExportDialog">
        <template v-slot:prepend>
          <v-icon icon="mdi-file-export-outline" color="primary"></v-icon>
        </template>
        <v-list-item-title>Export ...</v-list-item-title>
      </v-list-item>

      <v-list-item link @click="clearTestResults">
        <template v-slot:prepend>
          <v-icon icon="mdi-delete-sweep-outline" color="primary"></v-icon>
        </template>
        <v-list-item-title>Clear test results</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { inject, ref, defineProps, computed } from "vue";

const openExportDialog = () => {
  console.log(`FBI --> open export dialog`);
};

const clearTestResults = () => {
  console.log(`clear test results`);
};
</script>

<style>
</style>
