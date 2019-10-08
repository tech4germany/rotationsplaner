#Set-PnPTraceLog -On -Level Debug

# Url zur Sitecollection anpassen
$targetSiteUrl = "https://teams.bln-qsp.aa.bund.de/test/rotationsportal/"

Connect-PnPOnline -Url $targetSiteUrl

# hier müssen ggf. noch einige Knoten aus der XML entfernt werden
Apply-PnPProvisioningTemplate -Path rotationsportal_export.xml

# Inhalt der Site Assets (Skripte aus ../temp/deploy/)
Apply-PnPProvisioningTemplate -Path Provision_Site_Assets.xml
