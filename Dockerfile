FROM node:22-alpine AS builder

WORKDIR /app

# =========================================================
# Build-time public variables
# These are required by Next.js if they are referenced
# during `next build`.
# =========================================================

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_GOOGLEANALYTICS_MEASUREMENT_ID
ARG NEXT_PUBLIC_CK_EDITOR_5
ARG NEXT_PUBLIC_CHAT_ENABLE_RECAPTCHA


ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_GOOGLEANALYTICS_MEASUREMENT_ID=$NEXT_PUBLIC_GOOGLEANALYTICS_MEASUREMENT_ID
ENV NEXT_PUBLIC_CK_EDITOR_5=$NEXT_PUBLIC_CK_EDITOR_5
ENV NEXT_PUBLIC_CHAT_ENABLE_RECAPTCHA=$NEXT_PUBLIC_CHAT_ENABLE_RECAPTCHA

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