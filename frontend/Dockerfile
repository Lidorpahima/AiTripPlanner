FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

WORKDIR /app/.next/standalone

COPY --from=0 /app/public /app/.next/standalone/public
COPY --from=0 /app/.next/static /app/.next/standalone/.next/static

EXPOSE 3000 8080

CMD ["node", "server.js"]