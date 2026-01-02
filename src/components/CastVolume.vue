<template>
  <div v-if="isConnected" class="flex flex-col space-y-2 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 transition-all">
    <div class="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-slate-400">
      <span>Cast Volume</span>
      <span>{{ Math.round(volumeLevel * 100) }}%</span>
    </div>
    <div class="flex items-center space-x-2">
      <button 
        @click="toggleMute" 
        class="p-1 text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 focus:outline-none"
        :title="isMuted ? 'Unmute' : 'Mute'"
      >
        <SpeakerXMarkIcon v-if="isMuted" class="w-5 h-5" />
        <SpeakerWaveIcon v-else class="w-5 h-5" />
      </button>
      
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        :value="volumeLevel"
        @input="handleVolumeChange"
        class="flex-1 h-1.5 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500"
      />
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
import { ref, onMounted } from 'vue'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/vue/24/outline'

const isConnected = ref(false)
const volumeLevel = ref(0)
const isMuted = ref(false)

let player = null
let playerController = null

const initRemotePlayer = () => {
  if (typeof cast !== 'undefined' && cast.framework) {
    player = new cast.framework.RemotePlayer()
    playerController = new cast.framework.RemotePlayerController(player)

    playerController.addEventListener(
      cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
      () => {
        isConnected.value = player.isConnected
      }
    )

    playerController.addEventListener(
      cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED,
      () => {
        volumeLevel.value = player.volumeLevel
      }
    )

    playerController.addEventListener(
      cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED,
      () => {
        isMuted.value = player.isMuted
      }
    )
    
    // Initial state
    isConnected.value = player.isConnected
    if (player.isConnected) {
      volumeLevel.value = player.volumeLevel
      isMuted.value = player.isMuted
    }
  }
}

const handleVolumeChange = (event) => {
  const newVolume = parseFloat(event.target.value)
  volumeLevel.value = newVolume
  if (player && playerController) {
    player.volumeLevel = newVolume
    playerController.setVolumeLevel()
  }
}

const toggleMute = () => {
  if (player && playerController) {
    playerController.muteOrUnmute()
  }
}

onMounted(() => {
  // Try to initialize immediately or wait a bit for the SDK to be ready
  initRemotePlayer()
  setTimeout(initRemotePlayer, 1000)
})
</script>