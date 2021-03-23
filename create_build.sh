#!/bin/bash

npm run build

DIR="../builds/dist"
if [ ! -d "$DIR" ]; then
  # Take action if $DIR exists. #
  echo "Installing config files in ${DIR}..."
  mkdir ../builds
  git clone https://github.com/jbsethi/pet-admin-build.git ../builds/dist
fi


# The old dist becomes saved as the version number you passed
mkdir ../builds/$1

mv ../builds/dist/* ../builds/$1
# The new dist created by build command can be used as latest deployment
mv build/* ../builds/dist

cd ../builds/dist

git config user.email "jahanzebsethi@gmail.com"
git config user.name "jbsethi"

git add .
git commit -m "Build version $1"
git push origin main