# Этап сборки
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходники и собираем проект
COPY . .
RUN npm run build

# Финальный этап: минимальный образ для запуска статического сервера
FROM node:18-alpine

WORKDIR /app

# Копируем готовую сборку из предыдущего этапа
COPY --from=builder /app/dist ./

# Открываем порт 8080
EXPOSE 8080

# Устанавливаем serve для правильного роутинга Vue.js
RUN npm install -g serve

# Запускаем serve с опциями для Vue.js
CMD ["serve", ".", "-s", "-l", "8080"]
