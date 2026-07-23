import type { Player } from "@minecraft/server";
import { explain, failure, success } from "../ui/feedback";
import { confirmAction, showActionForm } from "../ui/forms";
import { executeBuild } from "./executor";
import { getHeldBuildMaterial } from "./material";
import { createBuildPlan, countObstructions } from "./placement";
import { BUILD_PRESETS, dimensionsLabel, shapeLabel } from "./presets";
import type { BuildShape } from "./types";

export async function startQuickBuild(player: Player, shape: BuildShape): Promise<void> {
  const material = getHeldBuildMaterial(player);
  if (!material) {
    explain(player, "Hold a placeable full block in your main hand, then try Quick Build again.");
    return;
  }

  const presets = BUILD_PRESETS[shape];
  const selection = await showActionForm(player, {
    title: `${shapeLabel(shape)} Size`,
    body: `Held block: ${material.displayName}\nChoose a preset size.`,
    buttons: [...presets.map((preset) => preset.label), "← Back"],
  });
  if (selection === undefined || selection === presets.length) return;
  const preset = presets[selection];
  if (!preset) return;

  const plan = createBuildPlan(player, material, shape, preset);
  if (!plan) {
    failure(player, "No suitable nearby ground was found, or the build would exceed its safety limit.");
    return;
  }

  const obstructed = countObstructions(plan);
  if (obstructed > 0) {
    failure(player, `${obstructed} build position${obstructed === 1 ? " is" : "s are"} obstructed. Nothing was placed.`);
    return;
  }

  const confirmed = await confirmAction(
    player,
    "Confirm Quick Build",
    `Block: ${material.displayName}\nShape: ${shapeLabel(shape)}\nDimensions: ${dimensionsLabel(preset)}\nDirection: ${plan.direction.name}\nBlocks: ${plan.positions.length}`,
    "Build",
  );
  if (!confirmed) return;

  const result = executeBuild(plan);
  if (result.status === "blocked") {
    failure(player, `${result.obstructed} position${result.obstructed === 1 ? " became" : "s became"} obstructed. Nothing was placed.`);
  } else if (result.status === "failed") {
    failure(player, "Quick Build stopped unexpectedly and restored the positions it had changed.");
  } else {
    success(player, `${shapeLabel(shape)} built with ${result.changed} blocks.`);
  }
}
