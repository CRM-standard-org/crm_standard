#!/bin/sh
set -e

# Prisma migrations (safe to run on startup; skip in dev if desired)
if [ "$NODE_ENV" = "production" ]; then
  npx prisma migrate deploy || true
fi

# Start server
node build/src/index.js
