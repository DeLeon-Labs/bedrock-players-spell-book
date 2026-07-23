import type { Vector2, Vector3 } from "@minecraft/server";

export interface SavedLocation extends Vector3 {
  readonly schema: 1;
  readonly dimensionId: string;
  readonly rotation?: Vector2;
}
