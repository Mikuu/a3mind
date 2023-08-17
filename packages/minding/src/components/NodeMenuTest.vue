<template>
  <v-container  class="px-0">
    <div class="d-flex pt-1">
      <p class="pr-2 pb-2">Test ID:</p>
      <p>{{ idToTestId(mindStore.nodeMenu.node.id) }}</p>
    </div>
    <v-text-field v-model="mindStore.nodeMenu.node.topic" label="Test title" variant="outlined" class="mt-3"></v-text-field>
    <v-textarea
      v-model="mindStore.nodeMenu.node.testDescription"
      label="Test description"
      variant="outlined"
      auto-grow
      max-rows="18"
      class="description font-weight-light"
    ></v-textarea>
  </v-container>
</template>

<script setup>
import { onMounted, computed, watch, ref } from 'vue';
import { useMindStore } from "@/store/mind";
import { idToTestId } from "@/utils/commonUtils";

const mindStore = useMindStore();

onMounted(() => {
  console.log(`FBI --> onMounted nodeMenuTest starting`);
});

watch(() => mindStore.nodeMenu.node.topic, (newTopic, oldTopic) => {
  if (!mindStore.mind.currentNode) return
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { testTitle: newTopic.trim() });
});

watch(() => mindStore.nodeMenu.node.testDescription, (newDescription, oldDescription) => {
  if (!mindStore.mind.currentNode) return
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { testDescription: newDescription.trim() });
});

</script>

<style>
.description {
  width: 520px;
}
.description textarea {
  font-size: small;
}
</style>
