#!/bin/bash

npm run build
# The old dist becomes saved as the version number you passed
mv ../builds/dist ../builds/$1
# The new dist created by build command can be used as latest deployment
mv build/* ../builds/dist
cd ../builds/dist

git add .
git commit -m "Build $1 created"
git push origin main
