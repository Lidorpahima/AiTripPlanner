FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

COPY --from=0 /app/public ./public
COPY --from=0 /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]
