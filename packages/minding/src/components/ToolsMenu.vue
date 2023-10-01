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

  <v-dialog v-model="isExportDialogOpen" class="export-dialog">
    <v-card :loading="exportLoading">
      <v-card-item>

        <v-radio-group v-model="exportType">
          <v-radio label="Export all" value="all" :class="exportAllClass"></v-radio>
          <div class="pl-10 mb-4">
            <p :class="exportAllClass + ' font-weight-light text-caption'">
              Export all node data into an excel, due to mind data are different in the data depth from each other, the
              data is exported line by line, without aligned column names.</p>
          </div>
          <v-radio label="Export tests" value="tests" :class="exportTestsClass"></v-radio>
          <div class="pl-10">
            <p :class="exportTestsClass + ' font-weight-light text-caption'">
              Export tests node data into an excel, all other non-test node data are ignored.</p>
          </div>
        </v-radio-group>
        <div class="pl-7">
          <v-row justify="start">
            <v-col cols="4" class="pr-0 pb-0">
              <v-checkbox color="grey-darken-3"
                          v-model="enableFilterByTags"
                          :disabled="exportType !== 'tests'"
                          label="Filter by tags:"
                          :class="exportTestsClass + ' check-box'"></v-checkbox>
            </v-col>
            <v-col cols="8" class="pb-0">
              <v-select multiple clearable
                        :disabled="!enableFilterByTags || exportType !== 'tests'"
                        :items="['California', 'Colorado']"
                        class="select-box"></v-select>
            </v-col>
          </v-row>
          <v-checkbox color="grey-darken-3"
                      label="Align columns"
                      v-model="alignColumns"
                      :disabled="exportType !== 'tests'"
                      :class="exportTestsClass + ' check-box'"></v-checkbox>
        </div>

      </v-card-item>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog" class="text-none">Close</v-btn>
        <v-btn color="primary" @click="exportData" class="text-none">Export</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {computed, defineProps, ref} from "vue";
import { useMindStore } from "@/store/mind";
import { useNodeStore } from "@/store/node";
import { useStatusStore } from "@/store/status";
import * as excelUtils from "@/utils/excelUtils";

const mindStore = useMindStore();
const nodeStore = useNodeStore();
const statusStore = useStatusStore();
const props = defineProps(['vid']);

const isExportDialogOpen = ref(false);
const exportType = ref('all');
const enableFilterByTags = ref(false);
const exportAllClass = computed(() => { return exportType.value === 'all' ? 'enabled-text' : 'disabled-text' });
const exportTestsClass = computed(() => { return exportType.value === 'tests' ? 'enabled-text' : 'disabled-text' });
const exportLoading = ref(false);
const alignColumns = ref(false);

const exportData = () => {
  if (exportType.value === 'all') {
    excelUtils.createAndDownloadExcelOfAllEndingNodes(mindStore.mindDataSync.nodeData, mindStore.mindDataSync.nodeData.topic);

  } else if (exportType.value === 'tests') {
    excelUtils.createAndDownloadExcelOfAllTestEndingNodes(
      mindStore.mindDataSync.nodeData,
      mindStore.mindDataSync.nodeData.topic,
      alignColumns.value
    );
  }
};

const closeDialog = () => {
  exportLoading.value = true;
  setTimeout(() => {
    exportLoading.value = false;
    isExportDialogOpen.value = false
  }, 4000);
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
.export-dialog {
  max-width: 560px;
}
.enabled-text {
  color: #424242;
}
.enabled-text label {
  opacity: unset;
}
.disabled-text {
  color: #BDBDBD;
}
.check-box > div > div > div {
  font-size: smaller;
}
.check-box > div > div > label {
  font-size: smaller;
}
.select-box > div > div {
  font-size: smaller;
}
</style>
