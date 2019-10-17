#Set-PnPTraceLog -On -Level Debug

# Url zur Sitecollection anpassen
#$targetSiteUrl = "https://teams.bln-qsp.aa.bund.de/test/rotationsportal/"
$targetSiteUrl = "https://rotationsportal.sp4.ovh.net/reimport/"

#Connect-PnPOnline -Url $targetSiteUrl -UseWebLogin
Get-PnPContext
# hier müssen ggf. noch einige Knoten aus der XML entfernt werden
Apply-PnPProvisioningTemplate -Path rotationsportal_export.xml -ProvisionFieldsToSubWebs

# Inhalt der Site Assets (Skripte aus ../temp/deploy/)
#Apply-PnPProvisioningTemplate -Path Provision_Site_Assets.xml
