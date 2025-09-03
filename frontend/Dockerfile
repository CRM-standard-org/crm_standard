# syntax=docker/dockerfile:1

# ---- Base (with PNPM) ----
ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS base
WORKDIR /app
ENV CI=true

# Install pnpm
RUN npm i -g pnpm@9.12.2

# Install deps (cached)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- Dev server (Vite HMR) ----
FROM base AS dev
ENV NODE_ENV=development
ARG VITE_BASE_API
ENV VITE_BASE_API=${VITE_BASE_API}

COPY . .
EXPOSE 5173
# --host exposes to 0.0.0.0 inside container for external access
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# ---- Build (Vite) ----
FROM base AS build
ENV NODE_ENV=production
ARG VITE_BASE_API
ENV VITE_BASE_API=${VITE_BASE_API}

COPY . .
# Use Vite directly to avoid TypeScript type-check blocking container builds
RUN pnpm vite build

# ---- Runtime (Nginx) ----
FROM nginx:1.27-alpine AS production
# SPA-friendly nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Static assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD wget -q -O - http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
