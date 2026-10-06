$brave = "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
$pomoUserData = "$env:LOCALAPPDATA\PomoApp\Data"
# Get processes that use this user-data-dir
$running = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like "*PomoApp*" }
Write-Output "Found PomoApp instances: $($running.Count)"
foreach ($p in $running) {
    Write-Output "PID: $($p.ProcessId), Cmd: $($p.CommandLine)"
}
