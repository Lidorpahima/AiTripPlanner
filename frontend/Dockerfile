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

# Cache buster for this stage - change value to force rebuild
ENV FORCE_REBUILD_BUILDER=4 

# Declare ARGs for this stage to receive values
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_SEARCH_KEY
ARG NEXT_PUBLIC_BREVO_CONVERSATIONS_ID
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Set NEXT_PUBLIC_ environment variables for Next.js build time
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_SEARCH_KEY=$NEXT_PUBLIC_SEARCH_KEY
ENV NEXT_PUBLIC_BREVO_CONVERSATIONS_ID=$NEXT_PUBLIC_BREVO_CONVERSATIONS_ID
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# --- Sanity check for build-time ENV variables ---
RUN echo "Builder - NEXT_PUBLIC_API_URL: '$NEXT_PUBLIC_API_URL'"

# Copy pnpm dependency files
COPY package.json pnpm-lock.yaml* ./
# If you have an .npmrc file relevant to pnpm in your frontend directory, copy it too:
# COPY .npmrc ./

# Install dependencies using pnpm (includes devDependencies)
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the Next.js application for production
ENV NODE_ENV=production
RUN pnpm run build

#---------------------------------------------
# Runner Stage
#---------------------------------------------
FROM node:18-alpine AS runner

# Cache buster for this stage - change value to force rebuild
ENV FORCE_REBUILD_RUNNER=4

# Declare ARGs if they need to be passed to runtime ENVs (optional if already baked in)
ARG NEXT_PUBLIC_API_URL
# Add other ARGs if their values are needed for runtime ENVs set below

WORKDIR /app

ENV NODE_ENV=production
# Set runtime environment variables if your server.js needs them.
# NEXT_PUBLIC_ vars are already baked into client-side code by `pnpm run build`.
# Only set them here if server-side code (server.js, API routes in standalone) needs them at runtime.
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL 
# Example for a server-side only variable (if you had one defined as ARG and passed from Railway):
# ARG OPENROUTER_API_KEY_ARG 
# ENV OPENROUTER_API_KEY=$OPENROUTER_API_KEY_ARG


# Copy necessary artifacts from the builder stage for standalone output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port the application will listen on
# Railway will map this to an external port and provide the $PORT env var
EXPOSE 3000

# CMD for debugging runtime issues - captures errors from server.js
CMD node -e "console.log('--- RUNTIME LOG: Attempting to start server.js ---'); \
            console.log('RUNTIME LOG: NODE_ENV =', process.env.NODE_ENV); \
            console.log('RUNTIME LOG: Listening on PORT =', process.env.PORT); \
            console.log('RUNTIME LOG: NEXT_PUBLIC_API_URL (available to server if set in runner ENVs) =', process.env.NEXT_PUBLIC_API_URL); \
            console.log('RUNTIME LOG: OPENROUTER_API_KEY is set (available to server if set in runner ENVs) =', !!process.env.OPENROUTER_API_KEY); \
            try { \
              require('./server.js'); \
            } catch (e) { \
              console.error('--- RUNTIME LOG: CRITICAL ERROR LOADING OR RUNNING server.js ---'); \
              console.error('Error Message:', e.message); \
              console.error('Error Stack:', e.stack); \
              process.exit(1); \
            }"

# Once everything is working, you can revert to the simpler CMD:
# CMD ["node", "server.js"]