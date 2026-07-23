import { system, world } from "@minecraft/server";
import { BOOK_ITEM_ID } from "../constants";
import { showMainMenu } from "./menu-router";
import { logDevelopmentError } from "../diagnostics";

const openMenus = new Set<string>();

export function registerBookItemUseHandler(): void {
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (itemStack.typeId !== BOOK_ITEM_ID || openMenus.has(source.id)) return;

    openMenus.add(source.id);
    system.run(() => {
      void showMainMenu(source)
        .catch((error: unknown) => logDevelopmentError("book menu failure", error))
        .finally(() => openMenus.delete(source.id));
    });
  });
}
