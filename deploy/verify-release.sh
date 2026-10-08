#!/bin/bash
set -euo pipefail
export LC_ALL=C

if [[ $# != 2 || ! $2 =~ ^[0-9a-f]{40}$ || ! -d $1 || -L $1 ]]; then
  echo "Usage: verify-release.sh RELEASE_DIRECTORY FULL_LOWERCASE_COMMIT_SHA" >&2
  exit 2
fi
cd "$1"
if [[ -n $(find . -mindepth 1 ! -type d ! -type f -print -quit) ]]; then
  echo "Release contains links or special files." >&2
  exit 1
fi
test -s SHA256SUMS
test -s index.html
test -s js/index.js
test -s css/index.css
test -s worksheets/placeholder-worksheet.pdf
[[ $(cat release.txt) == "$2" ]]
if grep -q 'cordova.js' index.html || [[ -e cordova.js ]]; then
  echo "Native Cordova runtime must not be in a browser release." >&2
  exit 1
fi

# Reject traversal, duplicates and missing/extra files before checking hashes.
awk '
  !/^[0-9a-f]+  [A-Za-z0-9_.\/-]+$/ { exit 1 }
  length($1) != 64 { exit 1 }
  $2 ~ /(^|\/)\./ || $2 ~ /^\// || $2 ~ /\/\// || $2 == "SHA256SUMS" { exit 1 }
  seen[$2]++ { exit 1 }
  END { if (NR == 0) exit 1 }
' SHA256SUMS || { echo "Invalid release manifest." >&2; exit 1; }
manifest_files=$(awk '{print $2}' SHA256SUMS | sort)
actual_files=$(find . -type f ! -path ./SHA256SUMS -printf '%P\n' | sort)
[[ $manifest_files == "$actual_files" ]] || { echo "Release inventory does not match manifest." >&2; exit 1; }
sha256sum --strict --check SHA256SUMS >/dev/null
echo "Release verified: $2"
