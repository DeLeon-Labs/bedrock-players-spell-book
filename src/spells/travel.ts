import { world, type Player } from "@minecraft/server";
import { explain, success } from "../ui/feedback";
import { confirmAction } from "../ui/forms";
import {
  captureLocation,
  getHome,
  getPrevious,
  setHome,
} from "../travel/location-storage";
import { teleportToSavedLocation } from "../travel/teleport";

export async function returnToWorldSpawn(player: Player): Promise<void> {
  const spawn = world.getDefaultSpawnLocation();
  await teleportToSavedLocation(
    player,
    { schema: 1, dimensionId: "minecraft:overworld", ...spawn },
    "Returned to World Spawn.",
  );
}

export async function returnToPersonalSpawn(player: Player): Promise<void> {
  const spawn = player.getSpawnPoint();
  if (!spawn) {
    explain(player, "No personal spawn is set. Sleep in a bed or charge a respawn anchor first.");
    return;
  }

  await teleportToSavedLocation(
    player,
    {
      schema: 1,
      dimensionId: spawn.dimension.id,
      x: spawn.x,
      y: spawn.y,
      z: spawn.z,
    },
    "Returned to Personal Spawn.",
  );
}

export async function saveCurrentLocationAsHome(player: Player): Promise<void> {
  if (getHome(player)) {
    const confirmed = await confirmAction(
      player,
      "Replace Home?",
      "You already have a Home. Replace it with your current location?",
      "Replace Home",
    );
    if (!confirmed) return;
  }

  setHome(player, captureLocation(player));
  success(player, "Current location saved as Home.");
}

export async function returnHome(player: Player): Promise<void> {
  const home = getHome(player);
  if (!home) {
    explain(player, "No Home is saved yet. Choose Save Current Location as Home first.");
    return;
  }
  await teleportToSavedLocation(player, home, "Returned Home.");
}

export async function returnToPreviousLocation(player: Player): Promise<void> {
  const previous = getPrevious(player);
  if (!previous) {
    explain(player, "No Previous Location is available yet. Complete another Spell Book teleport first.");
    return;
  }
  await teleportToSavedLocation(player, previous, "Returned to Previous Location.");
}
