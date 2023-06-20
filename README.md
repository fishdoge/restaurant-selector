# restaurant-selector

## Overview

## How to start

1. Setup

```bash
yarn
```

2. Set your .env file

- DB_USER is bd username
- DB_PASSWORD is bd password
- DATABASE_URL is used by prisma to connect to the database
- PORT is server port

3. Generate prisma schema class and migrate

```bash
yarn prisma generate && yarn prisma migrate dev
```

4. Run server and docker compose

```bash
yarn start
```

## API
