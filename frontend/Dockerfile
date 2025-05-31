# Global ARGs for build-time environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_SEARCH_KEY
ARG NEXT_PUBLIC_BREVO_CONVERSATIONS_ID
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

#---------------------------------------------
# Builder Stage  
#---------------------------------------------
FROM node:18-slim AS builder

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_SEARCH_KEY
ARG NEXT_PUBLIC_BREVO_CONVERSATIONS_ID
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./
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

# Copy standalone output (זה כולל server.js מובנה)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# השתמש ב-server.js של Next.js standalone
CMD ["node", "server.js"]
