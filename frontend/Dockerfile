FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps # הוספתי --legacy-peer-deps למקרה הצורך, אפשר להסיר אם אין בעיות תאימות

COPY . .
RUN echo "NEXT_PUBLIC_API_URL in build: $NEXT_PUBLIC_API_URL"

ENV NODE_ENV production
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json* ./package-lock.json*
RUN npm install --only=production --legacy-peer-deps

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000


CMD ["node", "server.js"]