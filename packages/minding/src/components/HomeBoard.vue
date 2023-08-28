<template>
  <v-table class="mt-16 px-6 h-100" fixed-header>
    <thead>
      <tr>
        <th class="flex-grow-1 text-left">
          Projects
          <input
            ref="projectInput"
            class="mx-8 px-8 text-h6 font-weight-light"
            type="text"
            v-model="newProjectName"
            @keyup.enter="createProject"
            :placeholder="isInputFocused? '' : '+'"
          />
        </th>
        <th class="text-left" style="max-width: 60px">Last modified</th>
        <th class="text-left" style="max-width: 60px">Views</th>
        <th class="text-left" style="max-width: 30px"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="project in projectStore.projects" :key="project.projectName">
        <td class="font-weight-light">
          <router-link
              :to="`/project/${project.pid}`"
              class="custom-router-link"
              active-class="custom-active-link"
          >{{ project.projectName }}</router-link>
        </td>
        <td class="font-weight-light">May 30, 2023 Ariman</td>
        <td class="font-weight-light">5</td>
        <td class="font-weight-light"><ProjectMenu :pid="project.pid"/></td>
      </tr>
    </tbody>
  </v-table>

  <NetworkSnackbar />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProjectStore } from "@/store/project";
import { useStatusStore } from "@/store/status";
import ProjectMenu from './ProjectMenu';
import NetworkSnackbar from "./NetworkSnackbar.vue";

const statusStore = useStatusStore();
const projectStore = useProjectStore();

const projectInput = ref(null);
const newProjectName = ref('');
const isInputFocused = ref(false);


onMounted(() => {
  loadProjects();
});

const loadProjects = () => {
  projectStore.retrieveProjects();
}

const createProject = () => {
  const trimmedProjectName = newProjectName.value.trim();
  if (trimmedProjectName === "") return;

  const onSucceed = () => {
    projectStore.retrieveProjects();
  };

  const onFailed = (reason) => {
    statusStore.requestFailedHandler(`Create project failed ${reason}`, 5000)();
  }

  projectStore.createProject(trimmedProjectName, onSucceed, onFailed);

  newProjectName.value = '';
  projectInput.value.blur();
}
</script>

<style>
.flex-grow-1 {
  flex: 1;
}
.custom-router-link {
  text-decoration: none;
  color: inherit;

  cursor: pointer;
  transition: color 0.2s;
}

.custom-router-link:hover {
  color: #1976d2;
}

.custom-active-link {
  font-weight: bold;
}
</style>
