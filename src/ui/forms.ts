import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";
import type { Player } from "@minecraft/server";
import { logDevelopmentError } from "../diagnostics";
import { explain, failure } from "./feedback";

export interface ActionFormOptions {
  readonly title: string;
  readonly body: string;
  readonly buttons: readonly string[];
}

export async function showActionForm(
  player: Player,
  options: ActionFormOptions,
): Promise<number | undefined> {
  const form = new ActionFormData().title(options.title).body(options.body);
  for (const button of options.buttons) form.button(button);

  try {
    const response = await form.show(player);
    if (!response.canceled) return response.selection;

    if (response.cancelationReason === FormCancelationReason.UserClosed) {
      explain(player, "Menu closed. No changes were made.");
    } else {
      failure(player, "The menu could not open. Close chat or another screen, then try again.");
    }
    return undefined;
  } catch (error) {
    failure(player, "The menu could not open. Please try again.");
    logDevelopmentError("form failure", error);
    return undefined;
  }
}

export async function confirmAction(
  player: Player,
  title: string,
  body: string,
  confirmLabel = "Confirm",
): Promise<boolean> {
  const selection = await showActionForm(player, {
    title,
    body,
    buttons: [confirmLabel, "Cancel"],
  });
  if (selection === 0) return true;
  if (selection === 1) explain(player, "Cancelled. No changes were made.");
  return false;
}
