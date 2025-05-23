# ---- Stage 1: Install dependencies and build ----
FROM node:22-alpine AS builder

# Declare an overridable registry URL argument (defaults to Taobao mirror)
ARG NPM_REGISTRY_URL=https://registry.npmmirror.com/
# Configure npm to use the specified registry
ENV NPM_CONFIG_REGISTRY=${NPM_REGISTRY_URL}

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency definitions
COPY package.json pnpm-lock.yaml .npmrc ./

# Install dependencies (will use the domestic mirror)
RUN pnpm install --frozen-lockfile

# Copy the rest of the project files and build
COPY . .
RUN pnpm run build


# ---- Stage 2: Production image ----
FROM node:22-alpine AS runner

# Set production environment
ENV NODE_ENV=production
# Continue using the same registry URL
ARG NPM_REGISTRY_URL
ENV NPM_CONFIG_REGISTRY=${NPM_REGISTRY_URL}

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy build artifacts from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/.npmrc ./

# Expose application port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
