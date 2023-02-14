#!/usr/bin/env bash
# run from rotationsplaner directory
destination="/Volumes/USB DISK/Tech4Germany/"
gulp clean
gulp build
gulp bundle --ship
gulp package-solution --ship
rm -r "${destination}/*"
cp -r temp "${destination}"
cp -r sharepoint "${destination}"
