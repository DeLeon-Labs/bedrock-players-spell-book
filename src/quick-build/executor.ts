import type { BlockPermutation, Vector3 } from "@minecraft/server";
import { logDevelopmentError } from "../diagnostics";
import type { BuildPlan } from "./types";
import { countObstructions } from "./placement";

export type BuildResult =
  | { readonly status: "built"; readonly changed: number }
  | { readonly status: "blocked"; readonly obstructed: number }
  | { readonly status: "failed" };

interface PreviousBlock {
  readonly location: Vector3;
  readonly permutation: BlockPermutation;
}

export function executeBuild(plan: BuildPlan): BuildResult {
  const obstructed = countObstructions(plan);
  if (obstructed > 0) return { status: "blocked", obstructed };

  const changed: PreviousBlock[] = [];
  try {
    for (const location of plan.positions) {
      const block = plan.dimension.getBlock(location);
      if (!block) throw new Error("A target block became unavailable.");
      changed.push({ location, permutation: block.permutation });
      block.setPermutation(plan.material.permutation);
    }
    return { status: "built", changed: changed.length };
  } catch (error) {
    logDevelopmentError("Quick Build placement failed; rolling back", error);
    for (const previous of changed.reverse()) {
      try {
        plan.dimension.setBlockPermutation(previous.location, previous.permutation);
      } catch (rollbackError) {
        logDevelopmentError("Quick Build rollback failed", rollbackError);
      }
    }
    return { status: "failed" };
  }
}
