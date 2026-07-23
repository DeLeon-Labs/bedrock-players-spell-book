import type { BlockPermutation, Dimension, Vector3 } from "@minecraft/server";
import type { CardinalDirection } from "../player/direction";

export type BuildShape = "stack" | "wall" | "floor";

export interface BuildPreset {
  readonly label: string;
  readonly width: number;
  readonly height: number;
  readonly depth: number;
}

export interface BuildMaterial {
  readonly typeId: string;
  readonly displayName: string;
  readonly permutation: BlockPermutation;
}

export interface BuildPlan {
  readonly shape: BuildShape;
  readonly preset: BuildPreset;
  readonly material: BuildMaterial;
  readonly direction: CardinalDirection;
  readonly dimension: Dimension;
  readonly positions: readonly Vector3[];
}
