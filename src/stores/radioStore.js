import { defineStore } from 'pinia'
import axios from 'axios'
import { io } from 'socket.io-client'

const SKIP_HISTORY_KEY = 'skipHistory'
const SKIP_HISTORY_LIMIT = 20
const AUTO_SKIP_DELAY_MS = 15000
const AUTO_RETURN_DELAY_MS = 15000
const QMUSIC_STATION_ID = 7
const QMUSIC_SOCKET_URL = 'wss://socket.qmusic.be/api/272/h2fymtaw/websocket'
const QMUSIC_IMAGE_BASE = 'https://static.qmusic.be'

const normalize = (value) => (value || '').toLowerCase().trim()
const buildSongKey = (stationId, artist, title) => `${stationId ?? 'x'}|${normalize(artist)}|${normalize(title)}`

const buildSongInfo = (songData) => {
  if (!songData) return { artist: null, title: null, albumArt: null }
  const artist = songData.artist || songData.author
  const title = songData.title || songData.program?.title || songData.broadcast?.title
  const imageLinks = songData.imageLinks || songData.program?.imageLinks || songData.broadcast?.imageLinks || []
  const albumArt =
    imageLinks.find(img => img.type === 'VRTMAX_RADIO_COVER')?.url ||
    imageLinks.find(img => img.type === 'SQUARE')?.url ||
    imageLinks.find(img => img.type === 'FULL_HD')?.url ||
    imageLinks[0]?.url
  return { artist, title, albumArt }
}

const buildQmusicSongInfo = (payload) => {
  if (!payload) return { artist: null, title: null, albumArt: null }
  const artist = payload.artist?.name || null
  const title = payload.title || null
  const imagePath = payload.images?.default || payload.thumbnail || null
  const albumArt = imagePath
    ? (imagePath.startsWith('http') ? imagePath : `${QMUSIC_IMAGE_BASE}${imagePath}`)
    : null
  return { artist, title, albumArt }
}

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
      },
      {
        id: 4,
        name: 'Studio Brussel Tijdloze',
        shortName: 'Tijdloze',
        stream: 'https://radio.vrtcdn.be/vrt/detijdloze/live.m3u8?ola=true&contentType=LIVESTREAM&filter=%28%21%28type%3D%3D%22audio%22%26%26FourCC%21%3D%22AACL%22%29%29',
        endpoint: 'https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-stubrutijdloze',
        color: 'from-amber-500 to-amber-700',
        icon: 'clock',
        songInfo: { artist: null, title: null, albumArt: null }
      },
      {
        id: 5,
        name: 'Radio 1',
        shortName: 'Radio 1',
        stream: 'https://radio.vrtcdn.be/vrt/radio1/live.m3u8?ola=true&contentType=LIVESTREAM&filter=%28%21%28type%3D%3D%22audio%22%26%26FourCC%21%3D%22AACL%22%29%29',
        endpoint: 'https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-radio1',
        color: 'from-emerald-500 to-emerald-700',
        icon: 'broadcast',
        songInfo: { artist: null, title: null, albumArt: null }
      },
      {
        id: 6,
        name: 'Radio 2 Vlaams-Brabant',
        shortName: 'Radio 2 VLB',
        stream: 'https://radio.vrtcdn.be/vrt/radio2-vlaams-brabant/live.m3u8?ola=true&contentType=LIVESTREAM&filter=%28%21%28type%3D%3D%22audio%22%26%26FourCC%21%3D%22AACL%22%29%29',
        endpoint: 'https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-radio2vlb',
        color: 'from-lime-500 to-lime-700',
        icon: 'map',
        songInfo: { artist: null, title: null, albumArt: null }
      },
      {
        id: 7,
        name: 'Qmusic',
        shortName: 'Qmusic',
        stream: 'https://icecast-qmusicbe-cdp.triple-it.nl/qmusic.aac?aw_0_1st.skey=1770450358&aw_0_1st.playerid=site-player&aw_0_req.userConsentV2=CQX1pUAQX1pUAGbABBNLB8FoAPPAAAAAAAIgLDERxCpEAAFAICJyQJkgUIgWMAAABEAQAAIBAyABgAgAIAQCkGESBADABAACCAIAKABBAABJGAAAAAAAAAAAAACASAAAAAoAICAAgCIBQAAIAAAAAAAAAAAAAAACAAAAkAAAAAIoSEgAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAABAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAYIAAgFICAAgCUgFICQFgAFgAVAAuABwAEAAMgAaABMAD8AIYAZQA7wB-gEcAJEASYAxQBogEegLzAZIAyccAGAAuAQgAlIBSAExALZHQGwAFgAVAA4ACAAGQANAAmABiAD8AIYAZQA0QB3gD9AItARwBHQCRAEmAMUAicBHoCZAF5gMkAZOAywCOxQAGABcAlICYikBkABYAFQAOAAgABkADQAJgAYgA_ACGAGUANEAd4A_QCLQEcAR0AkQBigETgI9AXmAyQBk4DLAI7BgAIBSCQAIAC4CYiUA0ABYAHAAmABiAEMAO8AjgBigEegLzAZIAycBlhABIAAsADIATQAvgBiADYAHcAPwAoABSADSAGqAOIAd4BHACUgFZAK-AWkAu4BhADFAGcgNMA04CBAEDgInAR6AmIBO4C9gGOgMfAZOAywCApCAUAAsAMQAfgB3gEcAJSAYoBE4CPQGTg.YAAAAAAAAAAA&aw_0_1st.puid=89354f7a4d593cec856bd56d841343140a2c1121',
        endpoint: null,
        color: 'from-pink-500 to-pink-700',
        icon: 'music',
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
    dislikes: ['Metejoor', 'Freek', 'Toerist Le MC', 'Bazart', 'Milow', 'Maksim', 'Niels Destadsbader', 'Clouseau', 'Natalia', 'Laura Tesoro','Regi', 'Gustaph', 'Willy Sommers', 'Camille', 'Bart Peeters', 'Milk Inc.', 'Zwangere Guy'],
    preferredStations: [],
    autoReturn: true,
    telemetry: [],
    skipHistory: [],
    songChangedTimeout: null,
    streamNonce: 0,
    pendingAutoSkipKey: null,
    pendingAutoSkipTimer: null,
    pendingAutoReturnKey: null,
    pendingAutoReturnTimer: null,
    qmusicSocket: null
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
    clearPendingAutoSkip() {
      if (this.pendingAutoSkipTimer) {
        clearTimeout(this.pendingAutoSkipTimer)
      }
      this.pendingAutoSkipTimer = null
      this.pendingAutoSkipKey = null
    },

    scheduleAutoSkip(artist, title) {
      if (!this.skipEnabled) {
        this.clearPendingAutoSkip()
        return
      }
      const stationId = this.currentStation?.id
      const key = buildSongKey(stationId, artist, title)
      if (this.pendingAutoSkipKey === key) return
      this.clearPendingAutoSkip()
      this.pendingAutoSkipKey = key
      this.pendingAutoSkipTimer = setTimeout(() => {
        const station = this.currentStation
        if (!station || station.id !== stationId) {
          this.clearPendingAutoSkip()
          return
        }
        const currentArtist = station.songInfo?.artist
        const currentTitle = station.songInfo?.title
        if (!this.isDiskliked(currentArtist, currentTitle)) {
          this.clearPendingAutoSkip()
          return
        }
        if (!this.skipEnabled) {
          this.logTelemetry('skip_disabled', `Detected disliked ${currentArtist} - ${currentTitle} but skipping is disabled`)
          this.clearPendingAutoSkip()
          return
        }
        if (this.preferredStations.length > 0) {
          this.skipToNextPreferred('auto')
        } else {
          this.skipStation('auto')
        }
        this.clearPendingAutoSkip()
      }, AUTO_SKIP_DELAY_MS)
    },

    clearPendingAutoReturn() {
      if (this.pendingAutoReturnTimer) {
        clearTimeout(this.pendingAutoReturnTimer)
      }
      this.pendingAutoReturnTimer = null
      this.pendingAutoReturnKey = null
    },

    scheduleAutoReturn(originalIndex) {
      if (!this.autoReturn) {
        this.clearPendingAutoReturn()
        return
      }
      if (originalIndex === undefined || originalIndex === null) return
      const key = `${originalIndex}|returnable`
      if (this.pendingAutoReturnKey === key) return
      this.clearPendingAutoReturn()
      this.pendingAutoReturnKey = key
      this.pendingAutoReturnTimer = setTimeout(() => {
        if (!this.autoReturn) {
          this.clearPendingAutoReturn()
          return
        }
        if (this.originalStationIndex === undefined || this.originalStationIndex === null) {
          this.clearPendingAutoReturn()
          return
        }
        if (this.currentStationIndex === this.originalStationIndex) {
          this.clearPendingAutoReturn()
          return
        }
        const original = this.stations[this.originalStationIndex]
        const artist = original?.songInfo?.artist
        const title = original?.songInfo?.title
        if (this.isDiskliked(artist, title)) {
          this.clearPendingAutoReturn()
          return
        }
        this.returnToOriginalStation(this.originalStationIndex)
        this.clearPendingAutoReturn()
      }, AUTO_RETURN_DELAY_MS)
    },

    selectStation(index) {
      // user-selected station becomes the baseline original station
      this.clearPendingAutoSkip()
      this.clearPendingAutoReturn()
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

    ensureQmusicSocket() {
      if (this.qmusicSocket) return
      const socket = io(QMUSIC_SOCKET_URL, {
        transports: ['websocket'],
        upgrade: false,
        reconnection: true
      })
      socket.on('message', (raw) => {
        try {
          const outer = typeof raw === 'string' ? JSON.parse(raw) : raw
          if (!outer || outer.action !== 'data' || !outer.data) return
          const inner = JSON.parse(outer.data)
          if (inner?.station !== 'qbe_maximum_hits' || inner?.entity !== 'plays' || inner?.action !== 'play') return
          const info = buildQmusicSongInfo(inner.data)
          const station = this.stations.find(s => s.id === QMUSIC_STATION_ID)
          if (station) {
            station.songInfo = info
          }
          if (this.currentStation?.id === QMUSIC_STATION_ID) {
            if (this.isDiskliked(info.artist, info.title)) {
              if (!this.skipEnabled) {
                this.clearPendingAutoSkip()
                this.logTelemetry('skip_disabled', `Detected disliked ${info.artist} - ${info.title} but skipping is disabled`)
              } else {
                this.scheduleAutoSkip(info.artist, info.title)
              }
            } else {
              this.clearPendingAutoSkip()
            }
          }
        } catch (error) {
          console.error('Error parsing Qmusic socket payload:', error)
        }
      })
      socket.on('connect_error', (error) => {
        console.error('Qmusic socket error:', error)
      })
      this.qmusicSocket = socket
    },

    async fetchCurrentSong() {
      if (!this.currentStation) return
      if (!this.currentStation.endpoint) {
        if (this.currentStation.id === QMUSIC_STATION_ID) {
          this.ensureQmusicSocket()
        }
        this.currentStation.songInfo = { artist: null, title: null, albumArt: null }
        this.clearPendingAutoSkip()
        return
      }

      try {
        const station = this.currentStation
        const response = await axios.get(station.endpoint)
        const scheduleItem = response.data.schedule?.find(item => item.nowOnAirItem)
        const songData = scheduleItem?.nowOnAirItem

        if (songData) {
          const info = buildSongInfo(songData)
          station.songInfo = info
          if (this.isDiskliked(info.artist, info.title)) {
            if (!this.skipEnabled) {
              this.clearPendingAutoSkip()
              this.logTelemetry('skip_disabled', `Detected disliked ${info.artist} - ${info.title} but skipping is disabled`)
            } else {
              this.scheduleAutoSkip(info.artist, info.title)
            }
          } else {
            this.clearPendingAutoSkip()
          }
        } else {
          station.songInfo = { artist: null, title: null, albumArt: null }
          this.clearPendingAutoSkip()
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
        if (!station.endpoint) {
          if (station.id === QMUSIC_STATION_ID) {
            this.ensureQmusicSocket()
          }
          station.songInfo = { artist: null, title: null, albumArt: null }
          return
        }
        try {
          const response = await axios.get(station.endpoint)
          const scheduleItem = response.data.schedule?.find(item => item.nowOnAirItem)
          const songData = scheduleItem?.nowOnAirItem

          if (songData) {
            station.songInfo = buildSongInfo(songData)
          } else {
            station.songInfo = { artist: null, title: null, albumArt: null }
          }
        } catch (error) {
          console.error(`Error fetching data for station ${station.name}:`, error)
          station.songInfo = { artist: null, title: null, albumArt: null }
        }
      })
      await Promise.all(promises)

      // If we previously skipped, check whether the return station is now playing
      // a non-disliked song; if so, return to it.
      if (this.autoReturn && this.originalStationIndex !== undefined && this.originalStationIndex !== null && this.currentStationIndex !== this.originalStationIndex) {
        const original = this.stations[this.originalStationIndex]
        const artist = original?.songInfo?.artist
        const title = original?.songInfo?.title
        if (!this.isDiskliked(artist, title)) {
          this.scheduleAutoReturn(this.originalStationIndex)
        } else {
          this.clearPendingAutoReturn()
        }
      } else {
        this.clearPendingAutoReturn()
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

        const info = buildSongInfo(songData)
        if (original) {
          original.songInfo = info
        }
        if (!this.isDiskliked(info.artist, info.title)) {
          if (this.autoReturn) this.scheduleAutoReturn(this.originalStationIndex)
        } else {
          this.clearPendingAutoReturn()
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

    recordSkip(source = 'manual') {
      try {
        const station = this.currentStation
        const songInfo = station?.songInfo || {}
        const entry = {
          id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
          time: new Date().toISOString(),
          stationId: station?.id ?? null,
          stationName: station?.name || '',
          stationShortName: station?.shortName || '',
          artist: songInfo.artist || '',
          title: songInfo.title || '',
          source
        }
        this.skipHistory.unshift(entry)
        if (this.skipHistory.length > SKIP_HISTORY_LIMIT) {
          this.skipHistory.splice(SKIP_HISTORY_LIMIT)
        }
        localStorage.setItem(SKIP_HISTORY_KEY, JSON.stringify(this.skipHistory))
      } catch (e) {
        // ignore skip history errors
      }
    },

    loadSkipHistory() {
      const saved = localStorage.getItem(SKIP_HISTORY_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          this.skipHistory = Array.isArray(parsed)
            ? parsed.slice(0, SKIP_HISTORY_LIMIT)
            : []
        } catch (e) {
          this.skipHistory = []
        }
      }
    },

    clearSkipHistory() {
      this.skipHistory = []
      localStorage.removeItem(SKIP_HISTORY_KEY)
    },

    skipStation(source = 'manual') {
      this.clearPendingAutoSkip()
      this.recordSkip(source)
      this.currentStationIndex = (this.currentStationIndex + 1) % this.stations.length
      if (this.currentStation) {
        this.currentStation.songInfo = { artist: null, title: null, albumArt: null }
      }
      this.streamNonce += 1
      this.fetchCurrentSong()
    },

    skipToNextPreferred(source = 'auto') {
      if (this.preferredStations.length === 0) {
        this.skipStation(source)
        return
      }
      this.clearPendingAutoSkip()
      this.recordSkip(source)
      const currentStationId = this.currentStation?.id
      const currentIndex = this.preferredStations.indexOf(currentStationId)
      let nextIndex = (currentIndex + 1) % this.preferredStations.length
      const nextStationId = this.preferredStations[nextIndex]
      const nextStationIndex = this.stations.findIndex(s => s.id === nextStationId)

      // Remember return station (top preferred) if we're starting a skip sequence
      if (!this.isSkipping) {
        this.clearPendingAutoReturn()
        const preferredId = this.preferredStations[0]
        const preferredIndex = this.stations.findIndex(s => s.id === preferredId)
        this.originalStationIndex = preferredIndex > -1 ? preferredIndex : this.currentStationIndex
        this.skipAttemptCount = 0
      }
      this.isSkipping = true

      // increment attempt and check limit
      this.skipAttemptCount = (this.skipAttemptCount || 0) + 1
      const limit = this.maxPreferredSkips || this.preferredStations.length || Infinity
      if (this.skipAttemptCount > limit) {
        this.logTelemetry('skip_limit_reached', `reached limit ${limit}, returning to original`)
        this.skipAttemptCount = 0
        this.returnToOriginalStation(this.originalStationIndex)
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

    returnToOriginalStation(targetIndex) {
      this.clearPendingAutoReturn()
      const returnIndex = targetIndex !== undefined && targetIndex !== null
        ? targetIndex
        : this.originalStationIndex
      if (returnIndex !== undefined && returnIndex !== null) {
        this.currentStationIndex = returnIndex
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
