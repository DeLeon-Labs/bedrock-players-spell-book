import type { Player } from "@minecraft/server";

export function success(player: Player, message: string): void {
  player.onScreenDisplay.setActionBar(`§b✦ §f${message}`);
}

export function explain(player: Player, message: string): void {
  player.sendMessage(`§5[Spell Book]§r ${message}`);
}

export function failure(player: Player, message: string): void {
  player.sendMessage(`§c[Spell Book] ${message}§r`);
}
