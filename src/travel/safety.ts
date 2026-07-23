import type { Block, Dimension, Vector3 } from "@minecraft/server";

const SEARCH_RADIUS = 3;
const VERTICAL_SEARCH = 2;

const REPLACEABLE = new Set([
  "minecraft:air",
  "minecraft:cave_air",
  "minecraft:void_air",
  "minecraft:short_grass",
  "minecraft:tall_grass",
  "minecraft:fern",
  "minecraft:large_fern",
  "minecraft:deadbush",
  "minecraft:vine",
  "minecraft:snow_layer",
]);

const HAZARDS = new Set([
  "minecraft:lava",
  "minecraft:flowing_lava",
  "minecraft:fire",
  "minecraft:soul_fire",
  "minecraft:cactus",
  "minecraft:magma",
  "minecraft:magma_block",
  "minecraft:campfire",
  "minecraft:soul_campfire",
  "minecraft:sweet_berry_bush",
  "minecraft:powder_snow",
  "minecraft:pointed_dripstone",
  "minecraft:wither_rose",
]);

function isPassable(block: Block): boolean {
  return !block.isLiquid && REPLACEABLE.has(block.typeId) && !HAZARDS.has(block.typeId);
}

function isSafeFooting(block: Block): boolean {
  return !block.isAir && !block.isLiquid && !REPLACEABLE.has(block.typeId) && !HAZARDS.has(block.typeId);
}

function blockAt(dimension: Dimension, x: number, y: number, z: number): Block | undefined {
  return dimension.getBlock({ x, y, z });
}

export function isSafeDestination(dimension: Dimension, location: Vector3): boolean {
  const x = Math.floor(location.x);
  const y = Math.floor(location.y);
  const z = Math.floor(location.z);
  const { min, max } = dimension.heightRange;
  if (y - 1 < min || y + 1 >= max) return false;

  try {
    const footing = blockAt(dimension, x, y - 1, z);
    const feet = blockAt(dimension, x, y, z);
    const head = blockAt(dimension, x, y + 1, z);
    if (!footing || !feet || !head) return false;
    if (!isSafeFooting(footing) || !isPassable(feet) || !isPassable(head)) return false;

    for (const [dx, dz] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      for (const checkY of [y - 1, y, y + 1]) {
        const nearby = blockAt(dimension, x + dx, checkY, z + dz);
        if (!nearby || HAZARDS.has(nearby.typeId)) return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

function verticalOffsets(): number[] {
  const offsets = [0];
  for (let value = 1; value <= VERTICAL_SEARCH; value += 1) offsets.push(value, -value);
  return offsets;
}

export function findSafeDestination(
  dimension: Dimension,
  requested: Vector3,
): Vector3 | undefined {
  const baseX = Math.floor(requested.x);
  const baseY = Math.floor(requested.y);
  const baseZ = Math.floor(requested.z);
  const yOffsets = verticalOffsets();

  for (let radius = 0; radius <= SEARCH_RADIUS; radius += 1) {
    for (const dy of yOffsets) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        for (let dz = -radius; dz <= radius; dz += 1) {
          if (radius > 0 && Math.max(Math.abs(dx), Math.abs(dz)) !== radius) continue;
          const candidate = {
            x: radius === 0 ? requested.x : baseX + dx + 0.5,
            y: baseY + dy + 0.1,
            z: radius === 0 ? requested.z : baseZ + dz + 0.5,
          };
          if (isSafeDestination(dimension, candidate)) return candidate;
        }
      }
    }
  }
  return undefined;
}
