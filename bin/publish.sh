#!/usr/bin/env bash

export SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
cd $SCRIPT_DIR;

node publish_prep.js;
cd ../;
#rm -Rf node_modules;
#npm install;
npm test;
read -p "Are you sure you would like to push this version to prod? (y/n): " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo -e "\nPushing to prod.\n"
  eb deploy;
else
  echo -e "\nNOT pushed to prod.\n";
fi