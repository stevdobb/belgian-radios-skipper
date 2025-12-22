import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'themeMode'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref('system')
  const systemPrefersDark = ref(false)

  const isDark = computed(() => {
    if (mode.value === 'system') {
      return systemPrefersDark.value
    }
    return mode.value === 'dark'
  })

  const applyTheme = () => {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  const init = () => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      mode.value = saved
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const updateSystem = () => {
      systemPrefersDark.value = media.matches
    }
    updateSystem()

    if (media.addEventListener) {
      media.addEventListener('change', updateSystem)
    } else if (media.addListener) {
      media.addListener(updateSystem)
    }

    applyTheme()
  }

  const toggleDarkMode = () => {
    mode.value = isDark.value ? 'light' : 'dark'
  }

  const useSystem = () => {
    mode.value = 'system'
  }

  watch([mode, systemPrefersDark], () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, mode.value)
    }
    applyTheme()
  })

  return {
    mode,
    systemPrefersDark,
    isDark,
    init,
    toggleDarkMode,
    useSystem
  }
})
