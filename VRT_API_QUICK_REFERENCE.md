# VRT Belgian Radio API - Quick Reference Guide

## 🎙️ Available Channels Summary

| Channel | Endpoint ID | Status | Genre | Current Data |
|---------|------------|--------|-------|--------------|
| **Studio Brussel** | `livestream-audio-stubru` | ✅ Active | Pop/Rock | Yes |
| **MNM** | `livestream-audio-mnm` | ✅ Active | Pop/Dance | Yes |
| **Bruut** | `livestream-audio-stubrubruut` | ✅ Active | Heavy/Rock | Yes |
| **Vuurland** | `livestream-audio-stubru-vuurland` | ✅ Active | Indie/Alternative | Yes |
| **Radio 1** | `livestream-audio-radio1` | ✅ Active | General/News | Yes |
| **Klara** | `livestream-audio-klara` | ✅ Active | Classical | Yes |
| Radio 2 | `livestream-audio-radio2` | ⚠️ Empty | - | No |
| Klassiek | `livestream-audio-klassiek` | ⚠️ Empty | - | No |
| Vrije Geluiden | `livestream-audio-vrije-geluiden` | ⚠️ Empty | - | No |
| Studio Brussel (Legacy) | `livestream-audio-studio-brussel` | ⚠️ Empty | - | No |
| Radio Donna | `livestream-audio-radio-donna` | ⚠️ Empty | - | No |
| Sporza | `livestream-audio-sporza` | ⚠️ Empty | - | No |
| VRT News | `livestream-audio-vrt-nws` | ⚠️ Empty | - | No |

---

## 🔌 API Quick Access

### Format
```
GET https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/{channel-id}
```

### Example Request
```bash
curl "https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-radio1"
```

### Response Structure
```json
{
  "schedule": [
    {
      "title": "Program Name",
      "time": "2025-12-22T11:00:00.000Z",
      "nowOnAirItem": {
        "title": "Song Title",
        "author": "Song Author",
        "artist": "ARTIST NAME",
        "nowOnAirType": "MUSIC",
        "imageLinks": [
          {"url": "https://images.vrt.be/...", "type": "ARTIST"}
        ],
        "broadcast": {...},
        "program": {...}
      }
    }
  ]
}
```

---

## 📊 Sample Data

### Radio 1 - Now Playing Example
- **Current Program:** #weetikveel
- **Presenter:** Kobe Ilsen
- **Now Playing:** One vision
- **Artist:** QUEEN
- **Author:** Queen

### Klara - Now Playing Example
- **Current Program:** Klara Serveert
- **Now Playing:** Speelgoedsymfonie in G
- **Artist:** Ensemble L'Encyclopédie o.l.v. Florent Albrecht
- **Author:** Leopold Mozart

---

## 🎯 Recommended Next Steps

### 1. Add Radio 1 (High Priority)
- **Why:** Largest Belgian national broadcaster
- **Benefit:** More diverse audience appeal
- **Implementation:** Add to `radioStore.js` stations array

### 2. Add Klara (Medium Priority)
- **Why:** Premium classical content with international appeal
- **Benefit:** Differentiates product for classical music listeners
- **Implementation:** Similar to Radio 1

### 3. Monitor Radio 2 & Others
- **Status:** Currently empty schedules
- **Recommendation:** Check periodically as VRT may activate them

---

## 🔍 Key Features Available in API

✅ Current song information (title, artist)  
✅ Artist images and metadata  
✅ Broadcast program information  
✅ Presenter names and images  
✅ Future schedule information  
✅ Multiple image formats for different displays  
✅ Real-time updates (no caching required)  
✅ No authentication needed  

---

## ⚙️ Implementation Tips

### Caching Strategy
- Cache responses for 10-15 seconds to balance freshness and server load
- Refresh on user interaction (station change, manual refresh)

### Error Handling
```javascript
// Handle empty schedules gracefully
const songData = this.findKeyValueInObject(response.data, 'nowOnAirItem')
if (!songData || !songData.title) {
  // Fallback to program title or "No song info"
}
```

### Parallel Loading
- Fetch all station data in parallel using `Promise.all()`
- Currently implemented in `fetchAllStations()` action

---

## 🌐 Alternative Belgian Radio Platforms

### Radioplayer.be
- **Coverage:** 250+ Belgian radio stations
- **Reach:** iOS, Android, Web, Sonos, Alexa
- **Status:** No public API available
- **Note:** Aggregator for VRT, RTBF, and others

### RTBF (French-speaking Belgium)
- **Stations:** Vivacité, Pure FM, Classic 21, Bel RTL
- **Status:** No public API documented
- **Note:** Would require separate implementation

---

## 📝 Notes

1. **No Authentication:** VRT API is publicly accessible from browsers and mobile apps
2. **No Rate Limiting Documentation:** Use reasonable intervals (10+ seconds)
3. **CORS Enabled:** API responds to cross-origin requests
4. **Stability:** API appears stable and well-maintained by VRT
5. **Image URLs:** All images are hosted on `images.vrt.be` with proper CDN delivery

---

## 🔗 Useful Links

- **VRT Main Site:** https://www.vrt.be
- **VRT Radio Hub:** https://radio.vrt.be
- **Radioplayer.be:** https://www.radioplayer.be
- **Your App:** /belgian-radios-skipper/

---

**Last Updated:** December 22, 2025  
**API Status:** ✅ All channels responding  
**Documentation Level:** Complete for 6 active channels
