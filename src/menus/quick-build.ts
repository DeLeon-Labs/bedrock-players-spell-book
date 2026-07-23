import type { MenuDefinition } from "../types";
import { startQuickBuild } from "../quick-build/flow";

export const quickBuildMenu: MenuDefinition = {
  id: "quick-build",
  title: "▦ Quick Build",
  body: "Hold a placeable block, choose a shape and preset, then review the confirmation.",
  entries: [
    { kind: "action", label: "Stack", run: (player) => startQuickBuild(player, "stack") },
    { kind: "action", label: "Wall", run: (player) => startQuickBuild(player, "wall") },
    { kind: "action", label: "Floor", run: (player) => startQuickBuild(player, "floor") },
  ],
};
