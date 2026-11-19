# syntax=docker/dockerfile:1
# Edge server: serves the exported web app and proxies /api to the API container.
# Build after `pnpm turbo run build --filter=app` (which writes apps/app/dist):
#   docker build -f deploy/web.Dockerfile .

FROM caddy:2-alpine
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY apps/app/dist /srv
