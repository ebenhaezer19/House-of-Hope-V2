# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy root package files
COPY package*.json ./

# Copy backend files first
COPY backend/package*.json ./backend/
COPY backend/tsconfig.json ./backend/
COPY backend/prisma ./backend/prisma/
COPY backend/src ./backend/src/

# Copy frontend files
COPY frontend/package*.json ./frontend/
COPY frontend/src ./frontend/src/
COPY frontend/public ./frontend/public/
COPY frontend/index.html ./frontend/
COPY frontend/vite.config.js ./frontend/
COPY frontend/tailwind.config.js ./frontend/
COPY frontend/postcss.config.js ./frontend/

# Install dependencies for all packages
RUN npm install
RUN cd backend && npm install
RUN cd frontend && npm install

# Install TypeScript globally
RUN npm install -g typescript

# Generate Prisma Client
RUN cd backend && npx prisma generate

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