FROM node:24-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/product-service/package.json ./apps/product-service/

RUN corepack enable
RUN pnpm install --frozen-lockfile --filter "@apps/product-service..." --prod

COPY apps/product-service/src ./apps/product-service/src

WORKDIR /app/apps/product-service

RUN chown -R node:node /app

USER node

ENV NODE_ENV=production

EXPOSE 3002

CMD ["node", "src/server.js"]
