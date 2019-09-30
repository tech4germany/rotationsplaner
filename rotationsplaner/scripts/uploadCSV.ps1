Add-Type -Path ‘C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\15\ISAPI\Microsoft.SharePoint.Client.dll’      #path for DLL which helps to run powershell scripts
$csv = import-csv -Path “.\data\Tasks.csv”  #Replace this CSV Path from your’s CSV
$siteUrl = “https://rotationsportal.sp4.ovh.net/" # ToDo: what is the correct url?
$listName = “Tasks”
$userName = “user@aa-sharepoint.tech4germany.org”    #Enter Site Username

$password = Read-Host -Prompt “Enter password” -AsSecureString
$ctx = New-Object Microsoft.SharePoint.Client.ClientContext($siteUrl)
$credentials = New-Object Microsoft.SharePoint.Client.SharePointOnlineCredentials($userName, $password)
$context = New-Object Microsoft.SharePoint.Client.ClientContext($siteUrl)
$context.Credentials = $credentials
[Microsoft.SharePoint.Client.Web]$web = $context.Web
[Microsoft.SharePoint.Client.List]$list = $web.Lists.GetByTitle($listName)

$ListItems = $List.GetItems([Microsoft.SharePoint.Client.CamlQuery]::CreateAllItemsQuery())
$Context.Load($ListItems)
$Context.ExecuteQuery()

# Skip deletion
#write-host “Total Number of List Items found to Delete:”$ListItems.Count
#
#if ($ListItems.Count -gt 0)
#{
#  #Loop through each item and delete
#  For ($i = $ListItems.Count-1; $i -ge 0; $i–)
#  {
#    $ListItems[$i].DeleteObject()
#  }
#  $Context.ExecuteQuery()
#
#  Write-Host “All Existing List Items deleted Successfully!”
#}

foreach ($row in $csv) {
  [Microsoft.SharePoint.Client.ListItemCreationInformation]$itemCreateInfo = New-Object Microsoft.SharePoint.Client.ListItemCreationInformation;
  [Microsoft.SharePoint.Client.ListItem]$item = $list.AddItem($itemCreateInfo);
  $item[“Title”] = $row.Title;    #Left Side “Title” is the Sharepoint List Column name and Right Side “Product” is the CSV Header name.
  $item[“Bescheibung”] = $row.Bescheibung;
  $item[“Links”] = $row.Links;
  $item[“Author”] = $row.Author;
  $item[“Labels”] = $row.Labels;
  $item[“Katgorie”] = $row.Katgorie;


  $item.Update();
  $context.ExecuteQuery();
}

Write-Host “All CSV Items Imported Successfully”
