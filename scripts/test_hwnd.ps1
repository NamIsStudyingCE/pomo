Add-Type @"
using System;
using System.Runtime.InteropServices;
public class WindowHelper {
    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    [DllImport("user32.dll")]
    public static extern bool IsIconic(IntPtr hWnd);
}
"@

$proc = Get-Process -Id 3152 -ErrorAction SilentlyContinue
if ($proc) {
    Write-Output "MainWindowHandle: $($proc.MainWindowHandle)"
    Write-Output "MainWindowTitle: $($proc.MainWindowTitle)"
}
