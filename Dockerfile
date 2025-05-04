# ---- Stage 1: Install dependencies and build ----
FROM node:22-alpine AS builder

# Declare an overridable registry URL argument (defaults to Taobao mirror)
ARG NPM_REGISTRY_URL=https://registry.npmmirror.com/
# Configure npm to use the specified registry
ENV NPM_CONFIG_REGISTRY=${NPM_REGISTRY_URL}

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies (will use the domestic mirror)
RUN npm ci

# Copy the rest of the project files and build
COPY . .
RUN npm run build


# ---- Stage 2: Production image ----
FROM node:22-alpine AS runner

# Set production environment
ENV NODE_ENV=production
# Continue using the same registry URL
ARG NPM_REGISTRY_URL
ENV NPM_CONFIG_REGISTRY=${NPM_REGISTRY_URL}

WORKDIR /app

# Copy build artifacts from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Expose application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
