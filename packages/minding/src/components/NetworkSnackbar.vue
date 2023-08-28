<template>
  <v-snackbar
    v-model="statusStore.networkRequestShow"
    :color="snackColor"
    :close-on-content-click="true"
    location="top"
    rounded="pill"
    min-width="80"
  >
    {{ statusStore.networkRequestMessage }}
  </v-snackbar>
</template>

<script setup>
import { computed } from 'vue';
import { useStatusStore } from "@/store/status";

const statusStore = useStatusStore();
const snackColor = computed(() => {
  return statusStore.networkRequestSuccess ? 'green-lighten-1' : 'orange-darken-1';
});

// const props = defineProps({
//   show: Boolean,
//   message: String,
//   success: Boolean,
// });

// const displaySnackbar = ref(props.show);
// watchEffect(() => displaySnackbar.value = props.show);
//
// const snackColor = computed(() => {
//   return props.success ? 'green-lighten-1' : 'orange-darken-1';
// });
</script>
