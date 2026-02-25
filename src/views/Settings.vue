<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="space-y-6 p-6">
    <!-- General Settings Card -->
    <div class="dw-card rounded-2xl p-6">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6 flex items-center space-x-2">
        <CogIcon class="w-6 h-6" />
        <span>General Settings</span>
      </h3>

      <div class="space-y-4">
        <!-- Auto-play Toggle -->
        <div class="flex items-center justify-between border-t border-blue-200 dark:border-slate-700 pt-4">
          <div>
            <label class="text-gray-900 dark:text-slate-100 font-medium">Auto-play</label>
            <p class="text-gray-600 dark:text-slate-300 text-sm mt-1">Automatically start playing when opening app</p>
          </div>
          <div
            class="relative inline-block w-14 h-8 rounded-full cursor-pointer"
            :class="radioStore.autoPlay ? 'bg-blue-600' : 'bg-[#3d74bb]'"
            @click="toggleAutoplay"
          >
            <div
              class="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 transform"
              :style="{ transform: radioStore.autoPlay ? 'translateX(24px)' : 'translateX(0)' }"
            ></div>
          </div>
        </div>

        <!-- Auto-return Toggle -->
        <div class="flex items-center justify-between pt-4 border-t border-blue-200 dark:border-slate-700">
          <div>
            <label class="text-gray-900 dark:text-slate-100 font-medium">Auto-return after skip</label>
            <p class="text-gray-600 dark:text-slate-300 text-sm mt-1">Automatically return to the first preferred station when the disliked song ends</p>
          </div>
          <div class="relative inline-block w-14 h-8 bg-[#3d74bb] rounded-full cursor-pointer" @click="toggleAutoReturn">
            <div
              class="absolute top-1 left-1 w-6 h-6 bg-white dark:bg-slate-100 rounded-full shadow-md transition-all duration-300 transform"
              :style="{ transform: radioStore.autoReturn ? 'translateX(24px)' : 'translateX(0)' }"
            ></div>
          </div>
        </div>

        <!-- Skipping Enabled Toggle -->
        <div class="flex items-center justify-between pt-4 border-t border-blue-200 dark:border-slate-700">
          <div>
            <label class="text-gray-900 dark:text-slate-100 font-medium">Enable automatic skipping</label>
            <p class="text-gray-600 dark:text-slate-300 text-sm mt-1">When enabled, disliked songs will trigger automatic skipping</p>
          </div>
          <div class="relative inline-block w-14 h-8 bg-[#3d74bb] rounded-full cursor-pointer" @click="toggleSkipEnabled">
            <div
              class="absolute top-1 left-1 w-6 h-6 bg-white dark:bg-slate-100 rounded-full shadow-md transition-all duration-300 transform"
              :style="{ transform: radioStore.skipEnabled ? 'translateX(24px)' : 'translateX(0)' }"
            ></div>
          </div>
        </div>

        <!-- Max preferred skips -->
        <div class="flex items-center justify-between pt-4 border-t border-blue-200 dark:border-slate-700">
          <div>
            <label class="text-gray-900 dark:text-slate-100 font-medium">Max preferred skips</label>
            <p class="text-gray-600 dark:text-slate-300 text-sm mt-1">How many preferred stations to try before returning (empty = all)</p>
          </div>
          <input
            type="number"
            min="1"
            v-model.number="radioStore.maxPreferredSkips"
            @change="radioStore.savePreferences()"
            placeholder="(all)"
            class="w-20 bg-[#1a4f98] border border-blue-200 rounded-lg px-2 py-1 text-sm text-gray-900 dark:text-slate-100"
          />
        </div>

        <!-- Export telemetry CSV -->
        <div class="flex items-center justify-between pt-4 border-t border-blue-200 dark:border-slate-700">
          <div>
            <label class="text-gray-900 dark:text-slate-100 font-medium">Telemetry export</label>
            <p class="text-gray-600 dark:text-slate-300 text-sm mt-1">Download recent telemetry as CSV for debugging</p>
          </div>
          <button @click="exportTelemetryCsv" class="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">Export</button>
        </div>
      </div>
    </div>

    <!-- Storage Management Card -->
    <div class="dw-card rounded-2xl p-6">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6 flex items-center space-x-2">
        <TrashIcon class="w-6 h-6" />
        <span>Storage Management</span>
      </h3>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <label class="text-gray-900 dark:text-slate-100 font-medium">Disliked Artists</label>
            <p class="text-gray-600 dark:text-slate-300 text-sm mt-1">You have {{ radioStore.dislikes.length }} disliked artists saved</p>
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
    <div class="dw-card rounded-2xl p-6">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6 flex items-center space-x-2">
        <InformationCircleIcon class="w-6 h-6" />
        <span>About</span>
      </h3>

      <div class="space-y-4">
        <div>
          <p class="text-gray-600 dark:text-slate-300 text-sm">Application Name</p>
          <p class="text-gray-900 dark:text-slate-100 font-medium">Belgian Radio Player</p>
        </div>
        <div>
          <p class="text-gray-600 dark:text-slate-300 text-sm">Version</p>
          <p class="text-gray-900 dark:text-slate-100 font-medium">1.0.0</p>
        </div>
        <div>
          <p class="text-gray-600 dark:text-slate-300 text-sm">Built with</p>
          <p class="text-gray-900 dark:text-slate-100 font-medium">Vue.js 3 • Vue Router • Pinia • Tailwind CSS • Heroicons</p>
        </div>
        <div class="pt-4 border-t border-blue-200 dark:border-slate-700">
          <p class="text-gray-600 dark:text-slate-300 text-xs">
            This application streams Belgian radio stations from VRT (Vlaamse Radio- en Televisie). All content is provided by VRT.
          </p>
        </div>
      </div>
    </div>

    <!-- Changelog Card -->
    <div class="dw-card rounded-2xl p-6">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6 flex items-center space-x-2">
        <SparklesIcon class="w-6 h-6" />
        <span>What's New</span>
      </h3>

      <div class="space-y-4">
        <div>
          <p class="text-gray-900 dark:text-slate-100 font-medium text-sm">v1.0.0 - Complete Rebuild</p>
          <ul class="text-gray-600 dark:text-slate-300 text-sm mt-2 space-y-1 list-disc list-inside">
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

    <!-- Telemetry Card -->
    <div class="dw-card rounded-2xl p-6">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
        <SparklesIcon class="w-6 h-6" />
        <span>Telemetry</span>
      </h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600 dark:text-slate-300">Recent events</div>
          <button @click="clearTelemetry" class="text-xs text-red-600 hover:underline">Clear</button>
        </div>
        <div class="max-h-48 overflow-auto text-xs text-gray-700 dark:text-slate-200">
          <div v-if="radioStore.telemetry.length === 0" class="italic text-gray-500 dark:text-slate-400">No telemetry yet</div>
          <div v-for="(entry, idx) in radioStore.telemetry.slice(0,10)" :key="idx" class="py-1 border-b border-gray-100 dark:border-slate-800">
            <div class="text-[11px] font-medium">{{ entry.type }}</div>
            <div class="text-[11px] text-gray-600 dark:text-slate-300">{{ entry.message }}</div>
            <div class="text-[10px] text-gray-400 dark:text-slate-500">{{ entry.time }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRadioStore } from '../stores/radioStore'
import {
  CogIcon,
  TrashIcon,
  InformationCircleIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'

const radioStore = useRadioStore()

const toggleAutoplay = () => {
  radioStore.autoPlay = !radioStore.autoPlay
  radioStore.savePreferences()
}

const toggleAutoReturn = () => {
  radioStore.autoReturn = !radioStore.autoReturn
  radioStore.savePreferences()
}

const clearTelemetry = () => {
  if (confirm('Clear telemetry events?')) {
    radioStore.clearTelemetry()
  }
}

const toggleSkipEnabled = () => {
  radioStore.skipEnabled = !radioStore.skipEnabled
  radioStore.savePreferences()
}

const exportTelemetryCsv = () => {
  const entries = radioStore.telemetry || []
  if (!entries.length) {
    alert('No telemetry to export')
    return
  }
  const rows = entries.map(e => [e.time, e.type, (e.message || '').replace(/\n/g, ' ')])
  const csv = ['time,type,message', ...rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `telemetry_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const clearDisliked = () => {
  if (confirm('Are you sure you want to clear all disliked artists?')) {
    radioStore.dislikes = []
    radioStore.saveDislikes()
  }
}
</script>
