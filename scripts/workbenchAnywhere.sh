#!/usr/bin/env bash
# this rewrites references to localhost to allow the workbench to be accessed not just from localhost
# also remember to set e.g. "hostname": "10.0.2.2" in config/serve.json
host=10.0.2.2
sed -i "" "s https://localhost:4321 https://${host}:4321 g" "temp/workbench.html"
