import { createApp } from "vue";
import App from "./App.vue";

let app = createApp(App);
app.mount("#app");

export const unmount = function () {
  console.log("vue unmount");
  app.unmount();
};
