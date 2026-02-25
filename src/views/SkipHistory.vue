<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="space-y-6 p-6">
    <div class="dw-card rounded-2xl p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-100 flex items-center space-x-2">
          <ClockIcon class="w-6 h-6" />
          <span>Skip History</span>
        </h3>
        <div class="text-xs text-gray-500 dark:text-slate-400">Last 20 skips</div>
      </div>

      <div class="flex items-center justify-between mt-4">
        <div class="text-sm text-gray-600 dark:text-slate-300">Total: {{ skipEntries.length }}</div>
        <button
          class="text-xs text-red-600 hover:underline"
          @click="clearHistory"
          :disabled="skipEntries.length === 0"
        >
          Clear
        </button>
      </div>

      <div class="mt-4">
        <div v-if="skipEntries.length === 0" class="text-sm text-gray-600 dark:text-slate-400 italic">
          No skips recorded yet.
        </div>

        <div v-else class="divide-y divide-blue-100 dark:divide-slate-700">
          <div
            v-for="entry in skipEntries"
            :key="entry.id"
            class="py-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
          >
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-lg bg-[#2b67b4] flex items-center justify-center">
                <MusicalNoteIcon class="w-5 h-5 text-blue-100" />
              </div>
              <div class="min-w-0">
                <div class="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">
                  {{ entry.artist || 'Unknown artist' }}
                </div>
                <div class="text-xs text-gray-700 dark:text-slate-300 truncate">
                  {{ entry.title || 'Unknown title' }}
                </div>
                <div class="text-xs text-gray-500 dark:text-slate-400">
                  {{ entry.stationName || 'Unknown station' }}
                  <span v-if="entry.stationShortName">({{ entry.stationShortName }})</span>
                </div>
              </div>
            </div>

            <div class="text-xs text-gray-500 dark:text-slate-400 sm:text-right">
              <div>{{ formatTime(entry.time) }}</div>
              <div v-if="entry.source" class="uppercase tracking-wider mt-1">
                {{ formatSource(entry.source) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRadioStore } from '../stores/radioStore'
import { ClockIcon, MusicalNoteIcon } from '@heroicons/vue/24/outline'

const radioStore = useRadioStore()

onMounted(() => {
  radioStore.loadSkipHistory()
})

const skipEntries = computed(() => radioStore.skipHistory || [])

const formatTime = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

const formatSource = (value) => {
  if (!value) return ''
  if (value === 'auto') return 'Auto'
  if (value === 'manual') return 'Manual'
  return String(value)
}

const clearHistory = () => {
  if (skipEntries.value.length === 0) return
  if (confirm('Clear skip history?')) {
    radioStore.clearSkipHistory()
  }
}
</script>
