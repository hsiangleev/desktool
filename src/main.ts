import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from '@/router'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/display.css'
import '@/assets/css/index.css'
import 'virtual:uno.css'
import { epsIconInit } from '@/assets/icon'
const app = createApp(App)

app.use(ElementPlus)
app.use(router)
epsIconInit()
app.mount('#app')
