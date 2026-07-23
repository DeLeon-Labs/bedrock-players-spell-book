import type { Player } from "@minecraft/server";

export type CardinalName = "North" | "East" | "South" | "West";

export interface CardinalDirection {
  readonly name: CardinalName;
  readonly forward: Readonly<{ x: number; z: number }>;
  readonly right: Readonly<{ x: number; z: number }>;
}

export function cardinalFromYaw(yaw: number): CardinalDirection {
  const normalized = ((yaw % 360) + 360) % 360;
  if (normalized < 45 || normalized >= 315) {
    return { name: "South", forward: { x: 0, z: 1 }, right: { x: -1, z: 0 } };
  }
  if (normalized < 135) {
    return { name: "West", forward: { x: -1, z: 0 }, right: { x: 0, z: -1 } };
  }
  if (normalized < 225) {
    return { name: "North", forward: { x: 0, z: -1 }, right: { x: 1, z: 0 } };
  }
  return { name: "East", forward: { x: 1, z: 0 }, right: { x: 0, z: 1 } };
}

export function getCardinalDirection(player: Player): CardinalDirection {
  return cardinalFromYaw(player.getRotation().y);
}
