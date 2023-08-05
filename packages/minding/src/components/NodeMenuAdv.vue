<template>
  <div
    v-if="mindStore.nodeMenu.display"
    class="floating-form"
    :style="{ top: posY + 'px', left: posX + 'px' }"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <v-container v-if="mindStore.nodeMenu.display">
      <v-row>
        <!-- Add your input elements here, for example: -->
        <v-col cols="12">
          <v-radio-group v-model="selectedOption">
            <v-radio label="Option 1" value="option1"></v-radio>
            <v-radio label="Option 2" value="option2"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="inputField" label="Input Field"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea v-model="inputBox" label="Input Box"></v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMindStore } from "@/store/mind";

const mindStore = useMindStore();

const show = ref(true);
const selectedOption = ref('');
const inputField = ref('');
const inputBox = ref('');
const posX = ref(0);
const posY = ref(0);
let isDragging = ref(false);
let dragStartX = ref(0);
let dragStartY = ref(0);

function toggleShow() {
  show.value = !show.value;
}

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
  z-index: 9999;
}
</style>
