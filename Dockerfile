# Build dependencies
FROM node:16-slim AS dependencies

WORKDIR /app
COPY package.json .
COPY tsconfig.json .
RUN npm install -D

# Build production image
FROM dependencies AS builder

WORKDIR /app
COPY routes ./routes
COPY *.ts .
COPY prisma ./prisma
RUN npx prisma generate
RUN npm run build

FROM node:16-slim AS runner

WORKDIR /app
COPY package.json ./
# COPY package-lock.json ./
COPY prisma ./prisma
RUN apt-get update -y
RUN apt-get install -y openssl
RUN npm install --only=production
COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD node /app/dist/app.js
