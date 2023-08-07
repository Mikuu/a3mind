<template>
  <v-container>
    <div class="d-flex justify-start align-start mt-2">
      <p class="mt-2 mr-2">Node type:</p>
      <v-radio-group v-model="mindStore.nodeMenu.node.nodeType" inline class="font-weight-light">
        <v-radio label="General" value="general" class="font-weight-light"></v-radio>
        <v-radio label="Scenario" value="scenario" class="font-weight-light"></v-radio>
        <v-radio label="Test" value="test" class="font-weight-light"></v-radio>
      </v-radio-group>
    </div>

    <v-text-field v-model="tag" label="tag" variant="outlined"></v-text-field>
    <v-text-field v-model="icon" label="icon" variant="outlined"></v-text-field>
    <v-text-field v-model="link" label="link" variant="outlined"></v-text-field>
    <v-textarea v-model="memo" label="memo" variant="outlined" auto-grow max-rows="12" style="width: 360px"></v-textarea>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useMindStore } from "@/store/mind";

const mindStore = useMindStore();

const nodeType = ref('general');
const tag = ref('');
const icon = ref('');
const link = ref('');
const memo = ref('');

onMounted(() => {
  console.log(`FBI --> onMounted nodeMenuGeneral starting`);
})
</script>

<style>

</style>
