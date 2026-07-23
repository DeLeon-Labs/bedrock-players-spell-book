import { TimeOfDay, WeatherType, world, type Player } from "@minecraft/server";
import { success } from "../ui/feedback";

export function castDaybreak(player: Player): void {
  world.setTimeOfDay(TimeOfDay.Day);
  success(player, "World time set to Day.");
}

export function castNightfall(player: Player): void {
  world.setTimeOfDay(TimeOfDay.Night);
  success(player, "World time set to Night.");
}

export function castClearSkies(player: Player): void {
  player.dimension.setWeather(WeatherType.Clear);
  success(player, "Weather set to Clear.");
}

export function castGentleRain(player: Player): void {
  player.dimension.setWeather(WeatherType.Rain);
  success(player, "Weather set to Rain.");
}
