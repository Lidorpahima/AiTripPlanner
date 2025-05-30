ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_SEARCH_KEY
ARG NEXT_PUBLIC_BREVO_CONVERSATIONS_ID
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# -----------------------------builder -----------------------------
FROM node:18-alpine AS builder
WORKDIR /app

# Set environment variables
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_SEARCH_KEY=$NEXT_PUBLIC_SEARCH_KEY
ENV NEXT_PUBLIC_BREVO_CONVERSATIONS_ID=$NEXT_PUBLIC_BREVO_CONVERSATIONS_ID
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NODE_ENV=production

# --------ENV CHECK --------
RUN echo "Value of NEXT_PUBLIC_API_URL during build: '$NEXT_PUBLIC_API_URL'"
RUN echo "Value of NEXT_PUBLIC_GOOGLE_CLIENT_ID during build: '$NEXT_PUBLIC_GOOGLE_CLIENT_ID'"

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# ----------------------------- runner -----------------------------
FROM node:18-alpine AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_SEARCH_KEY=$NEXT_PUBLIC_SEARCH_KEY
ENV NEXT_PUBLIC_BREVO_CONVERSATIONS_ID=$NEXT_PUBLIC_BREVO_CONVERSATIONS_ID
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]