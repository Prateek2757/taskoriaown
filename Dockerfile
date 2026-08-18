FROM node:22-alpine AS builder

WORKDIR /app

# Public browser configuration is read from /api/runtime-config.js at container
# start. Do not add NEXT_PUBLIC_* build arguments here: Cloud Run supplies
# environment variables only when it starts the finished container.

# =========================================================
# Install dependencies
# =========================================================

COPY package.json package-lock.json ./

RUN npm ci

# =========================================================
# Application
# =========================================================

COPY . .

RUN npm run build


# =========================================================
# Production image
# =========================================================

FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 8080

CMD ["npm", "start", "--", "-p", "8080"]
