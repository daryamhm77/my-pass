# ---------- Base Stage ----------
FROM node:20-alpine AS base

WORKDIR /usr/src/app

# Install dependencies for health check and tini
RUN apk add --no-cache curl tini

# ---------- Dependencies Stage ----------
FROM base AS dependencies

# Copy package files
COPY package*.json .npmrc ./
COPY apps/notifications/package.json ./apps/notifications/
COPY libs/common/package.json ./libs/common/

# Install dependencies with legacy peer deps and no optional
RUN npm install --legacy-peer-deps --no-optional

# ---------- Development Stage ----------
FROM dependencies AS development

# Copy source code
COPY . .

# Build the application
RUN npm run build:notifications

# ---------- Production Stage ----------
FROM base AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copy package files and install production dependencies
COPY package*.json .npmrc ./
COPY apps/notifications/package.json ./apps/notifications/
COPY libs/common/package.json ./libs/common/
RUN npm install --legacy-peer-deps --no-optional --omit=dev

# Copy built application
COPY --from=development /usr/src/app/dist ./dist

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Use tini as init system
ENTRYPOINT ["/sbin/tini", "--"]

# Set user for security
RUN addgroup -S app && adduser -S app -G app
USER app

CMD ["node", "dist/apps/notifications/main"]
    