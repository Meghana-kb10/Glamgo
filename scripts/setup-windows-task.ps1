# PowerShell script to register a daily 24-hour Auto-Commit task in Windows Task Scheduler
# Run this once in an Administrator PowerShell window: powershell -ExecutionPolicy Bypass -File scripts/setup-windows-task.ps1

$TaskName = "Glamgo-Daily-Git-Sync"
$WorkspaceDir = "e:\Projects\Glamgo"
$Action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c cd /d $WorkspaceDir && npm run git:sync"
$Trigger = New-ScheduledTaskTrigger -Daily -At 11:59PM
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# Check if already exists and unregister
if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Description "Automatically commits and pushes Glamgo changes to GitHub every 24 hours."

Write-Host "✅ Scheduled Task '$TaskName' registered successfully! It will run daily at 11:59 PM." -ForegroundColor Green
