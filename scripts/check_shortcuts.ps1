$sh = New-Object -ComObject WScript.Shell
$lnkPath = "C:\Users\nghna\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Brave Apps\Pomo - Deep Work Tracker.lnk"
if (Test-Path $lnkPath) {
    $sc = $sh.CreateShortcut($lnkPath)
    Write-Host "TargetPath: $($sc.TargetPath)"
    Write-Host "Arguments: $($sc.Arguments)"
    Write-Host "IconLocation: $($sc.IconLocation)"
} else {
    Write-Host "Lnk not found"
}

$desktopLnk = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Pomo.lnk')
if (Test-Path $desktopLnk) {
    $sc2 = $sh.CreateShortcut($desktopLnk)
    Write-Host "Desktop TargetPath: $($sc2.TargetPath)"
    Write-Host "Desktop Arguments: $($sc2.Arguments)"
    Write-Host "Desktop IconLocation: $($sc2.IconLocation)"
}
