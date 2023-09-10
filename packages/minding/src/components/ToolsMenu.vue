<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-tools" style="box-shadow: none; background-color: #2D3748 !important;" size="small" v-bind="props"></v-btn>
    </template>
    <v-list>
      <v-list-item link @click="isExportDialogOpen = true">
        <template v-slot:prepend>
          <v-icon icon="mdi-file-export-outline" color="primary"></v-icon>
        </template>
        <v-list-item-title>Export ...</v-list-item-title>
      </v-list-item>

      <v-list-item link @click="clearTestResults">
        <template v-slot:prepend>
          <v-icon icon="mdi-delete-sweep-outline" color="primary"></v-icon>
        </template>
        <v-list-item-title>Clear test results</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-dialog
    v-model="isExportDialogOpen"
    width="auto"
  >
    <v-card>
      <v-card-text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="isExportDialogOpen = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {defineProps, ref} from "vue";
import { useMindStore } from "@/store/mind";
import { useNodeStore } from "@/store/node";
import { useStatusStore } from "@/store/status";
import * as excelUtils from "@/utils/excelUtils";

const mindStore = useMindStore();
const nodeStore = useNodeStore();
const statusStore = useStatusStore();
const props = defineProps(['vid']);

const isExportDialogOpen = ref(false);

const openExportDialog = () => {
  excelUtils.createAndDownloadExcel(mindStore.mindDataSync.nodeData, mindStore.mindDataSync.nodeData.topic);
};

const clearTestResults = () => {
  const succeedHandler = () => {
    statusStore.requestSucceedHandler('Clear test results succeed')();
    mindStore.pullMindData();
  };
  nodeStore.clearResults(props.vid, succeedHandler(), statusStore.requestFailedHandler('Clear test results failed'));
};
</script>

<style>
</style>
