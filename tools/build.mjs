import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "esbuild";
import { getBuildInfo, root } from "./project.mjs";

const output = resolve(root, "dist");
const mode = process.env.BUILD_MODE === "release" ? "release" : "development";
const dev = mode === "development";
const info = getBuildInfo();

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(root, "behavior_pack"), resolve(output, "behavior_pack"), { recursive: true });
await cp(resolve(root, "resource_pack"), resolve(output, "resource_pack"), { recursive: true });

for (const pack of ["behavior_pack", "resource_pack"]) {
  const path = resolve(output, pack, "manifest.json");
  const manifest = JSON.parse(await readFile(path, "utf8"));
  manifest.header.description = manifest.header.description.replace(
    /\(development v[^)]+\)/,
    dev ? `(development v${info.version} ${info.branch}@${info.commit}${info.dirty ? " dirty" : ""} ${info.builtAt})` : `(v${info.version})`,
  );
  await writeFile(path, `${JSON.stringify(manifest, null, 2)}\n`);
}

await mkdir(resolve(output, "behavior_pack", "scripts"), { recursive: true });
await build({
  entryPoints: [resolve(root, "src/main.ts")],
  outfile: resolve(output, "behavior_pack", "scripts/main.js"),
  bundle: true,
  format: "esm",
  platform: "neutral",
  target: "es2021",
  external: ["@minecraft/server", "@minecraft/server-ui"],
  define: {
    __DEV__: JSON.stringify(dev),
    __BUILD_INFO__: JSON.stringify(info),
  },
  minify: !dev,
  sourcemap: dev,
  treeShaking: true,
});

await writeFile(resolve(output, "build-info.json"), `${JSON.stringify({ mode, ...info }, null, 2)}\n`);
console.log(`Built ${mode} v${info.version} (${info.branch}@${info.commit}${info.dirty ? ", dirty" : ""}).`);
