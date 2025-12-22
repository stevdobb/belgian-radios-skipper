import { defineStore } from 'pinia'
import axios from 'axios'

export const useRadioStore = defineStore('radio', {
  state: () => ({
    stations: [
      {
        id: 0,
        name: 'Studio Brussel',
        shortName: 'Stubru',
        stream: 'https://vrt.streamabc.net/vrt-studiobrussel-mp3-128-4409118',
        endpoint: 'https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-stubru',
        color: 'from-blue-500 to-blue-700',
        icon: 'music'
      },
      {
        id: 1,
        name: 'MNM',
        shortName: 'MNM',
        stream: 'https://vrt.streamabc.net/vrt-mnm-mp3-128-9205274',
        endpoint: 'https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-mnm',
        color: 'from-purple-500 to-purple-700',
        icon: 'microphone'
      },
      {
        id: 2,
        name: 'Bruut',
        shortName: 'Bruut',
        stream: 'https://vrt.streamabc.net/vrt-zwaregitaren-mp3-128-2689110',
        endpoint: 'https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-stubrubruut',
        color: 'from-red-500 to-red-700',
        icon: 'heart'
      },
      {
        id: 3,
        name: 'Vuurland',
        shortName: 'Vuurland',
        stream: 'https://vrt.streamabc.net/vrt-stubruvuurland-mp3-128-1929329',
        endpoint: 'https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-stubru-vuurland',
        color: 'from-orange-500 to-orange-700',
        icon: 'flame'
      }
    ],
    currentStationIndex: 0,
    originalStationIndex: 0,
    isPlaying: false,
    dislikes: ['Freek', 'Toerist Le MC', 'Bazart', 'Milow', 'Metejoor'],
    preferredStations: [],
    currentSongData: {
      artist: null,
      title: null
    },
    stationSongData: {},
    songChangedTimeout: null,
    streamNonce: 0
  }),

  getters: {
    currentStation: (state) => state.stations[state.currentStationIndex],
    currentStationName: (state) => state.stations[state.currentStationIndex]?.name || '',
    currentStream: (state) => {
      const stream = state.stations[state.currentStationIndex].stream
      const separator = stream.includes('?') ? '&' : '?'
      return `${stream}${separator}t=${state.streamNonce}`
    },
    currentSongInfo: (state) => state.currentSongData,
    getStationSongInfo: (state) => (stationId) => state.stationSongData[stationId] || { artist: null, title: null },
    isDiskliked: (state) => (artist, title) => {
      const normalize = (value) => (value || '').toLowerCase()
      const artistValue = normalize(artist)
      const titleValue = normalize(title)
      return state.dislikes.some((dislike) => {
        const needle = normalize(dislike)
        return needle && (artistValue.includes(needle) || titleValue.includes(needle))
      })
    },
    orderedPreferredStations: (state) => state.preferredStations.map(id => state.stations.find(s => s.id === id)).filter(Boolean),
    isPreferredStation: (state) => (stationId) => state.preferredStations.includes(stationId)
  },

  actions: {
    selectStation(index) {
      this.originalStationIndex = index
      this.currentStationIndex = index
      this.isPlaying = true
      this.currentSongData = { artist: null, title: null }
      this.streamNonce += 1
      this.fetchCurrentSong()
    },

    async fetchCurrentSong() {
      try {
        const station = this.currentStation
        const response = await axios.get(station.endpoint)
        const songData = this.findKeyValueInObject(response.data, 'nowOnAirItem')

        if (songData) {
          const rawArtist = songData.artist || songData.author || null
          const rawTitle = songData.title || songData.program?.title || songData.broadcast?.title || null
          const displayArtist = rawArtist || 'Unknown Artist'
          const displayTitle = rawTitle || 'Unknown Title'

          this.currentSongData = {
            artist: displayArtist,
            title: displayTitle
          }

          if (this.isDiskliked(rawArtist, rawTitle)) {
            this.isPlaying = true
            if (this.preferredStations.length > 0) {
              this.skipToNextPreferred()
            } else {
              this.skipStation()
            }
          }
        } else {
          this.currentSongData = { artist: null, title: null }
        }
      } catch (error) {
        console.error('Error fetching current song:', error)
        this.currentSongData = { artist: null, title: null }
      }
    },

    async fetchAllStations() {
      try {
        const promises = this.stations.map(station =>
          axios.get(station.endpoint)
            .then(response => {
              const songData = this.findKeyValueInObject(response.data, 'nowOnAirItem')
              if (songData && songData.title) {
                this.stationSongData[station.id] = {
                  artist: songData.artist || 'Unknown Artist',
                  title: songData.title || 'Unknown Title'
                }
              }
            })
            .catch(error => {
              console.error(`Error fetching data for station ${station.id}:`, error)
            })
        )
        await Promise.all(promises)
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
      this.currentSongData = { artist: null, title: null }
      this.streamNonce += 1
      this.fetchCurrentSong()
    },

    skipToNextPreferred() {
      if (this.preferredStations.length === 0) {
        this.skipStation()
        return
      }

      const currentIndex = this.preferredStations.indexOf(this.currentStationIndex)
      let nextIndex = (currentIndex + 1) % this.preferredStations.length
      this.currentStationIndex = this.preferredStations[nextIndex]
      this.currentSongData = { artist: null, title: null }
      this.streamNonce += 1
      this.fetchCurrentSong()
    },

    returnToOriginalStation() {
      this.currentStationIndex = this.originalStationIndex
      this.currentSongData = { artist: null, title: null }
      this.streamNonce += 1
      this.fetchCurrentSong()
    },

    togglePreferredStation(stationId) {
      const index = this.preferredStations.indexOf(stationId)
      if (index > -1) {
        this.preferredStations.splice(index, 1)
      } else {
        this.preferredStations.push(stationId)
      }
      this.savePreferences()
    },

    reorderPreferredStations(newOrder) {
      this.preferredStations = newOrder
      this.savePreferences()
    },

    savePreferences() {
      localStorage.setItem('preferredStations', JSON.stringify(this.preferredStations))
    },

    loadPreferences() {
      const saved = localStorage.getItem('preferredStations')
      if (saved) {
        this.preferredStations = JSON.parse(saved)
      }
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
