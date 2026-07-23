# Changelog

All notable changes to The Player’s Spell Book are documented here.

## [0.2.0] - 2026-07-22

### Added

- Persistent per-player Home locations and two-way Previous Location travel with bounded destination safety checks.
- Safe Nether and End arrivals with prepared landing platforms and temporary arrival protection.
- Player Utilities submenus for camera perspectives, healing, feeding, effect clearing, coordinates, and facing north.
- An honest Emotes placeholder architecture pending a dedicated, reliably testable player-animation pack.
- A confirmed Quick Build prototype for Stack, Wall, and Floor presets using the held block.
- Quick Build material validation, cardinal placement, strict size caps, ground alignment, and all-or-nothing obstruction checks.

### Changed

- Reorganized the main menu around Travel, Player Utilities, Quick Build, Item Kits, World Settings, and Creator Tools.
- Replaced fantasy utility names with plain functional labels.
- Expanded development-only diagnostics while keeping internal errors hidden from players.

## [0.1.0] - 2026-07-20

### Added

- First playable MVP with a custom Creative-inventory spell-book item and `ActionFormData` menus.
- Safe World, Builder, Travel, and Item spell categories.
- Player-scoped inventory and teleport actions, cancellation-safe navigation, and feedback.
- Behavior/resource packs, localization, custom icon, validation, build metadata, and `.mcaddon` export tooling.
