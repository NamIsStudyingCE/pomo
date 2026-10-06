// Build ban desktop (static export) cho Electron.
// GIU NGUYEN env Supabase tu .env.local: ban desktop ket noi DB day du nhu ban web
// (anon key la public-by-design, bao ve bang RLS; ban web van nhung cong khai trong JS).
// Chi dat BUILD_TARGET=desktop de bat output: export.
import { spawnSync } from "node:child_process";

process.env.BUILD_TARGET = "desktop";

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 1);
