<template>
  <v-container class="px-0">
    <div class="d-flex justify-start align-start mt-2">
      <p class="mt-2 mr-2">Node type:</p>
      <v-radio-group v-model="mindStore.nodeMenu.node.nodeType" inline class="font-weight-light">
        <v-radio label="General" value="general" class="font-weight-light"></v-radio>
        <v-radio label="Scenario" value="scenario" class="font-weight-light"></v-radio>
        <v-radio label="Test" value="test" class="font-weight-light"></v-radio>
      </v-radio-group>
    </div>
    <v-text-field v-model="mindStore.nodeMenu.node.topic" label="Topic" variant="outlined"></v-text-field>
    <v-text-field v-model="mindStore.nodeMenu.node.tags" label="Tags" variant="outlined"></v-text-field>
    <v-text-field v-model="mindStore.nodeMenu.node.icons" label="Icons" variant="outlined"></v-text-field>
    <v-text-field v-model="mindStore.nodeMenu.node.hyperLink" label="Link" variant="outlined"></v-text-field>
    <v-textarea
      v-model="mindStore.nodeMenu.node.memo"
      label="Memo" variant="outlined" auto-grow max-rows="12" class="memo"></v-textarea>
  </v-container>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useMindStore } from "@/store/mind";
const mindStore = useMindStore();

onMounted(() => {
  // console.log(`FBI --> onMounted nodeMenuGeneral starting`);
  // console.log(`FBI --> menuGeneral > mind.currentNode`);
  // console.log(mindStore.mind.currentNode);
})

watch(() => mindStore.nodeMenu.node.nodeType, (newType, oldType) => {
  if (!mindStore.mind.currentNode) return
  mindStore.mind.reshapeNode(mindStore.mind.currentNode, { nodeType: newType })
});

watch(() => mindStore.nodeMenu.node.topic, (newTopic, oldTopic) => {
  if (!mindStore.mind.currentNode) return

  if (typeof newTopic === "string") {
    const topic = newTopic ? newTopic.trim() : "new node";
    mindStore.mind.currentNode.nodeObj.topic = topic
    mindStore.mind.reshapeNode(mindStore.mind.currentNode, { topic: topic })
  }
});

watch(() => mindStore.nodeMenu.node.tags, (newTags, oldTags) => {
  if (!mindStore.mind.currentNode) return

  if (typeof newTags === "string") {
    const newTagsArray = newTags.split(",")
    mindStore.mind.reshapeNode(mindStore.mind.currentNode, { tags: newTagsArray.filter(tag => tag.trim()) })
  }
});

watch(() => mindStore.nodeMenu.node.icons, (newIcons, oldIcons) => {
  if (!mindStore.mind.currentNode) return
  if (typeof newIcons === "string") {
    const newIconsArray = newIcons.split(",")
    mindStore.mind.reshapeNode(mindStore.mind.currentNode, { icons: newIconsArray.filter(icon => icon) })
  }
});

watch(() => mindStore.nodeMenu.node.hyperLink, (newLink, oldLink) => {
  if (!mindStore.mind.currentNode) return
  if (typeof newLink === "string") {
    mindStore.mind.reshapeNode(mindStore.mind.currentNode, { hyperLink: newLink })
  }
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
.memo {
  width: 360px;
}
</style>
