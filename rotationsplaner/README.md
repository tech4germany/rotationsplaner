## rotationsplaner

This is where you include your WebPart documentation.

### Building the code
* use node verison 8.11.3

```bash
git clone the repo
npm i
npm i -g gulp
gulp trust-dev-cert
NODE_NO_HTTP2=1 gulp serve
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO

### Creating a deployment package
The following commands are taken from [this tutorial](http://www.sharepointsamples.com/deploy-sharepoint-framework-webpart-to-sharepoint-site/).

```bash
gulp clean
gulp build
gulp bundle --ship
gulp package-solution --ship
```

This will produce the following artifacts:
1. the `sharepoint/solution` folder with the .sppkg file to go to the App Catalog

2. The `temp/deploy` folder contains the artifacts to be deployed to the Site Asset Library (or CDN). In theory, they can be included in the .sppkg, but this didn't work when we tried it. Instead, the set the target destination in  `config/write-manifests.json` and upload everything from `temp/deploy` to that destination (e.g. SharePoint SiteAssets).
asd


### Exporting the site contents
In PowerShell, run the following (credentials for our hosted SharePoint can be found in Trello):
```
Connect-PnPOnline –Url https://rotationsportal.sp4.ovh.net -UseWebLogin
Get-PnPProvisioningTemplate -Out rotationsportal2019-09-30.xml -Handlers All -PersistBrandingFiles -PersistPublishingFiles –IncludeNativePublishingFiles
Add-PnPDataRowsToProvisioningTemplate -Path .\rotationsportal2019-09-30.xml -List 'Tasks' -Query '<view></view>'
```

Helpful resource: <https://medium.com/swlh/sharepoint-pnp-provisioning-with-data-move-your-contents-from-one-site-to-another-in-sharepoint-ed009f4a9e58>
