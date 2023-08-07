<template>
  <v-container fluid>
    <v-text-field v-model="testTitle" label="Test title" variant="outlined" class="mt-3"></v-text-field>
    <v-textarea
      v-model="testDescription"
      label="Test description"
      variant="outlined"
      auto-grow
      max-rows="18"
      style="width: 520px"
    ></v-textarea>
  </v-container>
</template>

<script setup>
import {onMounted, ref} from 'vue';
const testTitle = ref("");
const testDescription = ref("");

onMounted(() => {
  console.log(`FBI --> onMounted nodeMenuTest starting`);
})
</script>

<style>
</style>
