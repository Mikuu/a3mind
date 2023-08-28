<template>
  <v-app>
    <AppBar :breadcrumbs="breadcrumbs"/>
    <Project :pid="route.params.pid"/>
  </v-app>

  <NetworkSnackbar />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from "@/store/project";
import { useStatusStore } from "@/store/status";
import AppBar from '@/components/AppBar.vue';
import Project from '@/components/ProjectBoard.vue';
import NetworkSnackbar from "@/components/NetworkSnackbar.vue";

const route = useRoute();
const statusStore = useStatusStore();
const projectStore = useProjectStore();
const projectName = ref(null);

const breadcrumbs = reactive([
    { title: 'Home', disabled: false, href: '/home' },
    { title: projectName, disabled: true, href: '' },
]);

onMounted(async () => {
  await fetchProjectName();
});

const fetchProjectName = async () => {

  const onSucceed = (projectNameFromResponse) => {
    projectName.value = projectNameFromResponse;
  };

  const onFailed = (reason) => {
    statusStore.requestFailedHandler(`Get project failed ${reason}`, 5000)();
  }

  projectStore.getProject(route.params.pid, onSucceed, onFailed);
};


</script>

<style scoped>

</style>
