<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-if="displayInIsland" icon="mdi-account" style="box-shadow: none; background-color: #2D3748 !important;" size="small" v-bind="props"></v-btn>
      <v-btn v-if="displayInMenu" icon="mdi-account" v-bind="props"></v-btn>
    </template>
    <v-list>
      <v-list-item :title=username :subtitle=email></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list>
      <v-list-item link @click="manageAccount">
        <template v-slot:prepend>
          <v-icon icon="mdi-account-edit" color="primary"></v-icon>
        </template>
        <v-list-item-title>Manage account</v-list-item-title>
      </v-list-item>

      <v-list-item link @click="logout">
        <template v-slot:prepend>
          <v-icon icon="mdi-logout" color="primary"></v-icon>
        </template>
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { inject, ref, defineProps, computed } from "vue";

const keycloak = ref(inject('keycloak'));
const email = keycloak.value.idTokenParsed.email;
const username = keycloak.value.idTokenParsed.preferred_username;
const props = defineProps(['usedIn']);

const displayInMenu = computed(() => props.usedIn === 'menu');
const displayInIsland = computed(() => props.usedIn === 'island');

const manageAccount = () => {
  window.location.href = 'http://localhost:8080/realms/automind/account/#/personal-info';
};

const logout = () => {
  keycloak.value.logout({
    redirectUri: window.location.origin
  });
};
</script>

<style>
.v-list-item__spacer {
  width: unset;
}
</style>
