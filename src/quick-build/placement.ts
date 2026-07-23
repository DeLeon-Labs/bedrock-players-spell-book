import type { Block, Dimension, Player, Vector3 } from "@minecraft/server";
import { getCardinalDirection } from "../player/direction";
import type { BuildMaterial, BuildPlan, BuildPreset, BuildShape } from "./types";

const MAX_CHANGED_BLOCKS = 81;
const GROUND_SCAN_UP = 2;
const GROUND_SCAN_DOWN = 6;

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

export function isReplaceable(block: Block): boolean {
  return !block.isLiquid && REPLACEABLE.has(block.typeId);
}

function isGround(block: Block | undefined): boolean {
  return Boolean(block && !block.isAir && !block.isLiquid && !REPLACEABLE.has(block.typeId));
}

function findGroundY(dimension: Dimension, x: number, z: number, nearY: number): number | undefined {
  for (let y = nearY + GROUND_SCAN_UP; y >= nearY - GROUND_SCAN_DOWN; y -= 1) {
    try {
      const ground = dimension.getBlock({ x, y, z });
      const above = dimension.getBlock({ x, y: y + 1, z });
      if (isGround(ground) && above && isReplaceable(above)) return y;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export function createBuildPlan(
  player: Player,
  material: BuildMaterial,
  shape: BuildShape,
  preset: BuildPreset,
): BuildPlan | undefined {
  const direction = getCardinalDirection(player);
  const playerX = Math.floor(player.location.x);
  const playerY = Math.floor(player.location.y);
  const playerZ = Math.floor(player.location.z);
  const frontDistance = shape === "floor" ? 2 + Math.floor((preset.depth - 1) / 2) : 2;
  const anchorX = playerX + direction.forward.x * frontDistance;
  const anchorZ = playerZ + direction.forward.z * frontDistance;
  const groundY = findGroundY(player.dimension, anchorX, anchorZ, playerY);
  if (groundY === undefined) return undefined;

  const positions: Vector3[] = [];
  if (shape === "stack") {
    for (let y = 1; y <= preset.height; y += 1) {
      positions.push({ x: anchorX, y: groundY + y, z: anchorZ });
    }
  } else if (shape === "wall") {
    const halfWidth = Math.floor(preset.width / 2);
    for (let across = -halfWidth; across <= halfWidth; across += 1) {
      for (let y = 1; y <= preset.height; y += 1) {
        positions.push({
          x: anchorX + direction.right.x * across,
          y: groundY + y,
          z: anchorZ + direction.right.z * across,
        });
      }
    }
  } else {
    const halfWidth = Math.floor(preset.width / 2);
    const firstDepth = -Math.floor((preset.depth - 1) / 2);
    for (let depth = 0; depth < preset.depth; depth += 1) {
      for (let across = -halfWidth; across <= halfWidth; across += 1) {
        const forwardOffset = firstDepth + depth;
        positions.push({
          x: anchorX + direction.forward.x * forwardOffset + direction.right.x * across,
          y: groundY + 1,
          z: anchorZ + direction.forward.z * forwardOffset + direction.right.z * across,
        });
      }
    }
  }

  if (positions.length === 0 || positions.length > MAX_CHANGED_BLOCKS) return undefined;
  return { shape, preset, material, direction, dimension: player.dimension, positions };
}

export function countObstructions(plan: BuildPlan): number {
  let obstructed = 0;
  const { min, max } = plan.dimension.heightRange;
  for (const position of plan.positions) {
    if (position.y < min || position.y >= max) {
      obstructed += 1;
      continue;
    }
    try {
      const target = plan.dimension.getBlock(position);
      if (!target || !isReplaceable(target)) {
        obstructed += 1;
        continue;
      }
      if (plan.shape === "floor") {
        const below = plan.dimension.getBlock({
          x: position.x,
          y: position.y - 1,
          z: position.z,
        });
        if (!isGround(below)) obstructed += 1;
      }
    } catch {
      obstructed += 1;
    }
  }
  return obstructed;
}
