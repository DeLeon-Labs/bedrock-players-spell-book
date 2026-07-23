import type { MenuDefinition } from "../types";
import {
  resetCamera,
  setFirstPerson,
  setThirdPersonBehind,
  setThirdPersonFront,
} from "../player/camera";
import { clearEffects, faceNorth, feed, heal, showCoordinates } from "../player/actions";
import { explainUnavailableEmote } from "../player/emotes";

const cameraMenu: MenuDefinition = {
  id: "camera",
  title: "Camera Settings",
  body: "Choose a view for your player. Reset returns control to your normal camera setting.",
  entries: [
    { kind: "action", label: "First Person", run: setFirstPerson },
    { kind: "action", label: "Third Person Behind", run: setThirdPersonBehind },
    { kind: "action", label: "Third Person Front", run: setThirdPersonFront },
    { kind: "action", label: "Reset Camera", run: resetCamera },
  ],
};

const playerActionsMenu: MenuDefinition = {
  id: "player-actions",
  title: "Player Actions",
  body: "Safe one-time actions for your current player only.",
  entries: [
    { kind: "action", label: "Heal", run: heal },
    { kind: "action", label: "Feed", run: feed },
    { kind: "action", label: "Clear Effects", run: clearEffects },
    { kind: "action", label: "Show Coordinates", run: showCoordinates },
    { kind: "action", label: "Face North", run: faceNorth },
  ],
};

const emotesMenu: MenuDefinition = {
  id: "emotes",
  title: "Emotes",
  body: "Custom player animations are planned for a later animation-pack release.",
  entries: [
    { kind: "action", label: "Friendly — Coming Later", run: explainUnavailableEmote },
    { kind: "action", label: "Dance — Coming Later", run: explainUnavailableEmote },
    { kind: "action", label: "Scary — Coming Later", run: explainUnavailableEmote },
    { kind: "action", label: "Celebrate — Coming Later", run: explainUnavailableEmote },
  ],
};

export const playerUtilitiesMenu: MenuDefinition = {
  id: "player-utilities",
  title: "⚙ Player Utilities",
  body: "Camera choices and practical actions, organized by purpose.",
  entries: [
    { kind: "submenu", label: "Camera Settings", menu: cameraMenu },
    { kind: "submenu", label: "Player Actions", menu: playerActionsMenu },
    { kind: "submenu", label: "Emotes", menu: emotesMenu },
  ],
};
