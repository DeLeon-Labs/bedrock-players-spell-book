import type { MenuDefinition } from "../types";
import {
  returnHome,
  returnToPersonalSpawn,
  returnToPreviousLocation,
  returnToWorldSpawn,
  saveCurrentLocationAsHome,
} from "../spells/travel";
import { teleportToEnd, teleportToNether } from "../travel/teleport";

export const travelMenu: MenuDefinition = {
  id: "travel",
  title: "◆ Travel",
  body: "Saved destinations are checked for safe footing and open headroom before travel.",
  entries: [
    { kind: "action", label: "Return to World Spawn", run: returnToWorldSpawn },
    { kind: "action", label: "Return to Personal Spawn", run: returnToPersonalSpawn },
    { kind: "action", label: "Save Current Location as Home", run: saveCurrentLocationAsHome },
    { kind: "action", label: "Return Home", run: returnHome },
    { kind: "action", label: "Return to Previous Location", run: returnToPreviousLocation },
    { kind: "action", label: "Teleport to Nether", run: teleportToNether },
    { kind: "action", label: "Teleport to End", run: teleportToEnd },
  ],
};
