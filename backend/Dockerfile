# syntax=docker/dockerfile:1

ARG NODE_VERSION=20-alpine

# ---- Base with pnpm ----
FROM node:${NODE_VERSION} AS base
WORKDIR /app
ENV CI=true
RUN npm i -g pnpm@9.12.2

# ---- Dependencies (cached) ----
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- Dev (tsx watch) ----
FROM deps AS dev
ENV NODE_ENV=development
COPY . .
EXPOSE 8081
# Prisma generate for type safety (optional in dev)
RUN pnpm prisma generate || true
CMD ["pnpm", "dev"]

# ---- Build (tsc) ----
FROM deps AS build
ENV NODE_ENV=production
COPY . .
RUN pnpm prisma generate \
  && pnpm build \
  && mkdir -p build/src/uploads \
  && cp -r src/uploads/* build/src/uploads/ 2>/dev/null || true

# ---- Runtime (Prod) ----
FROM node:${NODE_VERSION} AS production
WORKDIR /app
ENV NODE_ENV=production

# Only keep runtime deps, but pnpm hoists prod deps already
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/prisma ./prisma
COPY package.json ./package.json
COPY docker-entrypoint.sh ./docker-entrypoint.sh

# Ensure entrypoint is executable
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 8081

ENTRYPOINT ["./docker-entrypoint.sh"]
