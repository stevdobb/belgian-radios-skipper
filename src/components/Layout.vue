<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
    <!-- Mobile Menu Button -->
    <button
      @click="sidebarOpen = !sidebarOpen"
      class="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 shadow-md"
    >
      <svg class="w-6 h-6 text-gray-900 dark:text-slate-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>

    <!-- Sidebar Navigation -->
    <nav
      :class="[
        'bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 shadow-md flex flex-col transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-0 md:w-64',
        'fixed md:relative h-full z-40'
      ]"
    >
      <div class="p-6 border-b border-gray-200 dark:border-slate-700">
        <div class="flex items-center space-x-2">
          <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm0 8a1 1 0 011-1h12a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1z"></path>
          </svg>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-slate-100">Radio</h1>
        </div>
      </div>

      <div class="flex-1 flex flex-col justify-between p-6">
        <div class="space-y-2">
          <RouterLink
            to="/"
            @click="sidebarOpen = false"
            class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-slate-300"
            :class="{ 'bg-blue-500 text-white': $route.path === '/' }"
          >
            <HomeIcon class="w-5 h-5" />
            <span>Home</span>
          </RouterLink>
          <RouterLink
            to="/settings"
            @click="sidebarOpen = false"
            class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-slate-300"
            :class="{ 'bg-blue-500 text-white': $route.path === '/settings' }"
          >
            <CogIcon class="w-5 h-5" />
            <span>Settings</span>
          </RouterLink>
        </div>

        <div class="text-gray-500 dark:text-slate-400 text-xs">
          <p>Belgian Radio Player</p>
          <p class="mt-2">© 2025</p>
        </div>
      </div>
    </nav>

    <!-- Sidebar Overlay (Mobile) -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
    ></div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 md:px-6 py-4 shadow-sm">
        <div class="flex items-center justify-between">
          <h2 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-slate-100 ml-12 md:ml-0">{{ headerTitle }}</h2>
          <div class="flex items-center space-x-4">
            <button @click="toggleInfo" class="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100">
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
const sidebarOpen = ref(false)

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
