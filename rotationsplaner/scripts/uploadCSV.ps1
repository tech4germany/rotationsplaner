Add-Type -Path 'C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\16\ISAPI\Microsoft.SharePoint.Client.dll'      #path for DLL which helps to run powershell scripts
$csv = import-csv -Path ".\data\transformed.csv"
$listName = "Tasks"

Connect-PnPOnline –Url https://rotationsportal.sp4.ovh.net -UseWebLogin # feel free to close this window if authenticated once
$context = Get-PnPContext
[Microsoft.SharePoint.Client.Web]$web = $context.Web
[Microsoft.SharePoint.Client.List]$list = $web.Lists.GetByTitle($listName)

$ListItems = $List.GetItems([Microsoft.SharePoint.Client.CamlQuery]::CreateAllItemsQuery())
$Context.Load($ListItems)
$Context.ExecuteQuery()

# Skip deletion
#write-host "Total Number of List Items found to Delete:"$ListItems.Count
#
#if ($ListItems.Count -gt 0)
#{
#  #Loop through each item and delete
#  For ($i = $ListItems.Count-1; $i -ge 0; $iÂ–)
#  {
#    $ListItems[$i].DeleteObject()
#  }
#  $Context.ExecuteQuery()
#
#  Write-Host "All Existing List Items deleted Successfully!"
#}

foreach ($row in $csv) {
  [Microsoft.SharePoint.Client.ListItemCreationInformation]$itemCreateInfo = New-Object Microsoft.SharePoint.Client.ListItemCreationInformation;
  [Microsoft.SharePoint.Client.ListItem]$item = $list.AddItem($itemCreateInfo);
  $item["Kategorie"] = $row.Kategorie;
  $item["Title"] = $row.Aufgabe;
  $item["Beschreibung"] = $row.Beschreibung;
  $item["Gesetz"] = $row.Gesetz;
  $item["Formular"] = $row.Formular;
  # TODO Tags
  # TODO Kontakt via KontaktId

  $item.Update();
  $context.ExecuteQuery();
}

Write-Host "All CSV Items Imported Successfully if no errors were presented"
