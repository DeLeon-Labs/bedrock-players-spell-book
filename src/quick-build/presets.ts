import type { BuildPreset, BuildShape } from "./types";

export const BUILD_PRESETS: Readonly<Record<BuildShape, readonly BuildPreset[]>> = {
  stack: [3, 6, 9, 15].map((height) => ({
    label: `${height} blocks high`,
    width: 1,
    height,
    depth: 1,
  })),
  wall: [
    { label: "3 × 3", width: 3, height: 3, depth: 1 },
    { label: "5 × 3", width: 5, height: 3, depth: 1 },
    { label: "7 × 5", width: 7, height: 5, depth: 1 },
  ],
  floor: [3, 5, 9].map((size) => ({
    label: `${size} × ${size}`,
    width: size,
    height: 1,
    depth: size,
  })),
};

export function shapeLabel(shape: BuildShape): string {
  return shape.charAt(0).toUpperCase() + shape.slice(1);
}

export function dimensionsLabel(preset: BuildPreset): string {
  if (preset.depth === 1 && preset.width === 1) return `1 × ${preset.height} × 1`;
  if (preset.depth === 1) return `${preset.width} × ${preset.height}`;
  return `${preset.width} × ${preset.depth}`;
}
