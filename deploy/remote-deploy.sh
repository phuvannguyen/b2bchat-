#!/usr/bin/env sh
# Runs on the server, called by the deploy workflow over SSH:
#   IMAGE_PREFIX=ghcr.io/org/repo IMAGE_TAG=abc123 sh remote-deploy.sh
set -eu
cd "$(dirname "$0")"

: "${IMAGE_PREFIX:?IMAGE_PREFIX is required}"
: "${IMAGE_TAG:?IMAGE_TAG is required}"
[ -f .env ] || { echo "Missing .env here — copy .env.example and fill it in." >&2; exit 1; }

printf 'IMAGE_PREFIX=%s\nIMAGE_TAG=%s\n' "$IMAGE_PREFIX" "$IMAGE_TAG" > release.env
compose() { docker compose --env-file .env --env-file release.env "$@"; }

compose pull
# Run database migrations here once the API has them, e.g.:
# compose run --rm api node dist/migrate.js
compose up -d --remove-orphans --wait
docker image prune -f >/dev/null
echo "Deployed $IMAGE_TAG"
