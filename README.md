# Colada

Colada is an Express API backed by MongoDB. The production deployment runs the API with Docker Compose, a three-node MongoDB replica set, and Nginx.

## Prerequisites

- Docker and Docker Compose for the containerized setup

## Environment variables

## Run in production

Start the API, MongoDB replica set, MongoDB initialization container, and Nginx:

```bash
docker compose up --build
```

The API is exposed through Nginx at `http://localhost`, with routes under `/api/v1`. The Compose configuration supplies the API with this MongoDB connection string:

```text
mongodb://mongo1:27017,mongo2:27017,mongo3:27017/colada?replicaSet=rs0
```

The Docker build creates both the API bundle (`dist/server.js`) and the production seed bundle (`dist/seed.js`).

## Seed the production database

Start the production services first, then run the bundled seed script as a one-off server container:

```bash
docker compose up -d --build
docker compose run --rm server node dist/seed.js
```

The command uses the production `DB_URL` configured in `docker-compose.yml`. The seed script deletes all existing users, events, and campaigns before inserting sample data, so run it only when replacing the production data is intended.

Stop the services with:

```bash
docker compose down
```

To stop the services and remove the MongoDB volumes as well:

```bash
docker compose down -v
```

## Available scripts

| Command                                            | Description                                |
| -------------------------------------------------- | ------------------------------------------ |
| `docker compose up -d --build`                     | Build and start the production services    |
| `docker compose run --rm server node dist/seed.js` | Clear and populate the production database |
| `docker compose down`                              | Stop the production services               |
| `docker compose down -v`                           | Stop services and remove MongoDB volumes   |
