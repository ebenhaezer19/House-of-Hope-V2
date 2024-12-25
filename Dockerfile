# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy root package files
COPY package*.json ./

# Copy backend package files
COPY backend/package*.json ./backend/

# Copy frontend package files
COPY frontend/package*.json ./frontend/

# Install dependencies for all packages
RUN npm install
RUN cd backend && npm install
RUN cd frontend && npm install

# Install TypeScript globally
RUN npm install -g typescript

# Copy prisma files
COPY backend/prisma ./backend/prisma/

# Generate Prisma Client
RUN cd backend && npx prisma generate

# Copy all source files
COPY . .

# Build backend
RUN cd backend && npm run build

# Build frontend
RUN cd frontend && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy backend build
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/backend/prisma ./backend/prisma

# Copy frontend build
COPY --from=builder /app/frontend/dist ./frontend/dist

# Set working directory to backend
WORKDIR /app/backend

# Install production dependencies only
RUN npm ci --only=production

# Expose port
EXPOSE 5002

# Start command
CMD ["npm", "start"] 