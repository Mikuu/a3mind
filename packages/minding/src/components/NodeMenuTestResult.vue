<template>
  <v-container  class="px-0">
    <v-select v-model="mindStore.nodeMenu.node.topic" label="Test result" :items="testResults" variant="outlined"></v-select>
    <v-text-field v-model="mindStore.nodeMenu.node.tags" label="Tags" variant="outlined"></v-text-field>
    <v-text-field v-model="mindStore.nodeMenu.node.hyperLink" label="Link" variant="outlined"></v-text-field>
    <v-textarea
      v-model="mindStore.nodeMenu.node.memo"
      label="Notes" variant="outlined" auto-grow max-rows="12" class="memo"></v-textarea>
  </v-container>
</template>

<script setup>
import { onMounted, computed, watch, ref } from 'vue';
import { useMindStore } from "@/store/mind";
import {getDefaultNodeStyle} from "@/utils/styleUtils";

const mindStore = useMindStore();

const testResults = ["Passed", "Failed", "Unknown"];

onMounted(() => {
  console.log(`FBI --> onMounted nodeMenuTest starting`);
});

const updateStyleAccordingToResult = testResult => {
  const defaultStyle = getDefaultNodeStyle();

  switch (testResult) {
    case "Passed":
      mindStore.mind.reshapeNode(mindStore.mind.currentNode,
        { style: {"background": "#93ff00", "color": "#0a910a", "padding-inline": "8px"} });
      break;
    case "Failed":
      mindStore.mind.reshapeNode(mindStore.mind.currentNode,
        { style: {"background": "#ff024391", "color": "#f9f5df", "padding-inline": "8px"} });
      break;
    case "Unknown":
      mindStore.mind.reshapeNode(mindStore.mind.currentNode,
        { style: {"background": "#5002ff6b", "color": "#f9f5df", "padding-inline": "8px"} });
      break;
    default:
      mindStore.mind.reshapeNode(mindStore.mind.currentNode,
        { style: {"background": defaultStyle.background, "color": defaultStyle.color, "padding-inline": "8px"} });
  }
};

watch(() => mindStore.nodeMenu.node.topic, (newTopic, oldTopic) => {
  if (!mindStore.mind.currentNode || typeof newTopic !== 'string') return
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { topic: newTopic.trim() });

  updateStyleAccordingToResult(newTopic.trim());
});

watch(() => mindStore.nodeMenu.node.tags, (newTags, oldTags) => {
  if (!mindStore.mind.currentNode || typeof newTags !== 'string') return
  const newTagsArray = newTags.split(",")
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { tags: newTagsArray.filter(tag => tag.trim()) })
});

watch(() => mindStore.nodeMenu.node.hyperLink, (newLink, oldLink) => {
  if (!mindStore.mind.currentNode || typeof newLink !== 'string') return
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { hyperLink: newLink })
});

watch(() => mindStore.nodeMenu.node.memo, (newMemo, oldMemo) => {
  mindStore.mind.currentNode.nodeObj.memo = newMemo
  mindStore.mind.bus.fire("operation", {
    name: "updateMemo",
    obj: mindStore.mind.currentNode.nodeObj
  })
});

</script>

<style>
</style>
