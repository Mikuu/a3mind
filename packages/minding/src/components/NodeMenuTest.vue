<template>
  <v-container  class="px-0">
    <v-text-field v-model="mindStore.nodeMenu.node.testTitle" label="Test title" variant="outlined" class="mt-3"></v-text-field>
    <v-textarea
      v-model="mindStore.nodeMenu.node.testDescription"
      label="Test description"
      variant="outlined"
      auto-grow
      max-rows="18"
      class="description"
    ></v-textarea>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { useMindStore } from "@/store/mind";

const mindStore = useMindStore();

onMounted(() => {
  console.log(`FBI --> onMounted nodeMenuTest starting`);
})
</script>

<style>
.description {
  width: 520px;
}
</style>
