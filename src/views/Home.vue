<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="space-y-4 md:space-y-6 pb-4 md:pb-6">
    <!-- Now Playing Section -->
    <div v-if="radioStore.currentSongData.artist" class="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-8 border border-blue-200 dark:border-slate-700 shadow-lg">
        <div class="text-blue-600 dark:text-blue-300 text-xs md:text-sm font-semibold uppercase tracking-wider mb-3 md:mb-4">
          Now Playing
        </div>
        <h2 class="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2 line-clamp-2">
          {{ radioStore.currentStationName || 'Loading...' }}
        </h2>
        <div class="space-y-3 mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 md:pt-6 border-t border-blue-200 dark:border-slate-700">
          <div class="flex items-start space-x-3 md:space-x-4">
            <div class="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <MusicalNoteIcon class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-blue-600 dark:text-blue-300 text-xs font-semibold uppercase mb-1">Artist</p>
              <p class="text-gray-900 dark:text-slate-100 text-base sm:text-lg md:text-xl font-bold line-clamp-2 break-words">{{ radioStore.currentSongData.artist }}</p>
            </div>
          </div>
          <div class="flex items-start space-x-3 md:space-x-4">
            <div class="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <SparklesIcon class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-blue-600 dark:text-blue-300 text-xs font-semibold uppercase mb-1">Song Title</p>
              <p class="text-gray-900 dark:text-slate-100 text-base sm:text-lg md:text-xl font-bold line-clamp-2 break-words">{{ radioStore.currentSongData.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Player Controls -->
    <div class="px-3 sm:px-4 md:px-6">
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-200 dark:border-slate-700 shadow-lg">
        <div class="space-y-3 md:space-y-4">
          <audio
            ref="audioPlayer"
            :src="radioStore.currentStream"
            @play="onPlay"
            @pause="onPause"
            class="w-full"
            crossorigin="anonymous"
            preload="auto"
          ></audio>

          <div class="flex items-center justify-center space-x-3 md:space-x-4">
            <button
              @click="skipStation"
              class="p-3 md:p-3 hover:bg-blue-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-700 dark:text-slate-200 hover:text-gray-900 dark:hover:text-slate-100"
              title="Previous station"
            >
              <BackwardIcon class="w-5 md:w-6 h-5 md:h-6" />
            </button>

            <button
              @click="togglePlayback"
              class="p-3 md:p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full transition-all shadow-lg"
            >
              <component
                :is="radioStore.isPlaying ? PauseIcon : PlayIcon"
                class="w-6 md:w-7 h-6 md:h-7 text-white"
              />
            </button>

            <button
              @click="nextStation"
              class="p-3 md:p-3 hover:bg-blue-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-700 dark:text-slate-200 hover:text-gray-900 dark:hover:text-slate-100"
              title="Next station"
            >
              <ForwardIcon class="w-5 md:w-6 h-5 md:h-6" />
            </button>
          </div>

          <div class="text-center text-gray-600 dark:text-slate-300 text-xs sm:text-sm font-medium">
            {{ radioStore.isPlaying ? 'Playing' : 'Paused' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Stations Grid -->
    <div class="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
      <div class="mb-4 md:mb-6">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3 md:mb-4">All Stations</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
          <StationCard
            v-for="station in radioStore.stations"
            :key="station.id"
            :station="station"
          />
        </div>
      </div>
    </div>

    <!-- Preferred Stations -->
    <div class="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-200 dark:border-slate-700 shadow-lg">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3 md:mb-4 flex items-center space-x-2">
          <HandThumbDownIcon class="w-5 h-5" />
          <span>Preferred Stations</span>
        </h3>

        <div class="space-y-3 md:space-y-4">
          <p class="text-gray-600 dark:text-slate-300 text-xs sm:text-sm">When a disliked song plays, skip through these stations in order:</p>
          
          <div class="space-y-2">
            <div v-if="radioStore.preferredStations.length > 0" class="space-y-2">
              <div class="text-gray-700 dark:text-slate-200 text-xs sm:text-sm font-medium">Priority Order ({{ radioStore.preferredStations.length }}):</div>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <div
                  v-for="(stationId, index) in radioStore.preferredStations"
                  :key="stationId"
                  class="bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 rounded-lg p-2.5 sm:p-3 flex items-center justify-between"
                >
                  <div class="flex items-center space-x-3 flex-1 min-w-0">
                    <span class="bg-blue-500 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold flex-shrink-0">{{ index + 1 }}</span>
                    <span class="text-gray-900 dark:text-slate-100 text-sm sm:text-base font-medium truncate">{{ radioStore.stations.find(s => s.id === stationId)?.name }}</span>
                  </div>
                  <button
                    @click="radioStore.togglePreferredStation(stationId)"
                    class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors flex-shrink-0"
                  >
                    <XMarkIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-600 dark:text-slate-400 text-sm italic">
              No preferred stations selected
            </div>
          </div>

          <div class="border-t border-blue-200 dark:border-slate-700 pt-4">
            <p class="text-gray-600 dark:text-slate-300 text-xs sm:text-sm mb-3">Add stations to priority list:</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="station in radioStore.stations"
                :key="station.id"
                @click="radioStore.togglePreferredStation(station.id)"
                :class="[
                  'px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap',
                  radioStore.isPreferredStation(station.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-100 hover:bg-gray-300 dark:hover:bg-slate-600'
                ]"
              >
                {{ station.shortName }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dislike Management -->
    <div class="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-200 dark:border-slate-700 shadow-lg">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3 md:mb-4 flex items-center space-x-2">
          <HandThumbDownIcon class="w-5 h-5" />
          <span>Dislike Management</span>
        </h3>

        <div class="space-y-3 md:space-y-4">
          <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <input
              v-model="dislikeInput"
              @keyup.enter="addDislike"
              type="text"
              placeholder="Enter artist name to skip..."
              class="flex-1 bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 rounded-lg px-3 sm:px-4 py-2 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm md:text-base"
            />
            <button
              @click="addDislike"
              class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-600 dark:to-red-700 text-white font-medium px-4 py-2 rounded-lg transition-all whitespace-nowrap text-sm"
            >
              Add
            </button>
          </div>

          <div v-if="radioStore.dislikes.length > 0" class="space-y-2">
            <div class="text-gray-700 dark:text-slate-200 text-xs sm:text-sm font-medium">Disliked Artists ({{ radioStore.dislikes.length }}):</div>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(dislike, index) in radioStore.dislikes"
                :key="index"
                class="bg-gray-200 dark:bg-slate-700 rounded-lg px-3 py-2 text-gray-800 dark:text-slate-100 text-xs sm:text-sm flex items-center justify-between space-x-2 group hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                <span class="truncate">{{ dislike }}</span>
                <button
                  @click="removeDislike(index)"
                  class="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 transition-colors flex-shrink-0"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-600 dark:text-slate-400 text-sm italic">
            No disliked artists yet
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRadioStore } from '../stores/radioStore'
import StationCard from '../components/StationCard.vue'
import {
  PlayIcon,
  PauseIcon,
  BackwardIcon,
  ForwardIcon,
  MusicalNoteIcon,
  SparklesIcon,
  HandThumbDownIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const radioStore = useRadioStore()
const audioPlayer = ref(null)
const dislikeInput = ref('')
let refreshInterval = null

const attemptPlay = async () => {
  if (!audioPlayer.value) return
  try {
    await audioPlayer.value.play()
    radioStore.isPlaying = true
  } catch (error) {
    radioStore.isPlaying = false
    console.error('Error playing audio:', error)
  }
}

const reloadStream = async (forcePlay = false) => {
  if (!audioPlayer.value) return
  audioPlayer.value.load()
  if (forcePlay || radioStore.isPlaying) {
    await attemptPlay()
  }
}

onMounted(async () => {
  radioStore.loadDislikes()
  radioStore.loadPreferences()
  
  // Fetch current song first (don't wait for all stations)
  radioStore.fetchCurrentSong()
  
  // Fetch all stations in background (non-blocking)
  radioStore.fetchAllStations()

  // Auto-play
  await nextTick()
  await reloadStream(true)

  // Refresh current song info every 15 seconds
  refreshInterval = setInterval(() => {
    radioStore.fetchCurrentSong()
  }, 15000)
  
  // Refresh all stations info every 30 seconds
  setInterval(() => {
    radioStore.fetchAllStations()
  }, 30000)
})

watch(
  () => radioStore.currentStream,
  async () => {
    await nextTick()
    await reloadStream()
  }
)

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
  if (audioPlayer.value) {
    audioPlayer.value.pause()
  }
})

const onPlay = () => {
  radioStore.isPlaying = true
}

const onPause = () => {
  radioStore.isPlaying = false
}

const togglePlayback = async () => {
  if (!audioPlayer.value) return

  if (radioStore.isPlaying) {
    audioPlayer.value.pause()
  } else {
    await reloadStream(true)
  }
}

const skipStation = () => {
  radioStore.skipStation()
}

const nextStation = () => {
  radioStore.skipStation()
}

const addDislike = () => {
  if (dislikeInput.value.trim()) {
    radioStore.addDislike(dislikeInput.value.trim())
    dislikeInput.value = ''
  }
}

const removeDislike = (index) => {
  radioStore.removeDislike(index)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
