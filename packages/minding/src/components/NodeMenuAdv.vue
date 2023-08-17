<template>
  <div
    v-if="mindStore.nodeMenu.display"
    class="floating-form"
    :style="{ top: posY + 'px', left: posX + 'px' }"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <v-tabs v-model="tab">
      <v-tab v-show="displayGeneralAndStyle" value="general">General</v-tab>
      <v-tab v-show="displayGeneralAndStyle" value="style">Style</v-tab>
      <v-tab v-show="displayTest" value="test">Test</v-tab>
      <v-tab v-show="displayTestResult" value="test-result">Test Result</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item value="general" class="font-weight-light"><NodeMenuGeneral/></v-window-item>
      <v-window-item value="style" class="font-weight-light"><NodeMenuStyle/></v-window-item>
      <v-window-item value="test" class="font-weight-light"><NodeMenuTest/></v-window-item>
      <v-window-item value="test-result" class="font-weight-light"><NodeMenuTestResult/></v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useMindStore } from "@/store/mind";
import NodeMenuGeneral from "@/components/NodeMenuGeneral.vue";
import NodeMenuStyle from "@/components/NodeMenuStyle.vue";
import NodeMenuTest from "@/components/NodeMenuTest";
import NodeMenuTestResult from "@/components/NodeMenuTestResult";

const mindStore = useMindStore();

const tab = ref("general");
const displayGeneralAndStyle = computed(() =>  ['general', 'scenario', 'test'].includes(mindStore.nodeMenu.node.nodeType));
const displayTest = computed(() => mindStore.nodeMenu.node.nodeType === 'test');
const displayTestResult = computed(() => ['at-result', 'mt-result'].includes(mindStore.nodeMenu.node.nodeType));

watch(() => mindStore.nodeMenu.currentNodeType, (newType, oldType) => {
  if (['general', 'scenario'].includes(newType)) {
    if (oldType === 'test') tab.value = "general";
    if (['at-result', 'mt-result'].includes(oldType)) tab.value = "general";
    if (oldType === null) tab.value = "general";

  } else if (newType === 'test') {
    if (['at-result', 'mt-result', null].includes(oldType)) tab.value = "general";

  } else if (['at-result', 'mt-result'].includes(newType)) {
    tab.value = "test-result";

  }
});

const posX = ref(0);
const posY = ref(0);
let isDragging = ref(false);
let dragStartX = ref(0);
let dragStartY = ref(0);

onMounted(async () => {
  console.log(`FBI --> onMounted nodeMenuAdv starting`);
});

function startDrag(event) {
  isDragging.value = true;
  dragStartX.value = event.clientX || event.touches[0].clientX;
  dragStartY.value = event.clientY || event.touches[0].clientY;

  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('touchmove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
}

function handleDrag(event) {
  if (!isDragging.value) return;

  const clientX = event.clientX || event.touches[0].clientX;
  const clientY = event.clientY || event.touches[0].clientY;

  posX.value += clientX - dragStartX.value;
  posY.value += clientY - dragStartY.value;

  dragStartX.value = clientX;
  dragStartY.value = clientY;
}

function stopDrag() {
  isDragging.value = false;

  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('touchmove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
}
</script>

<style>
.floating-form {
  position: fixed;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  //z-index: 9999;
  z-index: 1000;
}
</style>
