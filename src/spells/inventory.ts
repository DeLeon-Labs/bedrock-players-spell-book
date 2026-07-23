import {
  EntityInventoryComponent,
  ItemStack,
  type Player,
} from "@minecraft/server";
import { success } from "../ui/feedback";

type KitEntry = readonly [itemId: string, amount: number];

function giveItems(player: Player, entries: readonly KitEntry[]): void {
  const inventory = player.getComponent(EntityInventoryComponent.componentId);
  if (!inventory?.container) {
    throw new Error("Player inventory is unavailable.");
  }

  for (const [itemId, amount] of entries) {
    const overflow = inventory.container.addItem(new ItemStack(itemId, amount));
    if (overflow) {
      player.dimension.spawnItem(overflow, player.location);
    }
  }
}

export function giveInvisibleLight(player: Player): void {
  giveItems(player, [["minecraft:light_block_15", 64]]);
  success(player, "64 maximum-brightness light blocks granted.");
}

export function giveBarriers(player: Player): void {
  giveItems(player, [["minecraft:barrier", 64]]);
  success(player, "64 barrier blocks granted.");
}

export function giveStructureVoids(player: Player): void {
  giveItems(player, [["minecraft:structure_void", 64]]);
  success(player, "64 structure void blocks granted.");
}

export function giveBuilderKit(player: Player): void {
  giveItems(player, [
    ["minecraft:stone", 64],
    ["minecraft:oak_planks", 64],
    ["minecraft:glass", 32],
    ["minecraft:torch", 32],
    ["minecraft:ladder", 16],
  ]);
  success(player, "Builder Starter Kit granted.");
}

export function giveRedstoneKit(player: Player): void {
  giveItems(player, [
    ["minecraft:redstone", 64],
    ["minecraft:repeater", 16],
    ["minecraft:comparator", 8],
    ["minecraft:observer", 8],
    ["minecraft:piston", 16],
    ["minecraft:sticky_piston", 8],
    ["minecraft:lever", 8],
  ]);
  success(player, "Redstone Starter Kit granted.");
}

export function giveFoodKit(player: Player): void {
  giveItems(player, [
    ["minecraft:bread", 16],
    ["minecraft:cooked_beef", 16],
    ["minecraft:baked_potato", 16],
    ["minecraft:golden_apple", 2],
  ]);
  success(player, "Food Kit granted.");
}
