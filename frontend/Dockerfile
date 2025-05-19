FROM node:18-alpine AS builder

WORKDIR /app

# Установка зависимостей и сборка
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Финальный этап
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./

EXPOSE 8080
CMD ["npx", "http-server", "."]
