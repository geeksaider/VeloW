# Этап сборки
# Этап сборки клиента
FROM node:18-alpine AS client-builder

WORKDIR /build

# Копируем package.json и package-lock.json, ставим зависимости
COPY package.json package-lock.json ./
RUN npm install

# Копируем все исходники и билдим проект
COPY . .
RUN npm run build

# Этап запуска — caddy для раздачи статичных файлов
FROM caddy:2.8.4-alpine AS proxy-runtime

# Копируем Caddyfile с конфигом
COPY Caddyfile /etc/caddy/Caddyfile

# Копируем готовый билд в директорию для раздачи Caddy
COPY --from=client-builder /build/dist /usr/share/caddy/frontend

# Порт 80 уже открыт в caddy:2.8.4-alpine по умолчанию
# Caddy будет автоматически запущен через CMD по умолчанию
