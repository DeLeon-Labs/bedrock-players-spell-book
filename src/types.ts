import type { Player } from "@minecraft/server";

export interface ActionMenuEntry {
  readonly kind: "action";
  readonly label: string;
  readonly run: (player: Player) => void | Promise<void>;
}

export interface SubmenuEntry {
  readonly kind: "submenu";
  readonly label: string;
  readonly menu: MenuDefinition;
}

export type MenuEntry = ActionMenuEntry | SubmenuEntry;

export interface MenuDefinition {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly entries: readonly MenuEntry[];
}
