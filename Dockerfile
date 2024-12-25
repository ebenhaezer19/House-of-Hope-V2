# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies including OpenSSL
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    openssl \
    openssl-dev \
    libc6-compat

# Copy backend files first
WORKDIR /app/backend
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/prisma ./prisma/
COPY backend/src ./src/

# Create .env file for build time
RUN echo "DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy" > .env

# Install backend dependencies
RUN npm install

# Generate Prisma Client (will use dummy DATABASE_URL)
RUN npx prisma generate

# Build backend
RUN npm run build

# Production stage
FROM node:18-alpine

# Install production dependencies
RUN apk add --no-cache \
    openssl \
    libc6-compat

# Set up backend
WORKDIR /app/backend
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/backend/prisma ./prisma

# Generate Prisma Client again for production (will use real DATABASE_URL)
RUN npm install
RUN npx prisma generate

# Expose port
EXPOSE 5002

# Start command
CMD ["npm", "start"] 