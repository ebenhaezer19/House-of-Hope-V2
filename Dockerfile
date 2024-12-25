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

# Install backend dependencies
RUN npm install
RUN npm install -g typescript
RUN npm install --save-dev @types/helmet @types/compression

# Set temporary DATABASE_URL for prisma generate
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Generate Prisma Client
RUN npx prisma generate

# Copy source files
COPY backend/src ./src/

# Debug and build backend
RUN echo "Starting build process..."
RUN ls -la
RUN npm run build || (echo "Build failed" && npm run build --verbose && exit 1)

# Setup frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
COPY frontend/index.html ./
COPY frontend/vite.config.js ./
COPY frontend/tailwind.config.js ./
COPY frontend/postcss.config.js ./
COPY frontend/src ./src/
COPY frontend/public ./public/

# Install frontend dependencies and build
RUN npm install
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

# Set up frontend static files
COPY --from=builder /app/frontend/dist ../frontend/dist

# Install production dependencies
RUN npm ci --only=production

# Set temporary DATABASE_URL for second prisma generate
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Generate Prisma Client again for production
RUN npx prisma generate

# Expose port
EXPOSE 5002

# Start command
CMD ["npm", "start"]