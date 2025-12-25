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
        icon: 'music',
        songInfo: { artist: null, title: null, albumArt: null }
      },
      {
        id: 1,
        name: 'MNM',
        shortName: 'MNM',
        stream: 'https://vrt.streamabc.net/vrt-mnm-mp3-128-9205274',
        endpoint: 'https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-mnm',
        color: 'from-purple-500 to-purple-700',
        icon: 'microphone',
        songInfo: { artist: null, title: null, albumArt: null }
      },
      {
        id: 2,
        name: 'Bruut',
        shortName: 'Bruut',
        stream: 'https://vrt.streamabc.net/vrt-zwaregitaren-mp3-128-2689110',
        endpoint: 'https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-stubrubruut',
        color: 'from-red-500 to-red-700',
        icon: 'heart',
        songInfo: { artist: null, title: null, albumArt: null }
      },
      {
        id: 3,
        name: 'Vuurland',
        shortName: 'Vuurland',
        stream: 'https://vrt.streamabc.net/vrt-stubruvuurland-mp3-128-1929329',
        endpoint: 'https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-stubru-vuurland',
        color: 'from-orange-500 to-orange-700',
        icon: 'flame',
        songInfo: { artist: null, title: null, albumArt: null }
      }
    ],
    currentStationIndex: 0,
    originalStationIndex: null,
    isPlaying: false,
    isSkipping: false,
    skipEnabled: true,
    skipAttemptCount: 0,
    maxPreferredSkips: null,
    autoPlay: false,
    dislikes: ['Metejoor', 'Freek', 'Toerist Le MC', 'Bazart', 'Milow', 'Maksim', 'Niels Destadsbader', 'Clouseau', 'Natalia', 'Laura Tesoro','Regi'],
    preferredStations: [],
    autoReturn: true,
    telemetry: [],
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
    currentSongInfo: (state) => state.stations[state.currentStationIndex]?.songInfo,
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
      // user-selected station becomes the baseline original station
      this.originalStationIndex = index
      this.isSkipping = false
      this.skipAttemptCount = 0
      this.currentStationIndex = index
      this.isPlaying = true
      if (this.currentStation) {
        this.currentStation.songInfo = { artist: null, title: null, albumArt: null }
      }
      this.streamNonce += 1
      this.fetchCurrentSong()
    },

    async fetchCurrentSong() {
      if (!this.currentStation) return

      try {
        const station = this.currentStation
        const response = await axios.get(station.endpoint)
        const scheduleItem = response.data.schedule?.find(item => item.nowOnAirItem)
        const songData = scheduleItem?.nowOnAirItem

        if (songData) {
          const rawArtist = songData.artist || songData.author
          const rawTitle = songData.title || songData.program?.title || songData.broadcast?.title
          
          const imageLinks = songData.imageLinks || songData.program?.imageLinks || songData.broadcast?.imageLinks || []
          const albumArt = 
            imageLinks.find(img => img.type === 'VRTMAX_RADIO_COVER')?.url ||
            imageLinks.find(img => img.type === 'SQUARE')?.url ||
            imageLinks.find(img => img.type === 'FULL_HD')?.url ||
            imageLinks[0]?.url

          station.songInfo = {
            artist: rawArtist,
            title: rawTitle,
            albumArt: albumArt
          }

          if (this.isDiskliked(rawArtist, rawTitle)) {
            if (!this.skipEnabled) {
              this.logTelemetry('skip_disabled', `Detected disliked ${rawArtist} - ${rawTitle} but skipping is disabled`)
            } else if (this.preferredStations.length > 0) {
              this.skipToNextPreferred()
            } else {
              this.skipStation()
            }
          }
        } else {
          station.songInfo = { artist: null, title: null, albumArt: null }
        }
      } catch (error) {
        console.error(`Error fetching song for ${this.currentStation.name}:`, error)
        if (this.currentStation) {
          this.currentStation.songInfo = { artist: null, title: null, albumArt: null }
        }
      }
    },

    async fetchAllStations() {
      const promises = this.stations.map(async (station) => {
        try {
          const response = await axios.get(station.endpoint)
          const scheduleItem = response.data.schedule?.find(item => item.nowOnAirItem)
          const songData = scheduleItem?.nowOnAirItem

          if (songData) {
            const rawArtist = songData.artist || songData.author
            const rawTitle = songData.title || songData.program?.title || songData.broadcast?.title

            const imageLinks = songData.imageLinks || songData.program?.imageLinks || songData.broadcast?.imageLinks || []
            const albumArt = 
              imageLinks.find(img => img.type === 'VRTMAX_RADIO_COVER')?.url ||
              imageLinks.find(img => img.type === 'SQUARE')?.url ||
              imageLinks.find(img => img.type === 'FULL_HD')?.url ||
              imageLinks[0]?.url

            station.songInfo = {
              artist: rawArtist,
              title: rawTitle,
              albumArt: albumArt
            }
          } else {
            station.songInfo = { artist: null, title: null, albumArt: null }
          }
        } catch (error) {
          console.error(`Error fetching data for station ${station.name}:`, error)
          station.songInfo = { artist: null, title: null, albumArt: null }
        }
      })
      await Promise.all(promises)

      // If we previously skipped from an original station, check whether that original station
      // is now playing a non-disliked song; if so, return to it.
      if (this.autoReturn && this.originalStationIndex !== undefined && this.originalStationIndex !== null && this.currentStationIndex !== this.originalStationIndex) {
        const original = this.stations[this.originalStationIndex]
        const artist = original?.songInfo?.artist
        const title = original?.songInfo?.title
        if (!this.isDiskliked(artist, title)) {
          this.returnToOriginalStation()
        }
      }
    },

    async checkOriginalStation() {
      if (this.originalStationIndex === undefined || this.originalStationIndex === null) return
      if (this.currentStationIndex === this.originalStationIndex) return

      const original = this.stations[this.originalStationIndex]
      if (!original || !original.endpoint) return

      try {
        const response = await axios.get(original.endpoint)
        const scheduleItem = response.data.schedule?.find(item => item.nowOnAirItem)
        const songData = scheduleItem?.nowOnAirItem

        const rawArtist = songData?.artist || songData?.author
        const rawTitle = songData?.title || songData?.program?.title || songData?.broadcast?.title

        if (!this.isDiskliked(rawArtist, rawTitle)) {
          if (this.autoReturn) this.returnToOriginalStation()
        }
      } catch (error) {
        console.error(`Error checking original station ${original.name}:`, error)
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
      if (this.currentStation) {
        this.currentStation.songInfo = { artist: null, title: null, albumArt: null }
      }
      this.streamNonce += 1
      this.fetchCurrentSong()
    },

    skipToNextPreferred() {
      if (this.preferredStations.length === 0) {
        this.skipStation()
        return
      }
      const currentStationId = this.currentStation?.id
      const currentIndex = this.preferredStations.indexOf(currentStationId)
      let nextIndex = (currentIndex + 1) % this.preferredStations.length
      const nextStationId = this.preferredStations[nextIndex]
      const nextStationIndex = this.stations.findIndex(s => s.id === nextStationId)

      // Remember original station index if we're starting a skip sequence
      if (this.originalStationIndex === undefined || this.originalStationIndex === null) {
        this.originalStationIndex = this.currentStationIndex
        this.skipAttemptCount = 0
      }
      this.isSkipping = true

      // increment attempt and check limit
      this.skipAttemptCount = (this.skipAttemptCount || 0) + 1
      const limit = this.maxPreferredSkips || this.preferredStations.length || Infinity
      if (this.skipAttemptCount > limit) {
        this.logTelemetry('skip_limit_reached', `reached limit ${limit}, returning to original`)
        this.skipAttemptCount = 0
        this.returnToOriginalStation()
        return
      }
      this.logTelemetry('skip', `attempt ${this.skipAttemptCount} skipping to stationId:${nextStationId}`)

      if (nextStationIndex > -1) {
        this.currentStationIndex = nextStationIndex
      } else {
        // fallback to next station by index if id lookup fails
        this.currentStationIndex = (this.currentStationIndex + 1) % this.stations.length
      }

      if (this.currentStation) {
        this.currentStation.songInfo = { artist: null, title: null, albumArt: null }
      }
      this.streamNonce += 1
      this.fetchCurrentSong()
    },

    returnToOriginalStation() {
      if (this.originalStationIndex !== undefined && this.originalStationIndex !== null) {
        this.currentStationIndex = this.originalStationIndex
      }
      this.originalStationIndex = null
      this.isSkipping = false
      this.skipAttemptCount = 0
      this.logTelemetry('return', `returned to stationIndex:${this.currentStationIndex}`)
      if (this.currentStation) {
        this.currentStation.songInfo = { artist: null, title: null, albumArt: null }
      }
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
      localStorage.setItem('autoReturn', JSON.stringify(this.autoReturn))
      localStorage.setItem('skipEnabled', JSON.stringify(this.skipEnabled))
      localStorage.setItem('maxPreferredSkips', JSON.stringify(this.maxPreferredSkips))
      localStorage.setItem('autoPlay', JSON.stringify(this.autoPlay))
    },

    loadPreferences() {
      const saved = localStorage.getItem('preferredStations')
      if (saved) {
        this.preferredStations = JSON.parse(saved)
      }
      const savedAuto = localStorage.getItem('autoReturn')
      if (savedAuto !== null) {
        try {
          this.autoReturn = JSON.parse(savedAuto)
        } catch (e) {
          this.autoReturn = true
        }
      }
      const savedSkip = localStorage.getItem('skipEnabled')
      if (savedSkip !== null) {
        try {
          this.skipEnabled = JSON.parse(savedSkip)
        } catch (e) {
          this.skipEnabled = true
        }
      }
      const savedMax = localStorage.getItem('maxPreferredSkips')
      if (savedMax !== null) {
        try {
          this.maxPreferredSkips = JSON.parse(savedMax)
        } catch (e) {
          this.maxPreferredSkips = null
        }
      }
      const savedAutoPlay = localStorage.getItem('autoPlay')
      if (savedAutoPlay !== null) {
        try {
          this.autoPlay = JSON.parse(savedAutoPlay)
        } catch (e) {
          this.autoPlay = false
        }
      }
    },

    logTelemetry(type, message) {
      try {
        const entry = { type, message: message || '', time: new Date().toISOString() }
        this.telemetry.unshift(entry)
        // keep last 50 entries
        if (this.telemetry.length > 50) this.telemetry.splice(50)
        localStorage.setItem('telemetry', JSON.stringify(this.telemetry))
      } catch (e) {
        // ignore telemetry errors
      }
    },

    loadTelemetry() {
      const saved = localStorage.getItem('telemetry')
      if (saved) {
        try {
          this.telemetry = JSON.parse(saved)
        } catch (e) {
          this.telemetry = []
        }
      }
    },

    clearTelemetry() {
      this.telemetry = []
      localStorage.removeItem('telemetry')
    },

  }
})
