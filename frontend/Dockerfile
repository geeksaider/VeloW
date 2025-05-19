FROM node:18-alpine AS builder

WORKDIR /app

# Установка зависимостей и сборка
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build

# Финальный этап
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
