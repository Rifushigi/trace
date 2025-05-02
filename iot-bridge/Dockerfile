# Use Node.js LTS version
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm build

# Expose port
EXPOSE 4000

# Start the application
CMD ["pnpm", "serve"] 