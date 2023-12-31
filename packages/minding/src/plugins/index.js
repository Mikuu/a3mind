/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader';
import vuetify from './vuetify';
import pinia from '../store';
import router from '../router';
import { KeycloakPlugin } from "@/plugins/keycloak";

export function registerPlugins (app) {
  loadFonts()
  app
    .use(KeycloakPlugin)
    .use(vuetify)
    .use(router)
    .use(pinia)
}
