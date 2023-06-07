FROM node:18-alpine

RUN npm i -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm run format
RUN pnpm run lint:fix

EXPOSE 3000 3001