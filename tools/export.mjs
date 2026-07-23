import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { zipSync } from "fflate";
import { root, version } from "./project.mjs";

async function collect(directory, prefix, files = {}) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    const archivePath = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) await collect(path, archivePath, files);
    else files[archivePath] = new Uint8Array(await readFile(path));
  }
  return files;
}

const artifacts = resolve(root, "artifacts");
const output = resolve(artifacts, `players-spell-book-v${version}.mcaddon`);
const files = {};
await collect(resolve(root, "dist/behavior_pack"), "PlayersSpellBook_BP", files);
await collect(resolve(root, "dist/resource_pack"), "PlayersSpellBook_RP", files);
files["build-info.json"] = new Uint8Array(await readFile(resolve(root, "dist/build-info.json")));

await mkdir(artifacts, { recursive: true });
await writeFile(output, zipSync(files, { level: 9 }));
console.log(`Exported ${basename(output)} with ${Object.keys(files).length} files.`);
