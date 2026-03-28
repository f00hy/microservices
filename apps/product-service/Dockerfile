FROM node:24-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/product-service/package.json ./apps/product-service/

RUN pnpm install --frozen-lockfile --filter "@apps/product-service..." --prod

COPY apps/product-service/src ./apps/product-service/src

WORKDIR /app/apps/product-service

RUN chown -R node:node /app

USER node

ENV NODE_ENV=production

EXPOSE 3002

CMD ["node", "src/server.js"]
