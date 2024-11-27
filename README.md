Here's the updated README file with distinct instructions for macOS and Windows users:

---

# My Scoreboard App

This project is a scoreboard application using a PostgreSQL database and a Next.js frontend. The PostgreSQL database can either run in Docker or locally on your machine. The development server is run locally using `pnpm`.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (Optional if running locally)
- [PostgreSQL](https://www.postgresql.org/download/) (If running locally)
- [pnpm](https://pnpm.io/installation)
- [Node.js](https://nodejs.org/en/) (LTS version preferred)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/my-scoreboard.git
cd my-scoreboard
```

---

## Running with Docker

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

Once the database is running, run the Prisma migrations to set up your database schema:

```bash
pnpm prisma migrate deploy
```

### 4. Optional: Seed the Database

If you'd like to seed your database with initial data, you can run:

```bash
pnpm run seed
```

### 5. Start the Development Server

```bash
pnpm run dev
```

The app should now be running on [http://localhost:5000](http://localhost:5000).

---

## Running with a Local Database

### 2. Start the PostgreSQL Database Locally

#### macOS

1. **Install PostgreSQL** (if not already installed):

   ```bash
   brew install postgresql
   ```

2. **Start the PostgreSQL service**:

   ```bash
   brew services start postgresql
   ```

3. **Create a Database**:
   ```bash
   createdb my_scoreboard
   ```

#### Windows

1. **Install PostgreSQL**:

   - Download and install PostgreSQL from [https://www.postgresql.org/download/](https://www.postgresql.org/download/).
   - During installation, set up the `postgres` user and password.

2. **Start the PostgreSQL service**:

   - Open the **pgAdmin** tool or use the Windows Services Manager to start PostgreSQL.
   - Alternatively, run:
     ```powershell
     net start postgresql-x64-14
     ```

3. **Create a Database**:
   Open the `psql` command-line tool or pgAdmin and execute:
   ```sql
   CREATE DATABASE my_scoreboard;
   ```

### 3. Update `.env`

Update the `DATABASE_URL` in your `.env` file to point to your local PostgreSQL database:

```bash
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/my_scoreboard?schema=public"
```

Replace `<user>` and `<password>` with your PostgreSQL username and password.

### 4. Run Migrations

Run the Prisma migrations to set up your local database schema:

```bash
pnpm prisma migrate deploy
```

### 5. Optional: Seed the Database

To seed your local database with initial data:

```bash
pnpm run seed
```

### 6. Start the Development Server

```bash
pnpm run dev
```

The app should now be running on [http://localhost:5000](http://localhost:5000).

---

## Notes

- Use **Docker** if you prefer a containerized setup or if setting up PostgreSQL locally is not ideal for your environment.
- For **local setup**, ensure you have PostgreSQL 14 installed and properly configured.
- macOS users can use `brew` for an easy installation, while Windows users should follow the standard PostgreSQL installer.

---
