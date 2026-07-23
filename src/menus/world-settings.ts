import type { MenuDefinition } from "../types";
import {
  castClearSkies,
  castDaybreak,
  castGentleRain,
  castNightfall,
} from "../spells/world";

export const worldSettingsMenu: MenuDefinition = {
  id: "world-settings",
  title: "☀ World Settings",
  body: "These settings affect the shared world, not only your player.",
  entries: [
    { kind: "action", label: "Day", run: castDaybreak },
    { kind: "action", label: "Night", run: castNightfall },
    { kind: "action", label: "Clear Weather", run: castClearSkies },
    { kind: "action", label: "Rain", run: castGentleRain },
  ],
};
