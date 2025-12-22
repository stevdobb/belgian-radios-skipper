import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import { useThemeStore } from './stores/themeStore'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

useThemeStore(pinia).init()

app.mount('#app')
