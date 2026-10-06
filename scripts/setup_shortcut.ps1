$sh = New-Object -ComObject WScript.Shell
$desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Pomo.lnk')
$sc = $sh.CreateShortcut($desktop)
$sc.TargetPath = 'C:\Windows\System32\wscript.exe'
$sc.Arguments = '""D:\pomo\launch-pomo.vbs""'
$sc.IconLocation = 'D:\pomo\public\pomo.ico,0'
$sc.Description = 'Pomo - Deep Work Tracker'
$sc.Save()
Write-Host "Updated Desktop Shortcut successfully!"
