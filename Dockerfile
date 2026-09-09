FROM oven/bun AS builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun i


COPY . .


RUN bun run build

FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json bun.lock ./

COPY --from=builder /app/dist ./dist


EXPOSE 3000

CMD ["node", "dist/server.js"]