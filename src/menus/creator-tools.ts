import type { MenuDefinition } from "../types";
import { giveBarriers, giveInvisibleLight, giveStructureVoids } from "../spells/inventory";

export const creatorToolsMenu: MenuDefinition = {
  id: "creator-tools",
  title: "□ Creator Tools",
  body: "Advanced invisible and structure-planning blocks for experienced creators.",
  entries: [
    { kind: "action", label: "Invisible Light ×64", run: giveInvisibleLight },
    { kind: "action", label: "Barriers ×64", run: giveBarriers },
    { kind: "action", label: "Structure Voids ×64", run: giveStructureVoids },
  ],
};
