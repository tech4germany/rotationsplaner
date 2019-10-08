Connect-PnPOnline –Url https://rotationsportal.sp4.ovh.net -UseWebLogin
Get-PnPProvisioningTemplate -Out rotationsportal_export.xml -Handlers All -PersistBrandingFiles

# add data from lists
$exportDataFrom = @("Tasks","Preferences","wert3", "wert4", "wert5")
foreach ($list in $exportDataFrom){
  Write-Host "Exporting data from " $list
  Add-PnPDataRowsToProvisioningTemplate -Path .\rotationsportal_export.xml -List $list -Query '<view></view>'
}
