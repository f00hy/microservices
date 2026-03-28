FROM node:24-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/user-service/package.json ./apps/user-service/

RUN corepack enable
RUN pnpm install --frozen-lockfile --filter "@apps/user-service..." --prod

COPY apps/user-service/src ./apps/user-service/src

WORKDIR /app/apps/user-service

RUN chown -R node:node /app

USER node

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "src/server.js"]
