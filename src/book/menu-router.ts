import type { Player } from "@minecraft/server";
import { logDevelopmentError } from "../diagnostics";
import { mainMenu } from "../menus";
import type { MenuDefinition } from "../types";
import { failure } from "../ui/feedback";
import { showActionForm } from "../ui/forms";

export async function showMainMenu(player: Player): Promise<void> {
  await showMenu(player, mainMenu, true);
}

async function showMenu(
  player: Player,
  menu: MenuDefinition,
  isRoot = false,
): Promise<void> {
  while (player.isValid) {
    const buttons = menu.entries.map((entry) => entry.label);
    if (!isRoot) buttons.push("← Back");

    const selection = await showActionForm(player, {
      title: menu.title,
      body: menu.body,
      buttons,
    });
    if (selection === undefined) return;
    if (!isRoot && selection === menu.entries.length) return;

    const entry = menu.entries[selection];
    if (!entry) return;

    if (entry.kind === "submenu") {
      await showMenu(player, entry.menu);
      continue;
    }

    try {
      await entry.run(player);
    } catch (error) {
      failure(player, "That action could not be completed. Nothing else was changed.");
      logDevelopmentError(`action failure (${menu.id}/${entry.label})`, error);
    }
  }
}
