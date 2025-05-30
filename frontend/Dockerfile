# Global ARGs
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_SEARCH_KEY
ARG NEXT_PUBLIC_BREVO_CONVERSATIONS_ID
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

FROM node:18-slim AS builder

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_SEARCH_KEY
ARG NEXT_PUBLIC_BREVO_CONVERSATIONS_ID
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

WORKDIR /app

# Update npm and install pnpm
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./
COPY .npmrc ./

# Clean npm and pnpm caches
RUN npm cache clean --force
RUN pnpm store prune

RUN pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
RUN pnpm run build

#---------------------------------------------
# Runner Stage
#---------------------------------------------
    FROM node:20-alpine AS runner

    WORKDIR /app
    
    ENV NODE_ENV=production
    
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/server.js ./server.js
    
    EXPOSE 3000
    
    CMD ["node", "server.js"]
