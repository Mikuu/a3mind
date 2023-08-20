<template>
  <v-app>
<!--    <AppBar :breadcrumbs="breadcrumbs"/>-->
    <MindCanvas :vid="route.params.vid"/>
  </v-app>
</template>

<script setup>
import MindCanvas from '@/components/MindCanvas.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>


<style scoped>

</style>
