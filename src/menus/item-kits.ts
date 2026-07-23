import type { MenuDefinition } from "../types";
import { giveBuilderKit, giveFoodKit, giveRedstoneKit } from "../spells/inventory";

export const itemKitsMenu: MenuDefinition = {
  id: "item-kits",
  title: "◇ Item Kits",
  body: "Small starter sets granted only to your inventory.",
  entries: [
    { kind: "action", label: "Builder Starter Kit", run: giveBuilderKit },
    { kind: "action", label: "Redstone Starter Kit", run: giveRedstoneKit },
    { kind: "action", label: "Food Kit", run: giveFoodKit },
  ],
};
