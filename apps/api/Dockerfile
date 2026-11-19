# syntax=docker/dockerfile:1
# Build from the repository root:  docker build -f apps/api/Dockerfile .

FROM node:24-alpine AS build
RUN npm install -g pnpm@12.21.0
WORKDIR /repo

# Download dependencies first so this layer is cached until the lockfile changes.
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch

COPY . .
RUN pnpm install --offline --frozen-lockfile --filter "api..." \
  && pnpm --filter "api..." run build \
  && pnpm --filter api deploy --prod /out

FROM node:24-alpine AS runtime
ARG APP_VERSION=dev
ENV NODE_ENV=production \
    APP_VERSION=${APP_VERSION} \
    PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /out ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/main.js"]
