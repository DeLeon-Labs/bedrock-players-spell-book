import type { Player } from "@minecraft/server";
import { explain } from "../ui/feedback";

export function explainUnavailableEmote(player: Player): void {
  explain(
    player,
    "Coming later: this emote needs a tested custom animation pack. No animation was played.",
  );
}
