import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import { root } from "./project.mjs";

await Promise.all([
  rm(resolve(root, "dist"), { recursive: true, force: true }),
  rm(resolve(root, "artifacts"), { recursive: true, force: true }),
]);
console.log("Removed generated build and export artifacts.");
