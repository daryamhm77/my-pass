# ---------- Base Stage ----------
FROM node:20-alpine AS base

WORKDIR /usr/src/app

RUN apk add --no-cache curl tini

# ---------- Dependencies Stage ----------
FROM base AS dependencies

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY apps/notifications/package.json ./apps/notifications/
COPY libs/common/package.json ./libs/common/

RUN npm install --legacy-peer-deps --no-optional

# ---------- Build Stage ----------
FROM dependencies AS build

COPY . .

RUN npm run build:notifications

# ---------- Development Stage ----------
FROM dependencies AS development

COPY . .

CMD ["npm", "run", "start:dev:notifications"]

# ---------- Production Stage ----------
FROM base AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Install build dependencies for native modules (needed for some prod modules)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY apps/notifications/package.json ./apps/notifications/
COPY libs/common/package.json ./libs/common/

RUN npm install --legacy-peer-deps --no-optional --omit=dev

COPY --from=build /usr/src/app/dist ./dist

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3004/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]

RUN addgroup -S app && adduser -S app -G app
USER app

CMD ["node", "dist/apps/notifications/main"]
    