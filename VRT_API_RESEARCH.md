# VRT Belgian Radio API Research Report

## Summary
The VRT (Vlaamse Radio- en Televisie) provides a public API with access to multiple Belgian radio stations and their current song information. This document outlines all discovered endpoints, available channels, and data structures.

---

## VRT Media Services Public API

### Base URL
```
https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2
```

### API Endpoint Pattern
```
https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/{channel-id}
```

---

## Available VRT Radio Channels

### ✓ Actively Streaming Channels (With Schedule & Live Data)

#### 1. **Studio Brussel** (Stubru)
- **Channel ID:** `livestream-audio-stubru`
- **Endpoint:** `https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-stubru`
- **Status:** ✓ Active, has schedule, provides current song data
- **Current Status:** Playing "De Warmste Week" programming

#### 2. **MNM**
- **Channel ID:** `livestream-audio-mnm`
- **Endpoint:** `https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-mnm`
- **Status:** ✓ Active, has schedule, provides current song data
- **Current Status:** Playing "De Warmste Week" programming

#### 3. **Bruut** (Studio Brussel - Heavy Guitars)
- **Channel ID:** `livestream-audio-stubrubruut`
- **Endpoint:** `https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-stubrubruut`
- **Status:** ✓ Active, has schedule and current song info
- **Current Status:** Playing "Studio Brussel Zware Gitaren" programming

#### 4. **Vuurland** (Studio Brussel - Vuurland)
- **Channel ID:** `livestream-audio-stubru-vuurland`
- **Endpoint:** `https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-stubru-vuurland`
- **Status:** ✓ Active, has schedule and current song info
- **Current Status:** Playing "Studio Brussel Vuurland" programming

#### 5. **Radio 1** (VRT Radio1)
- **Channel ID:** `livestream-audio-radio1`
- **Endpoint:** `https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-radio1`
- **Status:** ✓ Active, has schedule and current song info
- **Sample Program:** "#weetikveel" - Playing Queen's "One vision"

#### 6. **Klara** (Classical Music Station)
- **Channel ID:** `livestream-audio-klara`
- **Endpoint:** `https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-klara`
- **Status:** ✓ Active, has schedule and current song info
- **Sample Program:** "Klara Serveert" - Playing Leopold Mozart's "Speelgoedsymfonie in G"

### ⚠️ Channel IDs That Return 200 but Have Empty Schedules

These endpoints exist but currently have no schedule data or nowOnAirItem information:

- **Radio 2** - `livestream-audio-radio2`
- **Klassiek** - `livestream-audio-klassiek`
- **Vrije Geluiden** - `livestream-audio-vrije-geluiden`
- **Studio Brussel (Legacy)** - `livestream-audio-studio-brussel`
- **Radio Donna** - `livestream-audio-radio-donna`
- **Sporza** - `livestream-audio-sporza`
- **VRT News** - `livestream-audio-vrt-nws`

---

## API Response Data Structure

### Full Response Example (Radio 1 - Current Track)

```json
{
  "schedule": [
    {
      "title": "#weetikveel",
      "time": "2025-12-22T11:00:00.000Z",
      "nowOnAirItem": {
        "title": "One vision",
        "author": "Queen",
        "artist": "QUEEN",
        "nowOnAirType": "MUSIC",
        "imageLinks": [
          {
            "url": "https://images.vrt.be/orig/2018/12/17/a6136047-01fa-11e9-abcc-02b7b76bf47f.jpg",
            "type": "ARTIST"
          },
          {
            "url": "https://images.vrt.be/orig/2018/12/17/a6136047-01fa-11e9-abcc-02b7b76bf47f.jpg",
            "type": "AUTHOR"
          }
        ],
        "broadcast": {
          "title": "#weetikveel F35-piloot",
          "imageLinks": [...],
          "presenters": [
            {
              "name": "Kobe Ilsen",
              "imageLinks": [...]
            }
          ]
        },
        "program": {
          "title": "#weetikveel",
          "imageLinks": [...]
        }
      }
    }
  ]
}
```

### Key Data Fields Available

- **title** - Song title
- **author** - Song author/composer
- **artist** - Artist name (often in uppercase)
- **nowOnAirType** - Type of content (e.g., "MUSIC")
- **imageLinks** - Array of images with different types:
  - `ARTIST` - Artist image
  - `AUTHOR` - Author image
  - `DAB` - DAB broadcast image
  - `VRTMAX` - VRT Max image
  - `TITLE_ART` - Song/album art
  - `VRTMAX_RADIO_COVER` - Radio show cover
- **broadcast** - Broadcast program information
  - `title` - Program title
  - `presenters` - Array of presenter objects
- **program** - Program metadata

---

## Recommended Additional Channels to Add

Based on the API structure, the following channels could potentially be added to your Belgian Radio Player:

1. **Radio 1** - General interest, news, culture (Major national station)
2. **Klara** - Classical music station (High-quality audio, unique content)
3. **Bruut** - Heavy music substation of Studio Brussel (Niche audience)

These provide the most diverse range of Belgian radio content.

---

## Alternative Belgian Radio APIs

### 1. **Radioplayer.be API**
- **Website:** https://www.radioplayer.be
- **Coverage:** 250+ Belgian radio stations
- **Status:** No public API documented, but the platform aggregates:
  - Flemish broadcasts (VRT stations)
  - Walloon broadcasts (RTBF stations)
  - Community and private stations
- **Available on:** iOS app, Android app, Web, Sonos, Alexa
- **Note:** While there's no official developer API, the platform exists as a unified Belgian radio player

### 2. **RTBF (Walloon Radio & TV)**
- **Website:** https://www.rtbf.be
- **Stations:** Vivacité, Pure FM, Classic 21, Bel RTL and others
- **Note:** RTBF primarily serves French-speaking Belgium (Wallonia). No public API documentation found.

---

## Current Implementation in Your App

Your application currently uses:
1. **Studio Brussel** - `livestream-audio-stubru`
2. **MNM** - `livestream-audio-mnm`
3. **Bruut** - `livestream-audio-stubrubruut`
4. **Vuurland** - `livestream-audio-stubru-vuurland`

### Stream Sources
The app also fetches actual stream URLs from `streamabc.net` (VRT's streaming partner):
- Pattern: `https://vrt.streamabc.net/vrt-[channel-name]-mp3-128-[unique-id]?[params]`

---

## API Usage Notes

### Strengths
✓ No authentication required  
✓ CORS-enabled (accessible from web)  
✓ Provides rich metadata including artist images  
✓ Real-time song information  
✓ Multiple channels with different genres  

### Limitations
✗ Some channels return empty schedules  
✗ No pagination for schedules (all at once)  
✗ Limited future schedule visibility  
✗ Rate limiting not documented  
✗ No official API documentation published  

### Best Practices
- Cache responses to reduce API calls (10-15 second intervals recommended)
- Handle empty schedules gracefully
- Use the `nowOnAirItem` object when available; fall back to schedule title
- Implement error handling for network failures
- Consider respecting VRT's servers with reasonable refresh intervals

---

## Testing Commands

### Get all channels with active schedules:
```bash
curl -s "https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-radio1" | jq '.'
```

### Get current song for a specific channel:
```bash
curl -s "https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-klara" | jq '.schedule[2].nowOnAirItem'
```

---

## Recommendations for Your App

### High Priority (Worth Adding)
1. **Radio 1** - Largest Belgian general-interest station
   - Endpoint: `livestream-audio-radio1`
   - Benefits: More diverse music, news integration

### Medium Priority (Niche but Quality)
2. **Klara** - Premium classical music station
   - Endpoint: `livestream-audio-klara`
   - Benefits: High-quality audio experience, international classical content

### Lower Priority (Wait and See)
- Radio 2 through VRT News endpoints (currently empty schedules)
- RTBF stations (different provider, would need separate implementation)

---

## Implementation Example for Radio 1

To add Radio 1 to your Vue.js application:

```javascript
{
  id: 4,
  name: 'Radio 1',
  shortName: 'R1',
  stream: 'https://vrt.streamabc.net/vrt-radio1-mp3-128-[ID]',
  endpoint: 'https://media-services-public.vrt.be/vualto-video-aggregator-web/rest/external/v2/channels/livestream-audio-radio1',
  color: 'from-green-500 to-green-700',
  icon: 'megaphone'
}
```

---

## Conclusion

The VRT API provides excellent access to Belgian radio content with reliable song information. The platform supports at least **6 active channels** with real-time data. Expanding beyond the current 4 channels to include Radio 1 and Klara would significantly enhance the user experience and provide more diverse content options.

The API is stable, well-structured, and suitable for production use in radio player applications.
