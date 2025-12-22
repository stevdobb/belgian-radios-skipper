import { defineStore } from 'pinia'
import axios from 'axios'

export const useRadioStore = defineStore('radio', {
  state: () => ({
    stations: [
      {
        id: 0,
        name: 'Studio Brussel',
        shortName: 'Stubru',
        stream: 'https://vrt.streamabc.net/vrt-studiobrussel-mp3-128-4409118?sABC=6949235o%230%23p852498102q7413s32s696rr8435r1pq%23&aw_0_1st.playerid=&amsparams=playerid:;skey:1766400859',
        endpoint: 'https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-stubru',
        color: 'from-blue-500 to-blue-700',
        icon: 'music'
      },
      {
        id: 1,
        name: 'MNM',
        shortName: 'MNM',
        stream: 'https://vrt.streamabc.net/vrt-mnm-mp3-128-9205274?sABC=6949239n%230%23p852498102q7413s32s696rr8435r1pq%23&aw_0_1st.playerid=&amsparams=playerid:;skey:1766400922',
        endpoint: 'https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-mnm',
        color: 'from-purple-500 to-purple-700',
        icon: 'microphone'
      },
      {
        id: 2,
        name: 'Bruut',
        shortName: 'Bruut',
        stream: 'https://vrt.streamabc.net/vrt-zwaregitaren-mp3-128-2689110?sABC=694923p3%230%23p852498102q7413s32s696rr8435r1pq%23&aw_0_1st.playerid=&amsparams=playerid:;skey:1766400963',
        endpoint: 'https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-stubrubruut',
        color: 'from-red-500 to-red-700',
        icon: 'heart'
      },
      {
        id: 3,
        name: 'Vuurland',
        shortName: 'Vuurland',
        stream: 'https://vrt.streamabc.net/vrt-stubruvuurland-mp3-128-1929329?sABC=694923r0%230%23p852498102q7413s32s696rr8435r1pq%23&aw_0_1st.playerid=&amsparams=playerid:;skey:1766400992',
        endpoint: 'https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-stubru-vuurland',
        color: 'from-orange-500 to-orange-700',
        icon: 'flame'
      }
    ],
    currentStationIndex: 0,
    isPlaying: false,
    dislikes: [],
    currentSongData: {
      artist: null,
      title: null
    },
    stationSongData: {}
  }),

  getters: {
    currentStation: (state) => state.stations[state.currentStationIndex],
    currentStream: (state) => state.stations[state.currentStationIndex].stream,
    currentSongInfo: (state) => state.currentSongData,
    getStationSongInfo: (state) => (stationId) => state.stationSongData[stationId] || { artist: null, title: null },
    isDiskliked: (state) => (artist) => state.dislikes.some(dislike => artist?.includes(dislike))
  },

  actions: {
    selectStation(index) {
      this.currentStationIndex = index
      this.isPlaying = true
      this.fetchCurrentSong()
    },

    async fetchCurrentSong() {
      try {
        const station = this.currentStation
        const response = await axios.get(station.endpoint)
        const songData = this.findKeyValueInObject(response.data, 'nowOnAirItem')

        if (songData && songData.title) {
          this.currentSongData = {
            artist: songData.artist || 'Unknown Artist',
            title: songData.title || 'Unknown Title'
          }

          if (this.isDiskliked(this.currentSongData.artist)) {
            this.skipStation()
          }
        }
      } catch (error) {
        console.error('Error fetching current song:', error)
      }
    },

    async fetchAllStations() {
      try {
        for (const station of this.stations) {
          try {
            const response = await axios.get(station.endpoint)
            const songData = this.findKeyValueInObject(response.data, 'nowOnAirItem')

            if (songData && songData.title) {
              this.stationSongData[station.id] = {
                artist: songData.artist || 'Unknown Artist',
                title: songData.title || 'Unknown Title'
              }
            }
          } catch (error) {
            console.error(`Error fetching data for ${station.name}:`, error)
          }
        }
      } catch (error) {
        console.error('Error fetching all stations:', error)
      }
    },

    addDislike(artist) {
      if (artist && !this.dislikes.includes(artist)) {
        this.dislikes.push(artist)
        this.saveDislikes()
      }
    },

    removeDislike(index) {
      this.dislikes.splice(index, 1)
      this.saveDislikes()
    },

    saveDislikes() {
      localStorage.setItem('dislikes', JSON.stringify(this.dislikes))
    },

    loadDislikes() {
      const savedDislikes = localStorage.getItem('dislikes')
      if (savedDislikes) {
        this.dislikes = JSON.parse(savedDislikes)
      }
    },

    skipStation() {
      this.currentStationIndex = (this.currentStationIndex + 1) % this.stations.length
      this.fetchCurrentSong()
    },

    togglePlayback() {
      this.isPlaying = !this.isPlaying
    },

    findKeyValueInObject(obj, key) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return obj[key]
      }
      for (const k in obj) {
        if (obj[k] !== null && typeof obj[k] === 'object') {
          const result = this.findKeyValueInObject(obj[k], key)
          if (result !== null) {
            return result
          }
        }
      }
      return null
    }
  }
})
