# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
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

# Create dummy .env for build
RUN echo "DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy" > .env

# Install ALL dependencies (including devDependencies)
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

# Install production dependencies
RUN apk add --no-cache openssl libc6-compat

# Set up backend
WORKDIR /app/backend
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/backend/prisma ./prisma

# Create uploads directory
RUN mkdir -p uploads

# Install production dependencies
RUN npm ci --only=production

# Generate Prisma Client for production
RUN npx prisma generate

EXPOSE 5002
CMD ["npm", "start"] 