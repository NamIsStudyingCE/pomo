// Nhan biet ban desktop (Electron): preload expose window.pomoDesktop truoc khi
// bat ky code renderer nao chay, nen doc dong bo ngay lan render dau (khong chop).
export function isDesktopApp(): boolean {
  return (
    typeof window !== "undefined" &&
    (window as unknown as { pomoDesktop?: { isDesktop?: boolean } }).pomoDesktop
      ?.isDesktop === true
  );
}
