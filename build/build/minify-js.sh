#!/bin/bash
dir=$(dirname $0)
`which node nodejs 2> /dev/null` $dir/uglify.js $1 > $2
