# ==============================================================================
# GLAMGO - MULTI-STAGE PRODUCTION DOCKERFILE
# ==============================================================================

# STAGE 1: Build React & Vite Assets
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies required for builds
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package configurations
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY index.html ./

# Install npm dependencies (including devDependencies for TypeScript compilation)
RUN npm ci

# Copy application source code
COPY src ./src
COPY public ./public

# Build the production client bundle
RUN npm run build

# ==============================================================================
# STAGE 2: Production Runtime
# ==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Install curl for container healthchecks
RUN apk add --no-cache curl

# Copy package manifests and install production-only dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built frontend assets from builder stage
COPY --from=builder /app/dist ./dist

# Copy backend server code and prisma assets
COPY server ./server
COPY docker ./docker

# Create non-root user for security
USER node

# Expose port
EXPOSE 4000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:4000/api/v1/health || exit 1

# Start production server
CMD ["npx", "tsx", "server/index.ts"]
