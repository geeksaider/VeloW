# Stage 1: Build
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Prepare assets
FROM alpine:3.19
WORKDIR /app
RUN mkdir -p /app/dist
COPY --from=builder /app/dist ./dist