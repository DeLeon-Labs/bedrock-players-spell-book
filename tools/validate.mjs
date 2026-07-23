import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { root, version } from "./project.mjs";

const errors = [];
const expectedVersion = version.split(".").map(Number);
const behaviorPath = resolve(root, "behavior_pack/manifest.json");
const resourcePath = resolve(root, "resource_pack/manifest.json");

async function json(relativePath) {
  try {
    return JSON.parse(await readFile(resolve(root, relativePath), "utf8"));
  } catch (error) {
    errors.push(`${relativePath}: ${String(error)}`);
    return undefined;
  }
}

const behavior = await json("behavior_pack/manifest.json");
const resource = await json("resource_pack/manifest.json");
const item = await json("behavior_pack/items/players_spell_book.item.json");
const atlas = await json("resource_pack/textures/item_texture.json");
const mainMenuSource = await readFile(resolve(root, "src/menus/index.ts"), "utf8").catch(() => "");

for (const [name, manifest] of [["behavior", behavior], ["resource", resource]]) {
  if (!manifest) continue;
  if (manifest.format_version !== 2) errors.push(`${name} manifest format_version must be 2.`);
  if (JSON.stringify(manifest.header?.version) !== JSON.stringify(expectedVersion)) {
    errors.push(`${name} manifest version must match package version ${version}.`);
  }
  const uuids = [manifest.header?.uuid, ...manifest.modules.map((module) => module.uuid)];
  if (new Set(uuids).size !== uuids.length) errors.push(`${name} manifest UUIDs must be unique.`);
}

if (behavior && resource) {
  const resourceDependency = behavior.dependencies.find((entry) => entry.uuid === resource.header.uuid);
  if (!resourceDependency) errors.push("Behavior pack must depend on the resource pack UUID.");
  for (const dependency of [
    ["@minecraft/server", "2.8.0"],
    ["@minecraft/server-ui", "2.1.0"],
  ]) {
    const found = behavior.dependencies.find((entry) => entry.module_name === dependency[0]);
    if (found?.version !== dependency[1]) errors.push(`Missing stable ${dependency[0]} ${dependency[1]} dependency.`);
  }
}

if (item?.["minecraft:item"]?.description?.identifier !== "spellbook:players_spell_book") {
  errors.push("Custom spell-book item identifier is missing.");
}
if (!item?.["minecraft:item"]?.description?.menu_category) {
  errors.push("Custom spell-book item is not registered in Creative inventory.");
}
if (!atlas?.texture_data?.players_spell_book) errors.push("Spell-book item atlas entry is missing.");

const expectedMainMenuLabels = [
  "◆ Travel",
  "⚙ Player Utilities",
  "▦ Quick Build",
  "◇ Item Kits",
  "☀ World Settings",
  "□ Creator Tools",
];
let lastMenuIndex = -1;
for (const label of expectedMainMenuLabels) {
  const index = mainMenuSource.indexOf(`label: \"${label}\"`);
  if (index < 0) errors.push(`Main menu is missing ${label}.`);
  if (index >= 0 && index <= lastMenuIndex) errors.push(`Main menu order is incorrect at ${label}.`);
  lastMenuIndex = index;
}

for (const path of [
  "behavior_pack/pack_icon.png",
  "resource_pack/pack_icon.png",
  "resource_pack/textures/items/players_spell_book.png",
  "resource_pack/texts/en_US.lang",
  "resource_pack/texts/languages.json",
]) {
  try {
    await access(resolve(root, path));
  } catch {
    errors.push(`${path} is missing.`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated manifests, item registration, localization, and texture for v${version}.`);
}
