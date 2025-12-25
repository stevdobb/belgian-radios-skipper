# Changelog

All notable changes to this project are documented in this file.

## Unreleased

### Added
- Moved playback controls and volume into the Now Playing card.
- Responsive layout: Preferred Stations and Dislike Management display side-by-side on large screens.
- Mobile layout fixes to avoid menu overlap.
- Auto-return toggle: option to automatically return to the original station after skipping a disliked song.
- Skip toggle: enable/disable automatic skipping of disliked songs.
- `maxPreferredSkips` setting: configure how many preferred stations are attempted before returning.
- Telemetry storage (localStorage) and UI in Settings to view and clear recent events.
- Telemetry CSV export button in Settings for debugging.
- Toast notifications for skip/return/cast events with styled animations.
- Adaptive polling: reduce full-station polling when not skipping; monitor original station more frequently while skipping.

### Changed
- Improved cast error handling and telemetry logging.
- Added limit and backoff logic for preferred-station skipping.

### Fixed
- Fixed template parsing error and adjusted layout spacing on mobile.

### Files modified
- `src/views/Home.vue`
- `src/stores/radioStore.js`
- `src/views/Settings.vue`
- `src/components/Layout.vue`


----

Generated on: 