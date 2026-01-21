import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import ToastPlugin from "vue-toast-notification";
import { customToastPlugin } from "./plugins/useToast";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
const app = createApp(App);

app.use(createPinia());
app.use(customToastPlugin);
app.component('QuillEditor', QuillEditor)
app.mount("#app");
