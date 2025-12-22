<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="space-y-4 md:space-y-6">
    <!-- Now Playing Section -->
    <div v-if="radioStore.currentSongData.artist" class="px-4 md:px-6 pt-4 md:pt-6">
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 md:p-8 border border-blue-200 shadow-lg">
        <div class="text-blue-600 text-xs md:text-sm font-semibold uppercase tracking-wider mb-4">
          Now Playing
        </div>
        <h2 class="text-2xl md:text-4xl font-bold text-gray-900 mb-2 line-clamp-2">
          {{ radioStore.currentStationName || 'Loading...' }}
        </h2>
        <div class="space-y-2 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-blue-200">
          <div class="flex items-start space-x-3 md:space-x-4">
            <div class="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <MusicalNoteIcon class="w-5 md:w-6 h-5 md:h-6 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-blue-600 text-xs font-semibold uppercase mb-1">Artist</p>
              <p class="text-gray-900 text-lg md:text-xl font-bold line-clamp-2 break-words">{{ radioStore.currentSongData.artist }}</p>
            </div>
          </div>
          <div class="flex items-start space-x-3 md:space-x-4">
            <div class="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <SparklesIcon class="w-5 md:w-6 h-5 md:h-6 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-blue-600 text-xs font-semibold uppercase mb-1">Song Title</p>
              <p class="text-gray-900 text-lg md:text-xl font-bold line-clamp-2 break-words">{{ radioStore.currentSongData.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Player Controls -->
    <div class="px-4 md:px-6">
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 md:p-6 border border-blue-200 shadow-lg">
        <div class="space-y-4">
          <audio
            ref="audioPlayer"
            :src="radioStore.currentStream"
            @play="onPlay"
            @pause="onPause"
            class="w-full"
            crossorigin="anonymous"
          ></audio>

          <div class="flex items-center justify-center space-x-2 md:space-x-4">
            <button
              @click="skipStation"
              class="p-2 md:p-3 hover:bg-blue-200 rounded-lg transition-colors text-gray-700 hover:text-gray-900"
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
              class="p-2 md:p-3 hover:bg-blue-200 rounded-lg transition-colors text-gray-700 hover:text-gray-900"
              title="Next station"
            >
              <ForwardIcon class="w-5 md:w-6 h-5 md:h-6" />
            </button>
          </div>

          <div class="text-center text-gray-600 text-sm font-medium">
            {{ radioStore.isPlaying ? 'Playing' : 'Paused' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Stations Grid -->
    <div class="px-4 md:px-6 pb-4 md:pb-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">All Stations</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <StationCard
            v-for="station in radioStore.stations"
            :key="station.id"
            :station="station"
            @select="onStationSelected"
          />
        </div>
      </div>
    </div>

    <!-- Preferred Stations -->
    <div class="px-4 md:px-6 pb-4 md:pb-6">
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 md:p-6 border border-blue-200 shadow-lg">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <HandThumbDownIcon class="w-5 h-5" />
          <span>Preferred Stations</span>
        </h3>

        <div class="space-y-4">
          <p class="text-gray-600 text-sm">When a disliked song plays, skip through these stations in order:</p>
          
          <div class="space-y-2">
            <div v-if="radioStore.preferredStations.length > 0" class="space-y-2">
              <div class="text-gray-700 text-sm font-medium">Priority Order ({{ radioStore.preferredStations.length }}):</div>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <div
                  v-for="(stationId, index) in radioStore.preferredStations"
                  :key="stationId"
                  class="bg-white border border-blue-200 rounded-lg p-3 flex items-center justify-between"
                >
                  <div class="flex items-center space-x-3 flex-1 min-w-0">
                    <span class="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">{{ index + 1 }}</span>
                    <span class="text-gray-900 font-medium truncate">{{ radioStore.stations.find(s => s.id === stationId)?.name }}</span>
                  </div>
                  <button
                    @click="radioStore.togglePreferredStation(stationId)"
                    class="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                  >
                    <XMarkIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-600 text-sm italic">
              No preferred stations selected
            </div>
          </div>

          <div class="border-t border-blue-200 pt-4">
            <p class="text-gray-600 text-sm mb-3">Add stations to priority list:</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="station in radioStore.stations"
                :key="station.id"
                @click="radioStore.togglePreferredStation(station.id)"
                :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                  radioStore.isPreferredStation(station.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
    <div class="px-4 md:px-6 pb-4 md:pb-6">
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 md:p-6 border border-blue-200 shadow-lg">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <HandThumbDownIcon class="w-5 h-5" />
          <span>Dislike Management</span>
        </h3>

        <div class="space-y-4">
          <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <input
              v-model="dislikeInput"
              @keyup.enter="addDislike"
              type="text"
              placeholder="Enter artist name to skip..."
              class="flex-1 bg-white border border-blue-200 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm md:text-base"
            />
            <button
              @click="addDislike"
              class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-4 py-2 rounded-lg transition-all whitespace-nowrap"
            >
              Add
            </button>
          </div>

          <div v-if="radioStore.dislikes.length > 0" class="space-y-2">
            <div class="text-gray-700 text-sm font-medium">Disliked Artists ({{ radioStore.dislikes.length }}):</div>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(dislike, index) in radioStore.dislikes"
                :key="index"
                class="bg-gray-200 rounded-lg px-3 py-2 text-gray-800 text-sm flex items-center justify-between space-x-2 group hover:bg-red-200 transition-colors"
              >
                <span class="truncate">{{ dislike }}</span>
                <button
                  @click="removeDislike(index)"
                  class="text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-600 text-sm italic">
            No disliked artists yet
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
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

onMounted(async () => {
  radioStore.loadDislikes()
  radioStore.loadPreferences()
  
  // Fetch current song first (don't wait for all stations)
  radioStore.fetchCurrentSong()
  
  // Fetch all stations in background (non-blocking)
  radioStore.fetchAllStations()

  // Auto-play
  if (audioPlayer.value) {
    audioPlayer.value.play().catch(() => {
      // Browser may block autoplay, this is expected
    })
    radioStore.isPlaying = true
  }

  // Refresh current song info every 15 seconds
  refreshInterval = setInterval(() => {
    radioStore.fetchCurrentSong()
  }, 15000)
  
  // Refresh all stations info every 30 seconds
  setInterval(() => {
    radioStore.fetchAllStations()
  }, 30000)
})

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
    try {
      await audioPlayer.value.play()
      radioStore.isPlaying = true
    } catch (error) {
      console.error('Error playing audio:', error)
    }
  }
}

const skipStation = () => {
  radioStore.skipStation()
  if (audioPlayer.value && radioStore.isPlaying) {
    audioPlayer.value.load()
    audioPlayer.value.play().catch(() => {})
  }
}

const nextStation = () => {
  radioStore.currentStationIndex = (radioStore.currentStationIndex + 1) % radioStore.stations.length
  radioStore.fetchCurrentSong()
  if (audioPlayer.value && radioStore.isPlaying) {
    audioPlayer.value.load()
    audioPlayer.value.play().catch(() => {})
  }
}

const onStationSelected = () => {
  if (audioPlayer.value && radioStore.isPlaying) {
    audioPlayer.value.load()
    audioPlayer.value.play().catch(() => {})
  }
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
