<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <!-- Sidebar Navigation -->
    <nav class="w-64 bg-gray-800 border-r border-gray-700 shadow-lg flex flex-col">
      <div class="p-6 border-b border-gray-700">
        <div class="flex items-center space-x-2">
          <svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm0 8a1 1 0 011-1h12a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1z"></path>
          </svg>
          <h1 class="text-2xl font-bold text-white">Radio</h1>
        </div>
      </div>

      <div class="flex-1 flex flex-col justify-between p-6">
        <div class="space-y-2">
          <RouterLink to="/" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors" :class="{ 'bg-blue-500 text-white': $route.path === '/' }">
            <HomeIcon class="w-5 h-5" />
            <span>Home</span>
          </RouterLink>
          <RouterLink to="/settings" class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors" :class="{ 'bg-blue-500 text-white': $route.path === '/settings' }">
            <CogIcon class="w-5 h-5" />
            <span>Settings</span>
          </RouterLink>
        </div>

        <div class="text-gray-400 text-xs">
          <p>Belgian Radio Player</p>
          <p class="mt-2">© 2025</p>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-gray-800 border-b border-gray-700 px-6 py-4 shadow-md">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">{{ headerTitle }}</h2>
          <div class="flex items-center space-x-4">
            <button @click="toggleInfo" class="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white">
              <InformationCircleIcon class="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <!-- Router View -->
      <main class="flex-1 overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { HomeIcon, CogIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const showInfo = ref(false)

const headerTitle = computed(() => {
  switch (route.path) {
    case '/':
      return 'Radio Stations'
    case '/settings':
      return 'Settings'
    default:
      return 'Belgian Radio'
  }
})

const toggleInfo = () => {
  showInfo.value = !showInfo.value
}
</script>
