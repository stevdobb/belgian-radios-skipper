<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="space-y-6 p-6">
    <!-- General Settings Card -->
    <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-lg">
      <h3 class="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
        <CogIcon class="w-6 h-6" />
        <span>General Settings</span>
      </h3>

      <div class="space-y-4">
        <!-- Theme Toggle -->
        <div class="flex items-center justify-between">
          <div>
            <label class="text-gray-900 font-medium">Dark Mode</label>
            <p class="text-gray-600 text-sm mt-1">Enable dark theme for the application</p>
          </div>
          <div class="relative inline-block w-14 h-8 bg-gray-300 rounded-full cursor-pointer" @click="toggleDarkMode">
            <div
              class="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 transform"
              :style="{ transform: darkMode ? 'translateX(24px)' : 'translateX(0)' }"
            ></div>
          </div>
        </div>

        <!-- Auto-play Toggle -->
        <div class="flex items-center justify-between pt-4 border-t border-blue-200">
          <div>
            <label class="text-gray-900 font-medium">Auto-play</label>
            <p class="text-gray-600 text-sm mt-1">Automatically start playing when opening app</p>
          </div>
          <div class="relative inline-block w-14 h-8 bg-blue-600 rounded-full cursor-pointer" @click="toggleAutoplay">
            <div class="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 transform translate-x-6"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Storage Management Card -->
    <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-lg">
      <h3 class="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
        <TrashIcon class="w-6 h-6" />
        <span>Storage Management</span>
      </h3>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <label class="text-gray-900 font-medium">Disliked Artists</label>
            <p class="text-gray-600 text-sm mt-1">You have {{ radioStore.dislikes.length }} disliked artists saved</p>
          </div>
          <button
            @click="clearDisliked"
            class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-4 py-2 rounded-lg transition-all"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>

    <!-- About Card -->
    <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-lg">
      <h3 class="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
        <InformationCircleIcon class="w-6 h-6" />
        <span>About</span>
      </h3>

      <div class="space-y-4">
        <div>
          <p class="text-gray-600 text-sm">Application Name</p>
          <p class="text-gray-900 font-medium">Belgian Radio Player</p>
        </div>
        <div>
          <p class="text-gray-600 text-sm">Version</p>
          <p class="text-gray-900 font-medium">1.0.0</p>
        </div>
        <div>
          <p class="text-gray-600 text-sm">Built with</p>
          <p class="text-gray-900 font-medium">Vue.js 3 • Vue Router • Pinia • Tailwind CSS • Heroicons</p>
        </div>
        <div class="pt-4 border-t border-blue-200">
          <p class="text-gray-600 text-xs">
            This application streams Belgian radio stations from VRT (Vlaamse Radio- en Televisie). All content is provided by VRT.
          </p>
        </div>
      </div>
    </div>

    <!-- Changelog Card -->
    <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-lg">
      <h3 class="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
        <SparklesIcon class="w-6 h-6" />
        <span>What's New</span>
      </h3>

      <div class="space-y-4">
        <div>
          <p class="text-gray-900 font-medium text-sm">v1.0.0 - Complete Rebuild</p>
          <ul class="text-gray-600 text-sm mt-2 space-y-1 list-disc list-inside">
            <li>Rebuilt with Vue Router for better navigation</li>
            <li>Integrated Pinia for state management</li>
            <li>Added Heroicons for beautiful UI elements</li>
            <li>Enhanced UI with Tailwind CSS gradients and animations</li>
            <li>Improved responsive design for mobile devices</li>
            <li>Modern light theme as default</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRadioStore } from '../stores/radioStore'
import {
  CogIcon,
  TrashIcon,
  InformationCircleIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'

const radioStore = useRadioStore()
const darkMode = ref(true)

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
}

const toggleAutoplay = () => {
  // This would typically save to localStorage
  console.log('Autoplay toggled')
}

const clearDisliked = () => {
  if (confirm('Are you sure you want to clear all disliked artists?')) {
    radioStore.dislikes = []
    radioStore.saveDislikes()
  }
}
</script>
