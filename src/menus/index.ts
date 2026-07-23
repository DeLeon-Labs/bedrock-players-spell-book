import type { MenuDefinition } from "../types";
import { creatorToolsMenu } from "./creator-tools";
import { itemKitsMenu } from "./item-kits";
import { playerUtilitiesMenu } from "./player-utilities";
import { quickBuildMenu } from "./quick-build";
import { travelMenu } from "./travel";
import { worldSettingsMenu } from "./world-settings";

export const mainMenu: MenuDefinition = {
  id: "main",
  title: "Player's Spell Book",
  body: "Choose a utility category. Every action is predefined and safety-checked.",
  entries: [
    { kind: "submenu", label: "◆ Travel", menu: travelMenu },
    { kind: "submenu", label: "⚙ Player Utilities", menu: playerUtilitiesMenu },
    { kind: "submenu", label: "▦ Quick Build", menu: quickBuildMenu },
    { kind: "submenu", label: "◇ Item Kits", menu: itemKitsMenu },
    { kind: "submenu", label: "☀ World Settings", menu: worldSettingsMenu },
    { kind: "submenu", label: "□ Creator Tools", menu: creatorToolsMenu },
  ],
};
