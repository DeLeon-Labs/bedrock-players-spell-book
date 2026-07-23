# The Player’s Spell Book

The Player’s Spell Book is a kid-friendly Minecraft Bedrock add-on that presents useful player actions through large, plainly labeled menus. It is not a command terminal: every action is predefined, scoped, and reviewed for safety.

## Use the book

Enable both included packs on a Bedrock world. In Creative inventory, find **Player’s Spell Book** in the Items category, hold it, and use it. It can also be obtained with:

```mcfunction
/give @s spellbook:players_spell_book
```

The stable `@minecraft/server-ui` `ActionFormData` API powers the menus. Every submenu has **← Back**; closing a menu performs no action.

## v0.2.0 menu

1. **◆ Travel**
   - Return to World Spawn
   - Return to Personal Spawn
   - Save Current Location as Home
   - Return Home
   - Return to Previous Location
   - Teleport to Nether
   - Teleport to End
2. **⚙ Player Utilities**
   - **Camera Settings:** First Person, Third Person Behind, Third Person Front, Reset Camera
   - **Player Actions:** Heal, Feed, Clear Effects, Show Coordinates, Face North
   - **Emotes:** Friendly, Dance, Scary, Celebrate placeholders
3. **▦ Quick Build**
   - **Stack:** 3, 6, 9, or 15 blocks high
   - **Wall:** 3×3, 5×3, or 7×5
   - **Floor:** 3×3, 5×5, or 9×9
4. **◇ Item Kits:** Builder Starter Kit, Redstone Starter Kit, Food Kit
5. **☀ World Settings:** Day, Night, Clear Weather, Rain
6. **□ Creator Tools:** Invisible Light ×64, Barriers ×64, Structure Voids ×64

World time and weather are shared world settings. Inventory grants, camera changes, player actions, saved locations, and ordinary travel target only the player who selected them.

## Home and Previous Location

Each player has one personal Home. Saving stores the dimension, coordinates, and facing direction in dynamic properties on that player entity, so it survives ordinary world saves and reloads. Saving again asks for confirmation before replacing the existing Home.

Every successful Spell Book teleport stores the departure point as Previous Location. Returning to Previous Location swaps the saved point only after arrival succeeds, allowing the player to move back and forth between the latest two locations. State is isolated by player, but follows the player entity within that world; it is not portable to another world and may be lost if external tooling recreates player data.

Saved destinations must have solid non-hazardous footing, two open blocks for the player, and no obvious adjacent hazard. If the exact point is unsafe, the add-on checks a bounded nearby area. It cancels with an explanation when no safe point is available. Nether and End actions prepare a small fixed obsidian landing area, add short Slow Falling and Resistance, and never perform an unbounded destination search.

## Quick Build safety

Quick Build reads the block in the player’s main hand. It supports only items whose identifier resolves to a placeable block, then asks for shape and preset size and shows a final confirmation with block, dimensions, and cardinal placement direction.

Operations are capped at 81 blocks. Every target is checked before placement; targets must be air or a small whitelist of naturally replaceable plants/snow. Floors additionally require solid footing under every cell. If any position is obstructed or unloaded, the entire build is cancelled—Quick Build never creates a partial structure or silently overwrites a build.

Undo Last Build is deferred to v0.3.0. A robust undo must preserve exact block permutations and verify that later player edits are not overwritten; that state/conflict system is intentionally outside this prototype.

## Emote limitation

The stable API can request an animation by identifier, but Bedrock does not expose a dependable built-in player-emote catalog for add-ons. The four Emotes entries are visibly marked **Coming Later** and explain the limitation when selected. A future custom animation pack can fill these routing points; v0.2.0 never reports an emote as played when none was verified.

## In-game testing

1. Import `artifacts/players-spell-book-v0.2.0.mcaddon` and activate the behavior pack and its linked resource pack.
2. Confirm no experimental gameplay toggles are required.
3. Obtain the book from Creative inventory and open every main category and Back button.
4. Test Home and Previous Location with two players, across reloads, and in each dimension.
5. Test unsafe travel targets near lava, cactus, blocked headroom, and unloaded distant Home locations.
6. Test each camera and player action, confirming only the invoking player changes.
7. Hold common full blocks and try every Quick Build preset on flat ground; also verify non-block items, obstruction, uneven floor footing, and menu cancellation.
8. Test Nether and End arrival platforms in a disposable world before using them in an established world.

## Development

Requires Node.js 22+ and pnpm 11.

```sh
pnpm install
pnpm typecheck
pnpm validate
pnpm build
pnpm export
```

`pnpm build` produces linked packs under `dist/`. `pnpm export` writes `artifacts/players-spell-book-v0.2.0.mcaddon`. Development builds automatically expose the version, Git branch, commit SHA, dirty state, and build timestamp. Set `BUILD_MODE=release` to remove development-only runtime diagnostics, source maps, and development labels.

## Project layout

- `behavior_pack/` — manifests and the custom item definition
- `resource_pack/` — localization and the custom book icon
- `src/book/` — item-use handling and generic menu routing
- `src/menus/` — declarative menu definitions
- `src/travel/` — persistent location storage, destination safety, and teleport coordination
- `src/player/` — camera, player actions, and emote routing
- `src/quick-build/` — held-block validation, placement calculations, and build execution
- `src/spells/` — existing item and world actions
- `src/ui/` — forms and player feedback
- `tools/` — validation, build, clean, and `.mcaddon` export scripts

## Deferred features

- Safe random Overworld travel
- Multiple named waypoints
- Saved hotbar loadouts
- Advanced Quick Build shapes
- Custom Quick Build dimensions
- Quick Build material browser
- Undo Last Build with state/conflict protection
- Custom UI icon font
- Full custom emote and animation pack
- Continuous coordinate display
- Camera sensitivity or aim-assist settings

No runtime plugin dependency on Chaos TNT is introduced. The End arrival algorithm was adapted from that sibling project’s stable API approach, not imported as a package.
