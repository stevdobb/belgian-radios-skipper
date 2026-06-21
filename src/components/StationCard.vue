<template>
  <div
    @click="selectStation"
    class="group relative overflow-hidden rounded-2xl dw-card cursor-pointer transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0 bg-pattern"></div>
    </div>

    <!-- Content -->
    <div class="relative p-3 sm:p-4 h-full flex flex-col justify-between min-h-44 sm:min-h-48">
      <!-- Header -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-slate-100">{{ station.name }}</h3>
          <div
            class="h-8 sm:h-9 min-w-[52px] sm:min-w-[64px] max-w-[94px] px-2 rounded-md flex items-center justify-center text-[10px] sm:text-xs font-extrabold tracking-wide uppercase border border-white/20 shadow-sm truncate"
            :style="brandBadgeStyle"
            :title="station.brandLabel || station.shortName || station.name"
          >
            {{ brandBadgeLabel }}
          </div>
        </div>
      </div>

      <!-- Now Playing -->
      <div class="flex items-center space-x-3">
        <div v-if="songInfo.albumArt" class="flex-shrink-0">
          <img :src="songInfo.albumArt" alt="Album Art" class="w-12 h-12 rounded-md shadow-sm object-cover" />
        </div>
        <div class="flex-1 min-w-0">
          <div v-if="songInfo.artist || songInfo.title" class="space-y-1">
            <div class="text-gray-700 dark:text-slate-300 text-[10px] font-semibold uppercase tracking-wider">
              Now Playing
            </div>
            <div v-if="songInfo.artist" class="text-gray-900 dark:text-slate-100 font-semibold text-sm line-clamp-2">
              {{ songInfo.artist }}
            </div>
            <div v-if="songInfo.title" class="text-gray-700 dark:text-slate-300 text-[11px] line-clamp-2">
              {{ songInfo.title }}
            </div>
          </div>
          <div v-else class="text-gray-600 dark:text-slate-400 text-[11px] italic">
            No song playing now
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-[#4f86cb]">
        <span class="text-gray-700 dark:text-slate-300 text-[11px] font-medium" :style="station.brandColor ? { color: station.brandColor } : null">
          {{ station.shortName }}
        </span>
        <ArrowRightIcon class="w-4 h-4 text-gray-700 dark:text-slate-300 opacity-70 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable vue/no-setup-props-destructure, no-undef */
import { computed } from 'vue'
import { useRadioStore } from '../stores/radioStore'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  station: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])
const radioStore = useRadioStore()

const songInfo = computed(() => {
  return props.station.songInfo || {}
})

const brandBadgeLabel = computed(() => {
  return props.station.brandLabel || props.station.shortName || props.station.name || 'Radio'
})

const brandBadgeStyle = computed(() => {
  return {
    backgroundColor: props.station.brandColor || '#3b82f6',
    color: props.station.brandTextColor || '#ffffff'
  }
})

const selectStation = () => {
  radioStore.selectStation(props.station.id)
  emit('select', props.station.id)
}
</script>

<style scoped>
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
