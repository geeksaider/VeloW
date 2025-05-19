FROM node:18-alpine AS builder

WORKDIR /app

# Установка зависимостей и сборка
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

# Копируем только необходимые файлы
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["node", "dist/index.js"]
