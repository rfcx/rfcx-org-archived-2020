#!/bin/bash
git checkout aws_push;
git merge master -m "Merge with master";
git aws.push;
git checkout master;
eb status;