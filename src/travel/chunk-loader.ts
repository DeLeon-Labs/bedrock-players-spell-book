import { system, type Dimension, type Vector3 } from "@minecraft/server";
import { logDevelopmentError } from "../diagnostics";

const MAX_LOAD_ATTEMPTS = 40;
let areaSequence = 0;

function afterTicks(ticks: number): Promise<void> {
  return new Promise((resolve) => system.runTimeout(resolve, ticks));
}

export interface LoadedDestination {
  readonly loaded: boolean;
  readonly release: () => void;
}

export async function loadDestinationChunk(
  dimension: Dimension,
  destination: Vector3,
): Promise<LoadedDestination> {
  const location = {
    x: Math.floor(destination.x),
    y: Math.floor(destination.y),
    z: Math.floor(destination.z),
  };
  if (dimension.isChunkLoaded(location)) return { loaded: true, release: () => undefined };

  const areaName = `spellbook_travel_${++areaSequence}`;
  const release = (): void => {
    try {
      dimension.runCommand(`tickingarea remove ${areaName}`);
    } catch (error) {
      logDevelopmentError(`could not remove ticking area ${areaName}`, error);
    }
  };

  try {
    dimension.runCommand(
      `tickingarea add circle ${location.x} ${location.y} ${location.z} 1 ${areaName} true`,
    );
  } catch (error) {
    logDevelopmentError("could not request destination chunk", error);
    return { loaded: false, release: () => undefined };
  }

  for (let attempt = 0; attempt < MAX_LOAD_ATTEMPTS; attempt += 1) {
    await afterTicks(2);
    if (dimension.isChunkLoaded(location)) return { loaded: true, release };
  }

  release();
  return { loaded: false, release: () => undefined };
}
