import type { Player } from "@minecraft/server";
import { success } from "../ui/feedback";

function setCamera(player: Player, preset: string, label: string): void {
  player.camera.setCamera(preset);
  success(player, `${label} camera selected.`);
}

export function setFirstPerson(player: Player): void {
  setCamera(player, "minecraft:first_person", "First Person");
}

export function setThirdPersonBehind(player: Player): void {
  setCamera(player, "minecraft:third_person", "Third Person Behind");
}

export function setThirdPersonFront(player: Player): void {
  setCamera(player, "minecraft:third_person_front", "Third Person Front");
}

export function resetCamera(player: Player): void {
  player.camera.clear();
  success(player, "Camera returned to your normal setting.");
}
