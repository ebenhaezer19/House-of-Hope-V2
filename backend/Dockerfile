# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy app source
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5002

# Start command
CMD ["npm", "start"] 