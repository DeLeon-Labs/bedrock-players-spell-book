import { world, type Dimension, type Player, type Vector3 } from "@minecraft/server";
import { logDevelopmentError } from "../diagnostics";
import { failure, success } from "../ui/feedback";
import { confirmAction } from "../ui/forms";
import { loadDestinationChunk } from "./chunk-loader";
import { captureLocation, setPrevious } from "./location-storage";
import { findSafeDestination } from "./safety";
import type { SavedLocation } from "./types";

function getDimension(dimensionId: string): Dimension | undefined {
  try {
    return world.getDimension(dimensionId);
  } catch (error) {
    logDevelopmentError(`unknown dimension ${dimensionId}`, error);
    return undefined;
  }
}

export async function teleportToSavedLocation(
  player: Player,
  requested: SavedLocation,
  successMessage: string,
): Promise<boolean> {
  const dimension = getDimension(requested.dimensionId);
  if (!dimension) {
    failure(player, "That saved dimension is unavailable in this world.");
    return false;
  }

  const loaded = await loadDestinationChunk(dimension, requested);
  if (!loaded.loaded) {
    failure(player, "The destination could not be loaded safely. You stayed where you were.");
    return false;
  }

  try {
    const destination = findSafeDestination(dimension, requested);
    if (!destination) {
      failure(player, "No safe space was found near that destination. Teleport cancelled.");
      return false;
    }

    const departure = captureLocation(player);
    const moved = player.tryTeleport(destination, {
      dimension,
      checkForBlocks: true,
      keepVelocity: false,
    });
    if (!moved) {
      failure(player, "The destination became blocked. Teleport cancelled.");
      return false;
    }

    setPrevious(player, departure);
    if (requested.rotation) player.setRotation(requested.rotation);
    success(player, successMessage);
    return true;
  } finally {
    loaded.release();
  }
}

interface PreparedArrival {
  readonly dimensionId: string;
  readonly destination: Vector3;
  readonly platformY: number;
  readonly label: string;
}

function prepareArrivalPlatform(dimension: Dimension, destination: Vector3, platformY: number): void {
  const centerX = Math.floor(destination.x);
  const centerZ = Math.floor(destination.z);
  for (let x = centerX - 2; x <= centerX + 2; x += 1) {
    for (let z = centerZ - 2; z <= centerZ + 2; z += 1) {
      dimension.setBlockType({ x, y: platformY, z }, "minecraft:obsidian");
    }
  }
  for (let x = centerX - 1; x <= centerX + 1; x += 1) {
    for (let y = platformY + 1; y <= platformY + 3; y += 1) {
      for (let z = centerZ - 1; z <= centerZ + 1; z += 1) {
        dimension.setBlockType({ x, y, z }, "minecraft:air");
      }
    }
  }
}

function addArrivalProtection(player: Player): void {
  player.clearVelocity();
  player.addEffect("minecraft:slow_falling", 120, { amplifier: 0, showParticles: false });
  player.addEffect("minecraft:resistance", 120, { amplifier: 4, showParticles: false });
}

async function teleportToPreparedArrival(player: Player, arrival: PreparedArrival): Promise<void> {
  const confirmed = await confirmAction(
    player,
    `Teleport to ${arrival.label}?`,
    "This prepares a fixed 5 × 5 obsidian landing platform and clears a small safety space at the destination.",
    "Teleport",
  );
  if (!confirmed) return;

  const dimension = getDimension(arrival.dimensionId);
  if (!dimension) {
    failure(player, `${arrival.label} is unavailable in this world.`);
    return;
  }

  const loaded = await loadDestinationChunk(dimension, arrival.destination);
  if (!loaded.loaded) {
    failure(player, `${arrival.label} could not be prepared safely. You stayed where you were.`);
    return;
  }

  try {
    prepareArrivalPlatform(dimension, arrival.destination, arrival.platformY);
    const departure = captureLocation(player);
    const moved = player.tryTeleport(arrival.destination, {
      dimension,
      checkForBlocks: true,
      keepVelocity: false,
    });
    if (!moved) {
      failure(player, `${arrival.label} arrival was blocked. You stayed where you were.`);
      return;
    }

    setPrevious(player, departure);
    addArrivalProtection(player);
    dimension.playSound("mob.endermen.portal", arrival.destination);
    success(player, `Arrived safely in ${arrival.label}.`);
  } finally {
    loaded.release();
  }
}

export function teleportToNether(player: Player): Promise<void> {
  return teleportToPreparedArrival(player, {
    dimensionId: "minecraft:nether",
    destination: { x: 0.5, y: 81.1, z: 0.5 },
    platformY: 80,
    label: "the Nether",
  });
}

export function teleportToEnd(player: Player): Promise<void> {
  return teleportToPreparedArrival(player, {
    dimensionId: "minecraft:the_end",
    destination: { x: 100.5, y: 80.1, z: 0.5 },
    platformY: 79,
    label: "the End",
  });
}
