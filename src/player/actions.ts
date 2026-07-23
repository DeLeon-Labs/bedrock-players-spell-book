import { EntityComponentTypes, type Player } from "@minecraft/server";
import { getCardinalDirection } from "./direction";
import { explain, success } from "../ui/feedback";

export function heal(player: Player): void {
  const health = player.getComponent(EntityComponentTypes.Health);
  if (!health) throw new Error("Health component is unavailable.");
  health.resetToMaxValue();
  success(player, "Health restored.");
}

export function feed(player: Player): void {
  const hunger = player.getComponent(EntityComponentTypes.Hunger);
  const saturation = player.getComponent(EntityComponentTypes.Saturation);
  const exhaustion = player.getComponent(EntityComponentTypes.Exhaustion);
  if (!hunger || !saturation) throw new Error("Food attributes are unavailable.");

  hunger.resetToMaxValue();
  saturation.resetToMaxValue();
  exhaustion?.resetToMinValue();
  success(player, "Hunger and saturation restored.");
}

export function clearEffects(player: Player): void {
  const effects = player.getEffects();
  for (const effect of effects) player.removeEffect(effect.typeId);
  success(player, effects.length === 0 ? "No active effects to clear." : "Active effects cleared.");
}

export function showCoordinates(player: Player): void {
  const { x, y, z } = player.location;
  const facing = getCardinalDirection(player).name;
  const dimension = player.dimension.id.replace("minecraft:", "");
  explain(
    player,
    `${dimension} · X ${Math.floor(x)} · Y ${Math.floor(y)} · Z ${Math.floor(z)} · Facing ${facing}`,
  );
}

export function faceNorth(player: Player): void {
  const rotation = player.getRotation();
  player.setRotation({ x: rotation.x, y: 180 });
  success(player, "Now facing North.");
}
