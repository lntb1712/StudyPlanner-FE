import { createApp } from 'vue'
import App from './App.vue'
import router from './ui/routers/index'
import { createPinia } from 'pinia'
import './assets/main.css'   // ✅ bắt buộc

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)   // đăng ký store toàn cục
app.use(router)  // đăng ký router
app.mount('#app')
