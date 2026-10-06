// Preload toi thieu: sandbox bat, khong expose API ngoai mot flag nhan biet desktop.
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("pomoDesktop", {
  isDesktop: true,
  platform: process.platform,
});
