import { createApp } from 'vue';
import App from './App.vue';
import router from './ui/routers/index';
import { createPinia } from 'pinia';


const app = createApp(App);
const pinia = createPinia();
app.use(pinia); // Đăng ký Pinia trước router
app.use(router);
app.mount('#app');