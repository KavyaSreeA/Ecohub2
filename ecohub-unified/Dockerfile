# EcoHub Platform - Production Dockerfile
# Multi-stage build for optimized image size

# ==================== Stage 1: Build Frontend ====================
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# ==================== Stage 2: Production ====================
FROM node:20-alpine AS production

WORKDIR /app

# Install only production dependencies for server
COPY package*.json ./
RUN npm ci --only=production

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/dist ./dist

# Copy server files
COPY server ./server

# Create non-root user for security
RUN addgroup -g 1001 -S ecohub && \
    adduser -S ecohub -u 1001
USER ecohub

# Expose port
EXPOSE 4000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1

# Start the server
CMD ["node", "server/index.js"]
