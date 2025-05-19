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

# Запускаем http-server и слушаем на всех интерфейсах (0.0.0.0)
CMD ["npx", "http-server", ".", "-p", "8080", "-a", "0.0.0.0"]
