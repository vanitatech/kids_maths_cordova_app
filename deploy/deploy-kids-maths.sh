#!/bin/bash
set -Eeuo pipefail
umask 077

if [[ $# != 1 || ! $1 =~ ^[0-9a-f]{40}$ ]]; then
  echo "Usage: deploy-kids-maths FULL_LOWERCASE_COMMIT_SHA" >&2
  exit 2
fi
if [[ $EUID != 0 ]]; then
  echo "Deployment must run as root." >&2
  exit 1
fi
exec 9>/run/lock/vanitatech-deploy.lock
flock -w 900 9 || { echo "Another deployment holds the server lock." >&2; exit 1; }

site=/var/www/kids-maths
for directory in "$site" "$site/releases"; do
  if [[ ! -d $directory || -L $directory || $(stat -c %u "$directory") != 0 ]] \
    || (( (8#$(stat -c %a "$directory") & 8#022) != 0 )); then
    echo "Release directories must be root-owned and not group/world writable." >&2
    exit 1
  fi
done
if [[ -e $site/current || -L $site/current ]]; then
  previous=$(readlink "$site/current") || { echo "Current must be a release symlink." >&2; exit 1; }
  [[ $previous =~ ^releases/[0-9a-f]{40}$ && -d $site/$previous ]] \
    || { echo "Unexpected current release target." >&2; exit 1; }
else
  previous=none
fi

container=
stage=
link=
cleanup() {
  if [[ -n $container ]]; then docker rm "$container" >/dev/null; fi
  if [[ -n $stage ]]; then rm -rf -- "$stage"; fi
  if [[ -n $link ]]; then rm -f -- "$link"; fi
}
trap cleanup EXIT
trap 'echo "Maths deployment failed. Check current and the protected deployment record before retrying; no automatic rollback was performed." >&2' ERR

image="ghcr.io/vanitatech/kids_maths_cordova_app:$1"
docker pull "$image"
container=$(docker create "$image")
stage=$(mktemp -d "$site/releases/.stage-XXXXXX")
docker cp "$container:/site/." "$stage/"
/usr/local/sbin/verify-kids-maths-release "$stage" "$1"
find "$stage" -type d -exec chmod 755 {} +
find "$stage" -type f -exec chmod 644 {} +
chown -R root:root "$stage"

release="$site/releases/$1"
if [[ -e $release || -L $release ]]; then
  /usr/local/sbin/verify-kids-maths-release "$release" "$1"
  cmp "$stage/SHA256SUMS" "$release/SHA256SUMS"
else
  mv -T "$stage" "$release"
  stage=
fi

install -d -m 700 /var/backups/vanitatech/kids-maths
record=$(mktemp -d /var/backups/vanitatech/kids-maths/deploy-XXXXXX)
printf '%s\n' "$previous" > "$record/previous-target"
printf '%s\n' "$1" > "$record/requested-sha"
date -u +%FT%TZ > "$record/started-at"
link="$site/.current-$(basename "$record")"
ln -s "releases/$1" "$link"
mv -Tf "$link" "$site/current"
link=

for asset in index.html js/index.js css/index.css js/lib/dexie.min.js worksheets/placeholder-worksheet.pdf release.txt; do
  curl --fail --silent --show-error --max-time 20 --noproxy '*' \
    --resolve vanitatech.co.uk:443:127.0.0.1 \
    "https://vanitatech.co.uk/demos/kids-maths/$asset" --output "$record/served"
  cmp "$release/$asset" "$record/served"
done
curl --fail --silent --show-error --max-time 20 --noproxy '*' \
  --resolve vanitatech.co.uk:443:127.0.0.1 \
  https://vanitatech.co.uk/demos/kids-maths/ --output "$record/served" \
  --dump-header "$record/headers"
cmp "$release/index.html" "$record/served"
grep -qiE '^cache-control:.*no-store' "$record/headers" \
  || { echo "Origin response must disable caching." >&2; exit 1; }
grep -qiE '^x-content-type-options: *nosniff' "$record/headers" \
  || { echo "Origin response must include nosniff." >&2; exit 1; }
printf 'verified\n' > "$record/status"
echo "Maths deployment succeeded: $1"
echo "Previous target: $previous"
echo "Deployment record: $record"
