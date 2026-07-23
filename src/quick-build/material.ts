import {
  BlockPermutation,
  BlockTypes,
  EntityComponentTypes,
  EquipmentSlot,
  type Player,
} from "@minecraft/server";
import type { BuildMaterial } from "./types";

function titleCaseIdentifier(typeId: string): string {
  return typeId
    .replace(/^minecraft:/, "")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getHeldBuildMaterial(player: Player): BuildMaterial | undefined {
  const equipment = player.getComponent(EntityComponentTypes.Equippable);
  const item = equipment?.getEquipment(EquipmentSlot.Mainhand);
  if (!item || !BlockTypes.get(item.typeId)) return undefined;

  try {
    return {
      typeId: item.typeId,
      displayName: titleCaseIdentifier(item.typeId),
      permutation: BlockPermutation.resolve(item.typeId),
    };
  } catch {
    return undefined;
  }
}
