# Инструкция по деплою на Timeweb

## Подготовка сервера

1. Установите Docker и Docker Compose на сервер:
   ```bash
   sudo apt update
   sudo apt install -y docker.io docker-compose
   sudo systemctl enable --now docker
   ```

2. Создайте директорию для проекта:
   ```bash
   sudo mkdir -p /opt/velo/{caddy,backend,frontend,database}
   sudo chown -R $USER:$USER /opt/velo
   ```

3. Настройте домен velo.nikitabond.ru на панели Timeweb, чтобы он указывал на IP вашего сервера.

## Настройка GitHub Secrets

Перейдите в настройки вашего репозитория на GitHub: `Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`

Добавьте следующие секреты:

- `SSH_PRIVATE_KEY` - приватный SSH-ключ для доступа к серверу
- `SSH_USER` - имя пользователя для SSH (обычно `root` или имя пользователя)
- `SSH_HOST` - IP-адрес или домен вашего сервера
- `DOCKERHUB_USERNAME` - ваш логин на Docker Hub
- `DOCKERHUB_TOKEN` - токен доступа к Docker Hub (можно создать в настройках профиля Docker Hub)
- `DB_PASSWORD` - пароль для базы данных
- `MYSQL_ROOT_PASSWORD` - root-пароль для MySQL
- `MYSQL_PASSWORD` - пароль пользователя MySQL
- `JWT_SECRET` - секретный ключ для JWT

## Настройка Caddy

Отредактируйте файл `caddy/Caddyfile` для вашего домена:

```
velo.nikitabond.ru {
    # Фронтенд Vue.js
    handle_path /* {
        reverse_proxy frontend:8080
    }

    # API бекенда
    handle_path /api/* {
        uri strip_prefix /api
        reverse_proxy backend:3000
    }

    # Админская панель
    handle_path /admin/* {
        reverse_proxy frontend:8080
    }
}
```

## Запуск деплоя

1. Закоммитьте изменения и запушьте их в ветку `main`:
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. GitHub Actions автоматически запустит процесс деплоя при пуше в ветку `main`.

3. Проверьте логи развертывания во вкладке `Actions` вашего репозитория.

## Ручное развертывание (если нужно)

Если автоматический деплой не сработал, выполните на сервере:

```bash
cd /opt/velo
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d --force-recreate
docker system prune -f
```

## Мониторинг

Проверьте логи контейнеров:

```bash
cd /opt/velo
docker-compose logs -f
```
