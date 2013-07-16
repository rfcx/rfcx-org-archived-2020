#!/bin/bash
cd misc;
node _publish-prep.js;
cd ../;
read -p "Are you sure you would like to push this version to prod? (y/n): " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo -e "\nPushing to prod.\n"
else
  echo -e "\nNOT pushed to prod.\n"
fi
git checkout master;
eb status;