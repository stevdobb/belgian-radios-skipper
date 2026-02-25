<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="dw-theme min-h-screen bg-[#0f4ea3] text-blue-50">
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-[#4f86cb] bg-[#1455a9]/95 backdrop-blur-sm shadow-md">
      <div class="h-16 mx-auto w-full max-w-[1480px] px-3 sm:px-4 md:px-6 flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm0 8a1 1 0 011-1h12a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1z"></path>
          </svg>
          <span class="font-semibold tracking-tight text-blue-50">Belgian Radio</span>
        </div>

        <nav class="hidden md:flex items-center gap-1 sm:gap-2">
          <RouterLink
            to="/"
            class="inline-flex items-center gap-2 h-9 rounded-md border border-transparent px-3 text-sm font-medium text-blue-100 transition-colors hover:bg-[#2f70bf] hover:text-white"
            :class="{ 'bg-[#3f7fcc] text-white border-[#6b9bda] shadow-sm': $route.path === '/' }"
          >
            <HomeIcon class="w-4 h-4" />
            <span>Home</span>
          </RouterLink>
          <RouterLink
            to="/skips"
            class="inline-flex items-center gap-2 h-9 rounded-md border border-transparent px-3 text-sm font-medium text-blue-100 transition-colors hover:bg-[#2f70bf] hover:text-white"
            :class="{ 'bg-[#3f7fcc] text-white border-[#6b9bda] shadow-sm': $route.path === '/skips' }"
          >
            <ClockIcon class="w-4 h-4" />
            <span>Skips</span>
          </RouterLink>
          <RouterLink
            to="/settings"
            class="inline-flex items-center gap-2 h-9 rounded-md border border-transparent px-3 text-sm font-medium text-blue-100 transition-colors hover:bg-[#2f70bf] hover:text-white"
            :class="{ 'bg-[#3f7fcc] text-white border-[#6b9bda] shadow-sm': $route.path === '/settings' }"
          >
            <CogIcon class="w-4 h-4" />
            <span>Settings</span>
          </RouterLink>
        </nav>

        <button
          type="button"
          class="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-[#6b9bda] text-blue-100 hover:bg-[#2f70bf] transition-colors"
          @click="mobileMenuOpen = !mobileMenuOpen"
          :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
          aria-label="Open menu"
        >
          <Bars3Icon v-if="!mobileMenuOpen" class="w-5 h-5" />
          <XMarkIcon v-else class="w-5 h-5" />
        </button>
      </div>
    </header>

    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 top-16 z-40 bg-black/35 md:hidden"
      @click="mobileMenuOpen = false"
    ></div>

    <div
      v-if="mobileMenuOpen"
      class="fixed top-16 left-0 right-0 z-50 border-b border-[#4f86cb] bg-[#1455a9] md:hidden shadow-lg"
    >
      <nav class="px-3 py-3 space-y-2">
        <RouterLink
          to="/"
          class="inline-flex w-full items-center gap-2 h-10 rounded-md border border-transparent px-3 text-sm font-medium text-blue-100 transition-colors hover:bg-[#2f70bf] hover:text-white"
          :class="{ 'bg-[#3f7fcc] text-white border-[#6b9bda] shadow-sm': $route.path === '/' }"
          @click="mobileMenuOpen = false"
        >
          <HomeIcon class="w-4 h-4" />
          <span>Home</span>
        </RouterLink>
        <RouterLink
          to="/skips"
          class="inline-flex w-full items-center gap-2 h-10 rounded-md border border-transparent px-3 text-sm font-medium text-blue-100 transition-colors hover:bg-[#2f70bf] hover:text-white"
          :class="{ 'bg-[#3f7fcc] text-white border-[#6b9bda] shadow-sm': $route.path === '/skips' }"
          @click="mobileMenuOpen = false"
        >
          <ClockIcon class="w-4 h-4" />
          <span>Skips</span>
        </RouterLink>
        <RouterLink
          to="/settings"
          class="inline-flex w-full items-center gap-2 h-10 rounded-md border border-transparent px-3 text-sm font-medium text-blue-100 transition-colors hover:bg-[#2f70bf] hover:text-white"
          :class="{ 'bg-[#3f7fcc] text-white border-[#6b9bda] shadow-sm': $route.path === '/settings' }"
          @click="mobileMenuOpen = false"
        >
          <CogIcon class="w-4 h-4" />
          <span>Settings</span>
        </RouterLink>
      </nav>
    </div>

    <div class="hidden md:block fixed top-20 right-4 z-40 w-60">
      <CastVolume />
    </div>

    <main class="pt-16 min-h-screen">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { HomeIcon, CogIcon, ClockIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import CastVolume from './CastVolume.vue'

const route = useRoute()
const mobileMenuOpen = ref(false)

watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>
