import type { Player } from "@minecraft/server";
import type { SavedLocation } from "./types";

const HOME_PROPERTY = "spellbook:home_v1";
const PREVIOUS_PROPERTY = "spellbook:previous_v1";
const DIMENSIONS = new Set([
  "minecraft:overworld",
  "minecraft:nether",
  "minecraft:the_end",
  "overworld",
  "nether",
  "the_end",
]);

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseLocation(value: unknown): SavedLocation | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const record: unknown = JSON.parse(value);
    if (!record || typeof record !== "object") return undefined;
    const location = record as Record<string, unknown>;
    if (
      location.schema !== 1 ||
      typeof location.dimensionId !== "string" ||
      !DIMENSIONS.has(location.dimensionId) ||
      !isFiniteNumber(location.x) ||
      !isFiniteNumber(location.y) ||
      !isFiniteNumber(location.z)
    ) {
      return undefined;
    }

    const rotationRecord = location.rotation;
    const rotation =
      rotationRecord &&
      typeof rotationRecord === "object" &&
      isFiniteNumber((rotationRecord as Record<string, unknown>).x) &&
      isFiniteNumber((rotationRecord as Record<string, unknown>).y)
        ? {
            x: (rotationRecord as { x: number }).x,
            y: (rotationRecord as { y: number }).y,
          }
        : undefined;

    return {
      schema: 1,
      dimensionId: location.dimensionId,
      x: location.x,
      y: location.y,
      z: location.z,
      rotation,
    };
  } catch {
    return undefined;
  }
}

function writeLocation(player: Player, property: string, location: SavedLocation): void {
  player.setDynamicProperty(property, JSON.stringify(location));
}

export function captureLocation(player: Player): SavedLocation {
  const { x, y, z } = player.location;
  return {
    schema: 1,
    dimensionId: player.dimension.id,
    x,
    y,
    z,
    rotation: player.getRotation(),
  };
}

export function getHome(player: Player): SavedLocation | undefined {
  return parseLocation(player.getDynamicProperty(HOME_PROPERTY));
}

export function setHome(player: Player, location: SavedLocation): void {
  writeLocation(player, HOME_PROPERTY, location);
}

export function getPrevious(player: Player): SavedLocation | undefined {
  return parseLocation(player.getDynamicProperty(PREVIOUS_PROPERTY));
}

export function setPrevious(player: Player, location: SavedLocation): void {
  writeLocation(player, PREVIOUS_PROPERTY, location);
}
