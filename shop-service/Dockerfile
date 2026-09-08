# Use Node.js LTS image
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]