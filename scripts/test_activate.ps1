$sh = New-Object -ComObject WScript.Shell
$res = $sh.AppActivate("Pomo - Deep Work Tracker")
Write-Host "AppActivate full:" $res

if (-not $res) {
    $res2 = $sh.AppActivate("Pomo")
    Write-Host "AppActivate Pomo:" $res2
}
