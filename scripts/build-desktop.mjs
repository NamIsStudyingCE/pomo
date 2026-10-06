// Build ban desktop (static export) cho Electron.
// GIU NGUYEN env Supabase tu .env.local: ban desktop ket noi DB day du nhu ban web
// (anon key la public-by-design, bao ve bang RLS; ban web van nhung cong khai trong JS).
// Chi dat BUILD_TARGET=desktop de bat output: export.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

process.env.BUILD_TARGET = "desktop";

const root = process.cwd();
const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

if ((result.status ?? 1) === 0) {
  // Voi distDir tuy bien (.next-desktop), Next xuat ban tinh vao chinh thu muc do,
  // khong vao out/. Dong bo sang out/ de electron-builder, serve-out va main.cjs
  // (OUT_DIR = out/) luon dung ban moi nhat, khong bao gio dong goi ban cu.
  const from = join(root, ".next-desktop");
  const to = join(root, "out");
  if (!existsSync(from)) {
    console.error("Khong thay ban export o .next-desktop, dung build.");
    process.exit(1);
  }
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
  console.log("Da dong bo .next-desktop -> out/");
}

process.exit(result.status ?? 1);
