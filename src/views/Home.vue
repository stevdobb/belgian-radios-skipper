<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="space-y-4 md:space-y-6 pb-4 md:pb-6">
    <!-- Now Playing Section -->
    <div v-if="radioStore.currentStation" class="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-8 border border-blue-200 dark:border-slate-700 shadow-lg">
        <div class="flex items-center justify-between gap-3 mb-3 md:mb-4">
          <div class="text-blue-600 dark:text-blue-300 text-xs md:text-sm font-semibold uppercase tracking-wider">
            Now Playing
          </div>
          <button
            @click="togglePlayback"
            class="p-2 sm:p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full transition-all shadow-lg"
            title="Play/Pause"
          >
            <component
              :is="radioStore.isPlaying ? PauseIcon : PlayIcon"
              class="w-4 h-4 sm:w-5 sm:h-5 text-white"
            />
          </button>
        </div>
        
        <div class="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <!-- Album Art -->
          <div v-if="albumArt" class="flex-shrink-0">
            <img :src="albumArt" alt="Album Art" class="w-40 h-40 rounded-xl shadow-lg object-cover bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700" />
          </div>

          <div class="flex-1 min-w-0 w-full text-center md:text-left">
            <h2 class="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2 line-clamp-2">
              {{ radioStore.currentStationName || 'Loading...' }}
            </h2>
            <div v-if="radioStore.isSkipping" class="mb-2">
              <span class="inline-flex items-center gap-2 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-medium">
                Skipping — {{ radioStore.stations[radioStore.originalStationIndex]?.shortName || 'orig' }}
              </span>
            </div>
            <div class="space-y-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-200 dark:border-slate-700">
              <template v-if="currentSongInfo.artist || currentSongInfo.title">
                <div class="flex items-start space-x-3 md:space-x-4 text-left">
                  <div class="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MusicalNoteIcon class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-blue-600 dark:text-blue-300 text-xs font-semibold uppercase mb-1">Artist</p>
                    <Transition name="slide-fade" mode="out-in">
                      <p 
                        :key="currentSongInfo.artist"
                        class="text-gray-900 dark:text-slate-100 text-base sm:text-lg md:text-xl font-bold line-clamp-2 break-words"
                      >
                        {{ currentSongInfo.artist || 'Unknown Artist' }}
                      </p>
                    </Transition>
                  </div>
                </div>
                <div class="flex items-start space-x-3 md:space-x-4 text-left">
                  <div class="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <SparklesIcon class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-blue-600 dark:text-blue-300 text-xs font-semibold uppercase mb-1">Song Title</p>
                    <Transition name="slide-fade" mode="out-in">
                      <p 
                        :key="currentSongInfo.title"
                        class="text-gray-900 dark:text-slate-100 text-base sm:text-lg md:text-xl font-bold line-clamp-2 break-words"
                      >
                        {{ currentSongInfo.title || 'Unknown Title' }}
                      </p>
                    </Transition>
                  </div>
                </div>
              </template>
              <div v-else class="text-gray-600 dark:text-slate-300 text-sm italic">
                No song info available
              </div>
            </div>
          </div>
        </div>

          <!-- Inline Player Controls moved into Now Playing -->
          <div class="mt-4 pt-3 border-t border-blue-200 dark:border-slate-700">
            <audio
              ref="audioPlayer"
              :src="radioStore.currentStream"
              @play="onPlay"
              @pause="onPause"
              class="w-full"
              crossorigin="anonymous"
              preload="auto"
            ></audio>

            <div class="flex flex-col md:flex-row items-center md:items-center justify-between gap-3 mt-3">
              <div class="flex items-center space-x-3">
                <button
                  @click="skipStation"
                  class="p-2 md:p-2 hover:bg-blue-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-700 dark:text-slate-200 hover:text-gray-900 dark:hover:text-slate-100"
                  title="Previous station"
                >
                  <BackwardIcon class="w-5 h-5" />
                </button>

                <button
                  @click="togglePlayback"
                  class="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full transition-all shadow-lg"
                >
                  <component
                    :is="radioStore.isPlaying ? PauseIcon : PlayIcon"
                    class="w-6 h-6 text-white"
                  />
                </button>

                <button
                  @click="nextStation"
                  class="p-2 md:p-2 hover:bg-blue-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-700 dark:text-slate-200 hover:text-gray-900 dark:hover:text-slate-100"
                  title="Next station"
                >
                  <ForwardIcon class="w-5 h-5" />
                </button>
              </div>

              <div class="flex items-center space-x-3">
                <SpeakerWaveIcon class="w-4 h-4 text-gray-500 dark:text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  v-model="volume"
                  @input="updateVolume"
                  class="w-36 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500"
                />
                <div class="text-gray-600 dark:text-slate-300 text-sm font-medium">
                  {{ radioStore.isPlaying ? 'Playing' : 'Paused' }}
                </div>
                <button
                  v-if="isCastAvailable"
                  @click="startCasting"
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-gray-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  title="Cast to device"
                >
                  <SignalIcon class="w-4 h-4" />
                  <span class="text-sm">{{ isCasting ? 'Casting' : 'Cast' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- Stations Grid -->
    <div class="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
      <div class="mb-4 md:mb-6">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3 md:mb-4">All Stations</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <StationCard
            v-for="station in radioStore.stations"
            :key="station.id"
            :station="station"
          />
        </div>
      </div>
    </div>

    <!-- Preferred Stations + Dislike Management (responsive two-column on large screens) -->
    <div class="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-200 dark:border-slate-700 shadow-lg h-full">
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

        <div>
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-200 dark:border-slate-700 shadow-lg h-full">
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
    </div>
  </div>
  <!-- Toasts -->
  <div class="fixed bottom-4 right-4 flex flex-col items-end space-y-2 z-50">
    <TransitionGroup name="toast" tag="div">
      <div v-for="(toast, idx) in toasts" :key="toast.id" class="max-w-xs w-full" :style="{ transitionDelay: `${idx * 60}ms` }">
        <div :class="[
          'px-3 py-2 rounded-lg shadow-md text-sm transform-gpu',
          toast.type === 'error' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
          toast.type === 'warn' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
          toast.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
          'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100'
        ]">
          {{ toast.message }}
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useRadioStore } from '../stores/radioStore'
import StationCard from '../components/StationCard.vue'
import {
  PlayIcon,
  PauseIcon,
  BackwardIcon,
  ForwardIcon,
  MusicalNoteIcon,
  SparklesIcon,
  SignalIcon,
  HandThumbDownIcon,
  XMarkIcon,
  SpeakerWaveIcon
} from '@heroicons/vue/24/outline'

const radioStore = useRadioStore()
const audioPlayer = ref(null)
const dislikeInput = ref('')
let refreshInterval = null
let castInitTimer = null
let castContext = null
let remotePlayer = null
let remotePlayerController = null
let originalCheckInterval = null
const isCastAvailable = ref(false)
const isCasting = ref(false)
const volume = ref(1)

const currentSongInfo = computed(() => {
  const station = radioStore.stations.find(s => s.id === radioStore.currentStation?.id)
  return station?.songInfo || {}
})

const albumArt = computed(() => {
  return currentSongInfo.value?.albumArt
})

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

// Toasts
const toasts = ref([])
const pushToast = (message, type = 'info') => {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx > -1) toasts.value.splice(idx, 1)
  }, 4000)
}

// Watch telemetry for notable events and show toasts
watch(() => radioStore.telemetry.slice(0, 5), (newVal, oldVal) => {
  if (!oldVal || newVal.length === 0) return
  const latest = newVal[0]
  if (!latest) return
  if (['skip','return','cast_session','cast_error','skip_disabled'].includes(latest.type)) {
    const msgMap = {
      skip: 'Skipping to preferred station',
      return: 'Returning to original station',
      cast_session: 'Cast session changed',
      cast_error: 'Cast error',
      skip_disabled: 'Skipping disabled'
    }
    pushToast(msgMap[latest.type] || latest.message)
  }
}, { deep: true })

const buildCastMetadata = () => {
  if (!window.chrome?.cast?.media) return null
  const metadata = new window.chrome.cast.media.MusicTrackMediaMetadata()
  metadata.title = currentSongInfo.value.title || radioStore.currentStationName || 'Belgian Radio'
  metadata.artist = currentSongInfo.value.artist || radioStore.currentStationName || 'VRT'
  metadata.albumName = radioStore.currentStationName || 'Belgian Radio'
  if (currentSongInfo.value.albumArt) {
    metadata.images = [new window.chrome.cast.Image(currentSongInfo.value.albumArt)]
  }
  return metadata
}

const updateCastMetadata = () => {
  if (!castContext || typeof window === 'undefined') return
  const session = castContext.getCurrentSession()
  const mediaSession = session?.getMediaSession()
  if (!mediaSession || !mediaSession.media) return
  const metadata = buildCastMetadata()
  if (!metadata) return
  // Avoid reloading the media on metadata changes to prevent audio interruptions.
  mediaSession.media.metadata = metadata
}

const loadCastStream = async (autoplay = true) => {
  if (!castContext || typeof window === 'undefined') return
  const session = castContext.getCurrentSession()
  if (!session || !window.chrome?.cast?.media) return

  const mediaInfo = new window.chrome.cast.media.MediaInfo(radioStore.currentStream, 'audio/mpeg')
  const metadata = buildCastMetadata()
  if (metadata) {
    mediaInfo.metadata = metadata
  }

  const request = new window.chrome.cast.media.LoadRequest(mediaInfo)
  request.autoplay = autoplay

  try {
    await session.loadMedia(request)
    radioStore.isPlaying = autoplay
  } catch (error) {
    console.error('Error casting media:', error)
    radioStore.logTelemetry('cast_error', String(error?.message || error))
  }
}

const reloadStream = async (forcePlay = false) => {
  if (isCasting.value) {
    await loadCastStream(forcePlay || radioStore.isPlaying)
    return
  }
  if (!audioPlayer.value) return
  audioPlayer.value.load()
  if (forcePlay || radioStore.isPlaying) {
    await attemptPlay()
  }
}

const setupCastController = () => {
  if (!window.cast?.framework) return
  if (remotePlayer && remotePlayerController) return
  remotePlayer = new window.cast.framework.RemotePlayer()
  remotePlayerController = new window.cast.framework.RemotePlayerController(remotePlayer)
  remotePlayerController.addEventListener(
    window.cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,
    () => {
      if (!isCasting.value) return
      radioStore.isPlaying = !remotePlayer.isPaused
    }
  )
}

const startCasting = async () => {
  if (!castContext) return
  try {
    await castContext.requestSession()
  } catch (error) {
    console.error('Cast session request failed:', error)
    radioStore.logTelemetry('cast_session_error', String(error?.message || error))
  }
}

const toggleCastPlayback = async () => {
  const session = castContext?.getCurrentSession()
  if (!session) {
    await startCasting()
    return
  }

  const mediaSession = session.getMediaSession()
  if (!mediaSession) {
    await loadCastStream(true)
    return
  }

  const isPlaying = mediaSession.playerState === window.chrome?.cast?.media?.PlayerState?.PLAYING
  if (isPlaying) {
    mediaSession.pause(null, () => {
      radioStore.isPlaying = false
    }, (error) => {
      console.error('Error pausing cast:', error)
      radioStore.logTelemetry('cast_pause_error', String(error?.message || error))
    })
  } else {
    mediaSession.play(null, () => {
      radioStore.isPlaying = true
    }, (error) => {
      console.error('Error playing cast:', error)
      radioStore.logTelemetry('cast_play_error', String(error?.message || error))
    })
  }
}

const initializeCast = () => {
  if (typeof window === 'undefined') return false
  if (!window.cast?.framework || !window.chrome?.cast) return false

  castContext = window.cast.framework.CastContext.getInstance()
  castContext.setOptions({
    receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
    autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
  })

  castContext.addEventListener(
    window.cast.framework.CastContextEventType.CAST_STATE_CHANGED,
    (event) => {
      isCastAvailable.value = event.castState !== window.cast.framework.CastState.NO_DEVICES_AVAILABLE
    }
  )

  castContext.addEventListener(
    window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
    (event) => {
      const { SessionState } = window.cast.framework
      if (event.sessionState === SessionState.SESSION_STARTED || event.sessionState === SessionState.SESSION_RESUMED) {
        isCasting.value = true
        setupCastController()
        if (audioPlayer.value) {
          audioPlayer.value.pause()
        }
        loadCastStream(radioStore.isPlaying)
        radioStore.logTelemetry('cast_session', 'started')
      } else if (
        event.sessionState === SessionState.SESSION_ENDED ||
        event.sessionState === SessionState.SESSION_START_FAILED
      ) {
        isCasting.value = false
        remotePlayer = null
        remotePlayerController = null
        radioStore.logTelemetry('cast_session', 'ended')
      }
    }
  )

  return true
}

onMounted(async () => {
  radioStore.loadDislikes()
  radioStore.loadPreferences()
  radioStore.loadTelemetry()
  radioStore.loadSkipHistory()
  
  // Fetch current song first (don't wait for all stations)
  radioStore.fetchCurrentSong()
  
  // Fetch all stations in background (non-blocking)
  radioStore.fetchAllStations()

  // Auto-play
  await nextTick()
  if (radioStore.autoPlay) {
    await reloadStream(true)
  }

  // Refresh current song info every 15 seconds
  refreshInterval = setInterval(() => {
    radioStore.fetchCurrentSong()
  }, 10000)
  
  // Adaptive full-stations refresh: every 10s while skipping, otherwise every 30s
  let lastFullFetch = Date.now()
  setInterval(() => {
    const now = Date.now()
    const shouldFetch = radioStore.isSkipping || (now - lastFullFetch) > 30000
    if (shouldFetch) {
      radioStore.fetchAllStations()
      lastFullFetch = now
    }
  }, 10000)

  // Monitor original station more frequently while skipping (only check when skipping)
  originalCheckInterval = setInterval(() => {
    if (radioStore.isSkipping) {
      radioStore.checkOriginalStation()
    }
  }, 5000)

  if (!initializeCast()) {
    window.__onGCastApiAvailable = (isAvailable) => {
      if (isAvailable) {
        initializeCast()
      }
    }
    castInitTimer = setInterval(() => {
      if (initializeCast()) {
        clearInterval(castInitTimer)
        castInitTimer = null
      }
    }, 500)
  }
})

watch(
  () => radioStore.currentStream,
  async () => {
    await nextTick()
    await reloadStream()
  }
)

watch(
  () => [currentSongInfo.value.artist, currentSongInfo.value.title, currentSongInfo.value.albumArt],
  async () => {
    if (!isCasting.value) return
    const session = castContext?.getCurrentSession()
    const mediaSession = session?.getMediaSession()
    if (!mediaSession) {
      await loadCastStream(radioStore.isPlaying)
      return
    }
    updateCastMetadata()
  }
)

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
  if (castInitTimer) {
    clearInterval(castInitTimer)
  }
    if (originalCheckInterval) {
      clearInterval(originalCheckInterval)
    }
  if (audioPlayer.value) {
    audioPlayer.value.pause()
  }
})

const onPlay = () => {
  if (!isCasting.value) {
    radioStore.isPlaying = true
  }
}

const onPause = () => {
  if (!isCasting.value) {
    radioStore.isPlaying = false
  }
}

const togglePlayback = async () => {
  if (isCasting.value) {
    await toggleCastPlayback()
    return
  }
  if (!audioPlayer.value) return

  if (radioStore.isPlaying) {
    audioPlayer.value.pause()
  } else {
    await reloadStream(true)
  }
}

const updateVolume = () => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value
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

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.toast-enter-from, .toast-leave-to {
  transform: translateX(12px) scale(.98);
  opacity: 0;
}
.toast-enter-to, .toast-leave-from {
  transform: translateX(0) scale(1);
  opacity: 1;
}
.toast-enter-active, .toast-leave-active {
  transition: transform 280ms cubic-bezier(.2,.8,.2,1), opacity 280ms cubic-bezier(.2,.8,.2,1);
}
</style>
