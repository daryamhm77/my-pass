# ---------- DEVELOPMENT STAGE ----------
    FROM node:20-alpine AS development

    WORKDIR /usr/src/app
    

    COPY package.json package-lock.json ./
    RUN npm install
    

    COPY nest-cli.json tsconfig*.json ./
    COPY apps ./apps
    COPY libs ./libs
    

    RUN npm run build:payments
    
    # ---------- PRODUCTION STAGE ----------
    FROM node:20-alpine AS production
    
    ARG NODE_ENV=production
    ENV NODE_ENV=${NODE_ENV}
    
    WORKDIR /usr/src/app
    
    COPY package.json package-lock.json ./
    RUN npm install --omit=dev
    
    COPY --from=development /usr/src/app/dist ./dist
    
    CMD ["node", "dist/apps/payments/main"]
    