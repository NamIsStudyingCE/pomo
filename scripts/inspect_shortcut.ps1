$sh = New-Object -ComObject WScript.Shell
$sc = $sh.CreateShortcut("C:\Users\nghna\OneDrive\Desktop\Pomo.lnk")
Write-Output "TargetPath: $($sc.TargetPath)"
Write-Output "Arguments: $($sc.Arguments)"
Write-Output "IconLocation: $($sc.IconLocation)"
