<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="space-y-6">
    <!-- Now Playing Section -->
    <div v-if="radioStore.currentSongData.artist" class="px-6 pt-6">
      <div class="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-8 border border-gray-600 shadow-2xl">
        <div class="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">
          Now Playing
        </div>
        <h2 class="text-4xl font-bold text-white mb-2 line-clamp-2">
          {{ radioStore.currentStationName || 'Loading...' }}
        </h2>
        <div class="space-y-2 mt-6 pt-6 border-t border-gray-600">
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <MusicalNoteIcon class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1">
              <p class="text-gray-400 text-xs font-semibold uppercase mb-1">Artist</p>
              <p class="text-white text-xl font-bold line-clamp-2">{{ radioStore.currentSongData.artist }}</p>
            </div>
          </div>
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <SparklesIcon class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1">
              <p class="text-gray-400 text-xs font-semibold uppercase mb-1">Song Title</p>
              <p class="text-white text-xl font-bold line-clamp-2">{{ radioStore.currentSongData.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Player Controls -->
    <div class="px-6">
      <div class="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600 shadow-lg">
        <div class="space-y-4">
          <audio
            ref="audioPlayer"
            :src="radioStore.currentStream"
            @play="onPlay"
            @pause="onPause"
            class="w-full"
            crossorigin="anonymous"
          ></audio>

          <div class="flex items-center justify-center space-x-4">
            <button
              @click="skipStation"
              class="p-3 hover:bg-gray-600 rounded-lg transition-colors text-gray-300 hover:text-white"
              title="Previous station"
            >
              <BackwardIcon class="w-6 h-6" />
            </button>

            <button
              @click="togglePlayback"
              class="p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full transition-all shadow-lg"
            >
              <component
                :is="radioStore.isPlaying ? PauseIcon : PlayIcon"
                class="w-6 h-6 text-white"
              />
            </button>

            <button
              @click="nextStation"
              class="p-3 hover:bg-gray-600 rounded-lg transition-colors text-gray-300 hover:text-white"
              title="Next station"
            >
              <ForwardIcon class="w-6 h-6" />
            </button>
          </div>

          <div class="text-center text-gray-400 text-sm font-medium">
            {{ radioStore.isPlaying ? 'Playing' : 'Paused' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Stations Grid -->
    <div class="px-6 pb-6">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-white mb-4">All Stations</h3>
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

    <!-- Dislike Management -->
    <div class="px-6 pb-6">
      <div class="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600 shadow-lg">
        <h3 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <HandThumbDownIcon class="w-5 h-5" />
          <span>Dislike Management</span>
        </h3>

        <div class="space-y-4">
          <div class="flex space-x-2">
            <input
              v-model="dislikeInput"
              @keyup.enter="addDislike"
              type="text"
              placeholder="Enter artist name to skip..."
              class="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            <button
              @click="addDislike"
              class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-4 py-2 rounded-lg transition-all"
            >
              Add
            </button>
          </div>

          <div v-if="radioStore.dislikes.length > 0" class="space-y-2">
            <div class="text-gray-400 text-sm font-medium">Disliked Artists ({{ radioStore.dislikes.length }}):</div>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(dislike, index) in radioStore.dislikes"
                :key="index"
                class="bg-gray-600 rounded-lg px-3 py-2 text-white text-sm flex items-center justify-between space-x-2 group hover:bg-red-600 transition-colors"
              >
                <span>{{ dislike }}</span>
                <button
                  @click="removeDislike(index)"
                  class="text-gray-300 hover:text-white transition-colors"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-400 text-sm italic">
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
  await radioStore.fetchCurrentSong()
  await radioStore.fetchAllStations()

  // Auto-play
  if (audioPlayer.value) {
    audioPlayer.value.play().catch(() => {
      // Browser may block autoplay, this is expected
    })
    radioStore.isPlaying = true
  }

  // Refresh song info every 10 seconds
  refreshInterval = setInterval(async () => {
    await radioStore.fetchCurrentSong()
    await radioStore.fetchAllStations()
  }, 10000)
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
