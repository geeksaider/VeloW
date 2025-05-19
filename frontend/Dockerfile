# Stage 1: Build Vue.js app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Caddy
FROM caddy:2.7-alpine
COPY --from=builder /app/dist /app/dist
