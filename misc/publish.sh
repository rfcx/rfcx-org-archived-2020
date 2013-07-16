#!/bin/bash
node _publish-prep.js;
read -p "Are you sure? " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo -e "\nPushing to prod.\n"
else
  echo -e "\nNOT pushed to prod.\n"
fi