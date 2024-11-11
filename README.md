# My Scoreboard App

This project is a scoreboard application using a PostgreSQL database and a Next.js frontend. The PostgreSQL database is dockerized, while the development server is run locally using pnpm.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [pnpm](https://pnpm.io/installation)
- [Node.js](https://nodejs.org/en/) (LTS version preferred)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/my-scoreboard.git
cd my-scoreboard
```
### 2. Start the PostgreSQL Database Using Docker

To spin up the PostgreSQL database container, run:

```bash
docker-compose up -d
```

This will start the PostgreSQL database in a Docker container.

To stop the container:

```bash
docker-compose down
```

### 3. Run Migrations

Once the database is running, you need to run the Prisma migrations to set up your database schema.

bash

```bash
pnpm prisma migrate deploy
```

### 3. Optional: Seed the Database

If you'd like to seed your database with initial data, you can run the following command:

```bash
pnpm run seed
```

### 4. Start the Development Server

```bash
pnpm run dev
```

The app should now be running on http://localhost:5000.