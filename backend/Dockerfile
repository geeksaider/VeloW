FROM node:18-alpine AS builder

WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm install --production
COPY . .

FROM node:18-alpine AS production

WORKDIR /app

# Копируем только необходимые файлы
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

EXPOSE 3000

CMD ["node", "server.js"]
