Connect-PnPOnline -Url https://rotationsportal.sp4.ovh.net -UseWebLogin
$filename = ".\rotationsportal_export.xml"
Get-PnPProvisioningTemplate -Out $filename -Handlers All -PersistBrandingFiles

# add data from lists
$exportDataFrom = @("Tasks","Preferences","Dienstorte", "Dienstorte Links", "Task-Kategorien")
foreach ($list in $exportDataFrom){
  Write-Host "Exporting data from " $list
  Add-PnPDataRowsToProvisioningTemplate -Path $filename -List $list -Query '<view></view>'
}

# TODO assert that ReadSecurity="2" WriteSecurity="2" is set for the relevant lists
