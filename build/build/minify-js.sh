#!/bin/bash
dir=$(dirname $0)
`which node nodejs` $dir/uglify.js $1 > $2
