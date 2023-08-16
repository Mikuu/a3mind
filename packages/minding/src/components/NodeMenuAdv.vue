<template>
  <div
    v-if="mindStore.nodeMenu.display"
    class="floating-form"
    :style="{ top: posY + 'px', left: posX + 'px' }"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <v-tabs v-model="tab">
      <v-tab v-if="displayGeneralAndStyle" value="general">General</v-tab>
      <v-tab v-if="displayGeneralAndStyle" value="style">Style</v-tab>
      <v-tab v-if="displayTest" value="test">Test</v-tab>
      <v-tab v-if="displayTestResult" value="test-result">Test Result</v-tab>
    </v-tabs>

    <v-window v-model="tab">
<!--      <v-window-item v-if="displayGeneralAndStyle" value="general" class="font-weight-light"><NodeMenuGeneral/></v-window-item>-->
<!--      <v-window-item v-if="displayGeneralAndStyle" value="style" class="font-weight-light"><NodeMenuStyle/></v-window-item>-->
<!--      <v-window-item v-if="displayTest" value="test" class="font-weight-light"><NodeMenuTest/></v-window-item>-->
<!--      <v-window-item v-if="displayTestResult" value="test-result" class="font-weight-light"><NodeMenuTestResult/></v-window-item>-->
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

// const displayGeneralAndStyle = ref(true);
// const displayTest = ref(true);
// const displayTestResult = ref(true);

watch(() => mindStore.nodeMenu.currentNodeType, (newType, oldType) => {
  console.log(`nodeType changed from ${oldType} to ${newType}`);

  // 'general' & 'scenario' -> 'test';
  if (['general', 'scenario'].includes(oldType) && newType === 'test') {
    // no special handling.
  }

  // 'general' & 'scenario' -> 'test-result';
  if (['general', 'scenario'].includes(oldType) && ['at-result', 'mt-result'].includes(newType)) {
    tab.value = "test-result";
    console.log(`FBI --> !!!!! tab.value should be ${tab.value}`);
  }

  // 'test' -> 'general' & 'scenario';
  if (oldType === 'test' && ['general', 'scenario'].includes(newType)) {
    if (tab.value === "test") {
      tab.value = "general";
    }
  }

  // 'test' -> 'test-result';
  if (oldType === 'test' && ['at-result', 'mt-result'].includes(newType)) {
    tab.value = "test-result";
  }

  // 'test-result' -> 'general' & 'scenario';
  if (['at-result', 'mt-result'].includes(oldType) && ['general', 'scenario'].includes(newType)) {
    if (tab.value === "test-result") {
      tab.value = "general";
    }
  }

  // 'test-result' -> 'test';
  if (['at-result', 'mt-result'].includes(oldType) && newType === 'test') {
    if (tab.value === "test-result") {
      tab.value = "general";
      console.log(`FBI --> !!!!! tab.value should be ${tab.value}`);
    } else {
      console.log(`FBI --> ??? tab.value is actual ${tab.value}`);
    }
  }

});

const displayGeneralAndStyle = computed(() =>  ['general', 'scenario', 'test'].includes(mindStore.nodeMenu.node.nodeType));
const displayTest = computed(() => mindStore.nodeMenu.node.nodeType === 'test');
const displayTestResult = computed(() => ['at-result', 'mt-result'].includes(mindStore.nodeMenu.node.nodeType));
//
// // switch tab to general when node type is not test.
// watch(() => mindStore.nodeMenu.node?.nodeType, (newType, oldType) => {
//   if (tab.value === "test" && newType !== "test") {
//     tab.value = "general";
//   }
//
//   // 'general' & 'scenario' -> 'test';
//   // no special handling.
//
//   // 'general' & 'scenario' -> 'test-result';
//   if (['general', 'scenario'].includes(oldType) && ['at-result', 'mt-result'].includes(newType)) {
//     console.log(`FBI --> switch tab from ${oldType} to ${newType}`);
//     tab.value = "test-result";
//   }
//
//   // 'test' -> 'general' & 'scenario';
//   // 'test' -> 'test-result';
//   // 'test-result' -> 'general' & 'scenario';
//   // 'test-result' -> 'test';
//
// });


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
