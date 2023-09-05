<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-tools" style="box-shadow: none; background-color: #2D3748 !important;" size="small" v-bind="props"></v-btn>
    </template>
    <v-list>
      <v-list-item link @click="openExportDialog">
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
</template>

<script setup>
import { defineProps } from "vue";
import { useMindStore } from "@/store/mind";
import { useNodeStore } from "@/store/node";
import { useStatusStore } from "@/store/status";
import * as excelUtils from "@/utils/excelUtils";
import XLSX from "xlsx";

const mindStore = useMindStore();
const nodeStore = useNodeStore();
const statusStore = useStatusStore();
const props = defineProps(['vid']);

const openExportDialog = () => {
  console.log(`FBI --> open export dialog`);
  // const excelData = excelUtils.mindDataToExcelDataTestNode(mindStore.mindDataSync.nodeData);
  const { scenarioColumnCount, excelData } = excelUtils.mindDataToExcelDataAutoFill(mindStore.mindDataSync.nodeData);

  console.log(mindStore.mindDataSync.nodeData);
  console.log(excelData);

  const filename = excelUtils.excelFilename(mindStore.mindDataSync.nodeData.topic);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  const mergeRange = { s: { r: 0, c: 0 }, e: { r: 0, c: scenarioColumnCount-1 } };
  ws['!merges'] = [mergeRange];

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, filename);
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
