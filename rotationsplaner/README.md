## rotationsplaner

This is where you include your WebPart documentation.

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
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

