# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies including OpenSSL 3
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    openssl \
    openssl-dev \
    libc6-compat

# Copy backend files
WORKDIR /app/backend
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/prisma ./prisma/
COPY backend/src ./src/

# Install dependencies
RUN npm install
RUN npm install -g typescript

# Generate Prisma Client
RUN npx prisma generate

# Build backend
RUN npm run build

# Production stage
FROM node:18-alpine

# Install production dependencies
RUN apk add --no-cache \
    openssl \
    libc6-compat \
    curl

# Set up backend
WORKDIR /app/backend
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/backend/prisma ./prisma

# Create uploads directory
RUN mkdir -p uploads && chmod 777 uploads

# Generate Prisma Client for production
RUN npx prisma generate

# Add database migration/push step
RUN npx prisma db push --accept-data-loss

# Add Docker healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:${PORT}/health || exit 1

# Expose port
EXPOSE 5002

# Start command
CMD ["npm", "start"] 