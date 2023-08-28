<template>
  <v-app>
    <MindCanvas :vid="route.params.vid"/>
    <NetworkSnackbar/>
  </v-app>
</template>

<script setup>
import MindCanvas from '@/components/MindCanvas.vue';
import NetworkSnackbar from "@/components/NetworkSnackbar.vue";
import { useRoute } from 'vue-router';

const route = useRoute();
</script>


<style scoped>

</style>
