#!/usr/bin/env bash
gulp clean
gulp build
gulp bundle --ship
gulp package-solution --ship
