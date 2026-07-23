# Architecture

## v0.2.0 direction

The book remains a small, declarative utility application rather than a plugin framework. The item-use handler opens a generic menu router; menu definitions point to focused actions or child menus. Each form promise retains its own invoking `Player`, and no selected menu index is stored globally.

## Menu and action boundaries

- `book/` owns item activation and the generic router.
- `menus/` declares the six ordered top-level categories and nested utility pages.
- `travel/` separates serialized player locations, bounded safety validation, temporary chunk loading, and teleport sequencing.
- `player/` isolates stable camera presets, attribute/effect utilities, and unavailable emote routing.
- `quick-build/` separates held-block validation, cardinal geometry, obstruction inspection, confirmation, and placement.
- `spells/` retains existing inventory-kit, creator-item, and world-setting actions.
- `ui/` provides reusable form results and player-safe feedback.

Player-facing failure messages are fixed and never contain internal exceptions. Development builds log useful exception context; release builds compile those diagnostics out through `__DEV__`.

## Persistent travel state

Home and Previous Location are JSON records stored as namespaced dynamic properties on the individual player entity. A record contains a schema version, dimension identifier, coordinates, and optional pitch/yaw. Dynamic properties persist with world/player data and naturally isolate players, but do not transfer between worlds and depend on that player entity data remaining intact.

Teleporting follows this sequence:

1. Load or prepare the destination chunk with a temporary, bounded ticking area when needed.
2. Validate the exact destination, then a deterministic radius-3/y±2 candidate set.
3. Require safe footing, two passable body blocks, and no listed direct/adjacent hazard.
4. Attempt the teleport.
5. Only after success, store the departure point as Previous Location.

This ordering preserves Return to Previous Location if a destination cannot be reached and enables two-way swapping. Fixed Nether and End arrivals use a 5×5 obsidian platform and clear only a 3×3×3 safety volume above it. This bounded terrain change is explicit and limited to the documented arrival coordinates.

## Quick Build transaction model

The held main-hand item identifier must resolve through the stable block registry. Geometry is calculated in cardinal coordinates from player yaw. Ground alignment and all target blocks are inspected before mutation. The executor places no more than 81 blocks and stops before starting if one cell is obstructed, unsafe, outside the height range, or unloaded.

Undo is deferred because a safe implementation needs exact prior `BlockPermutation` records plus post-build conflict checks. A simple “replace everything with air” implementation would destroy later edits and is forbidden.

## Stable APIs and constrained compatibility code

- Stable `@minecraft/server` 2.8.0 and `@minecraft/server-ui` 2.1.0 remain the only runtime modules.
- Camera choices use `Player.camera.setCamera` and `clear`, not raw camera commands.
- Player actions use stable entity attribute, effect, rotation, and display APIs.
- Temporary ticking-area commands are isolated in travel chunk-loading code because the stable API can inspect but cannot synchronously load an arbitrary destination chunk.
- Emotes remain unavailable until the resource pack supplies known player animations; calling an unverified vanilla identifier is not considered a working feature.
- World time and weather remain necessarily world-wide and are labeled accordingly.

## Extension direction

The `MenuDefinition` and `MenuEntry` types are the build-time extension point. Optional companion content can later contribute a menu definition through a deliberately designed cross-pack contract. v0.2.0 has no runtime discovery protocol and no dependency on Chaos TNT.
