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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const baseUrl = process.env.BASE_URL || '/'
    navigator.serviceWorker.register(`${baseUrl}service-worker.js`).catch((error) => {
      console.error('Service worker registration failed:', error)
    })
  })
}

app.mount('#app')
