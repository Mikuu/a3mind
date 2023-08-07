<template>
  <div
    v-if="mindStore.nodeMenu.display"
    class="floating-form"
    :style="{ top: posY + 'px', left: posX + 'px' }"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <v-tabs v-model="nodeType">
      <v-tab value="general">General</v-tab>
      <v-tab value="style">Style</v-tab>
      <v-tab value="test">Test</v-tab>
    </v-tabs>

    <v-window v-model="nodeType">
      <v-window-item value="general" class="font-weight-light"><NodeMenuGeneral/></v-window-item>
      <v-window-item value="style" class="font-weight-light"><NodeMenuStyle/></v-window-item>
      <v-window-item value="test" class="font-weight-light"><NodeMenuTest/></v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMindStore } from "@/store/mind";
import NodeMenuGeneral from "@/components/NodeMenuGeneral.vue";
import NodeMenuStyle from "@/components/NodeMenuStyle.vue";
import NodeMenuTest from "@/components/NodeMenuTest";

const mindStore = useMindStore();

const nodeType = ref(null);

const posX = ref(0);
const posY = ref(0);
let isDragging = ref(false);
let dragStartX = ref(0);
let dragStartY = ref(0);

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
