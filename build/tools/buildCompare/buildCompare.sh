#!/bin/sh

if [ $# -ne 2 ]; then
  echo "Compares two jquery-ui builds. Useful for testing changes to build scripts."
  echo "Both the build folder and zip file contents are compared."
  echo "To use: do a build, copy it somewhere, make changes to build scripts, build again, then run this script to compare."
  echo "Be sure to copy the contents of the build/dist folder."
  echo ""
  echo "Usage: `basename $0` actualDir expectedDir"
  echo "No output means builds are identical."
  exit 1
fi

actual=$1
expected=$2
version="1.9pre"

prefix="jquery-ui-"
name="$prefix$version"
zipName="$name.zip"

diff -r "$actual/$name/" "$expected/$name/"

tmpActual=/tmp/jqTmpActual
tmpExpected=/tmp/jqTmpExpected

clean() {
  rm -rf $1
  mkdir -p $1
}

clean $tmpActual
clean $tmpExpected

unzip -q "$actual/$zipName" -d "$tmpActual/"
unzip -q "$expected/$zipName" -d "$tmpExpected/"

diff -r "$tmpActual/" "$tmpExpected/"
