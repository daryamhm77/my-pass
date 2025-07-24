# ---------- DEVELOPMENT STAGE ----------
FROM node:20-alpine AS development

WORKDIR /workspace

COPY . .

RUN npm install
RUN npm run build:payments

# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /workspace

COPY package.json package-lock.json ./
RUN npm install --omit=dev --ignore-scripts

COPY --from=development /workspace/dist ./dist

CMD ["node", "dist/apps/payments/main"]
    