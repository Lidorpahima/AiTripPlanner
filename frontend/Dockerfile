    ARG NEXT_PUBLIC_API_URL
    ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
    ARG NEXT_PUBLIC_SEARCH_KEY
    ARG NEXT_PUBLIC_BREVO_CONVERSATIONS_ID
    ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    
    # -----------------------------builder -----------------------------
    FROM node:18-alpine AS builder
    WORKDIR /app
    
    ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
    ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
    ENV NEXT_PUBLIC_SEARCH_KEY=$NEXT_PUBLIC_SEARCH_KEY
    ENV NEXT_PUBLIC_BREVO_CONVERSATIONS_ID=$NEXT_PUBLIC_BREVO_CONVERSATIONS_ID
    ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  
    
    ENV NODE_ENV=production
    
    # --------ENV CHECK --------
    RUN echo "Value of NEXT_PUBLIC_API_URL during build: '$NEXT_PUBLIC_API_URL'"
    RUN echo "Value of NEXT_PUBLIC_GOOGLE_CLIENT_ID during build: '$NEXT_PUBLIC_GOOGLE_CLIENT_ID'"
    
    # --------------------------- build ---------------------------
    COPY package.json package-lock.json* ./
    RUN npm install --legacy-peer-deps 
    
    COPY . .
    RUN npm run build
    
    # ----------------------------- runner -----------------------------
    FROM node:18-alpine AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production 
    
    COPY --from=builder /app/.next/standalone/ ./
    
    COPY --from=builder /app/public ./public
    
    COPY --from=builder /app/.next/static ./.next/static
    
    
    EXPOSE 3000 
    
    CMD ["node", "server.js"]