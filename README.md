# restaurant-selector

## Overview

This is an awesome restaurant selector.

## Technologies Used

- Node.js
- Express
- Docker
- Prisma
- Postgres
- Typescript

## Prerequisites

Please install [Node.js ( v18.16.0 )](https://nodejs.org/zh-tw/download) and [Docker](https://www.docker.com/) if you haven't.

## How to start

1. Install packages

```bash
yarn
```

2. Set your .env file.

- DB_USER is db username ( for docker compose )
- DB_PASSWORD is db password ( for docker compose )
- DATABASE_URL is used to connect to the database ( for prisma schema )
- PORT is server port ( for express `app.ts` server )

3. Generate prisma schema class and migrate database

```bash
yarn prisma generate && yarn prisma migrate dev
```

4. Run server and docker compose.

```bash
yarn start
```

## API

## Contribution

- [LI-YONG-QI](https://github.com/LI-YONG-QI)
- [andyhsu10](https://github.com/andyhsu10)
- [hcy1251](https://github.com/hcy1251)
