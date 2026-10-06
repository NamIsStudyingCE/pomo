// Electron main process cho Pomo Desktop.
// Kien truc: static export (out/) phuc vu qua custom scheme app://, khong server, khong port.
// Bao mat: sandbox + contextIsolation + CSP + chan dieu huong ra ngoai.
const { app, BrowserWindow, Menu, net, protocol, shell } = require("electron");
const { join, normalize } = require("node:path");
const { pathToFileURL } = require("node:url");

const OUT_DIR = join(__dirname, "..", "out");
const SCHEME = "app";
const HOST = "pomo.local";

// CSP ap cho moi response app://. unsafe-inline can thiet vi Next.js inline script (theme init + RSC payload).
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

function resolveFile(requestUrl) {
  const { pathname } = new URL(requestUrl);
  let p = decodeURIComponent(pathname);
  if (p.endsWith("/")) p = `${p}index.html`;
  const filePath = normalize(join(OUT_DIR, p));
  // Chong path traversal: moi duong dan phai nam trong out/
  if (!filePath.startsWith(OUT_DIR)) return null;
  return filePath;
}

// Single instance: chay lai app chi focus cua so hien co (thay cho script launcher tren ban PWA)
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  /** @type {BrowserWindow | null} */
  let win = null;

  protocol.registerSchemesAsPrivileged([
    {
      scheme: SCHEME,
      privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true },
    },
  ]);

  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  function createWindow() {
    win = new BrowserWindow({
      width: 1200,
      height: 820,
      minWidth: 900,
      minHeight: 620,
      backgroundColor: "#FAF7F1",
      autoHideMenuBar: true,
      icon: join(__dirname, "..", "public", "pomo.ico"),
      webPreferences: {
        preload: join(__dirname, "preload.cjs"),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        spellcheck: false,
      },
    });

    Menu.setApplicationMenu(null);

    // Moi dieu huong/mo cua so ra ngoai app:// deu chan va mo bang trinh duyet mac dinh
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (!url.startsWith(`${SCHEME}://`)) {
        void shell.openExternal(url);
        return { action: "deny" };
      }
      return { action: "allow" };
    });
    win.webContents.on("will-navigate", (event, url) => {
      if (!url.startsWith(`${SCHEME}://`)) {
        event.preventDefault();
        void shell.openExternal(url);
      }
    });

    win.on("closed", () => {
      win = null;
    });

    void win.loadURL(`${SCHEME}://${HOST}/`);
  }

  void app.whenReady().then(() => {
    protocol.handle(SCHEME, async (request) => {
      const filePath = resolveFile(request.url);
      if (!filePath) return new Response("Not found", { status: 404 });
      try {
        const res = await net.fetch(pathToFileURL(filePath).toString());
        const headers = new Headers(res.headers);
        headers.set("Content-Security-Policy", CSP);
        return new Response(res.body, { status: res.status, headers });
      } catch {
        return new Response("Not found", { status: 404 });
      }
    });

    createWindow();
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}
