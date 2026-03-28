FROM node:24-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api-gateway/package.json ./apps/api-gateway/

RUN corepack enable
RUN pnpm install --frozen-lockfile --filter "@apps/api-gateway..." --prod

COPY apps/api-gateway/src ./apps/api-gateway/src

WORKDIR /app/apps/api-gateway

RUN chown -R node:node /app

USER node

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/server.js"]
