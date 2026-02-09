# User Management System - Nuxt.js

User management system dengan Nuxt.js, NuxtUI, PostgreSQL, Prisma, Better Auth, Docker deploy.

## Flowchart (Simple)

<p>
  <img src="https://github.com/Dhorq/user-management-system/blob/main/User-Management-App-Simple-Flowchart.png" alt="Flowchart" width="75%"/>
</p>

## Local Development

### Setup
```bash
# Install dependencies
npm install

# Setup .env file
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/user_management_next_db"
BETTER_AUTH_SECRET=secretkey(generatedaribetterauthdocsaja)
BETTER_AUTH_URL=http://localhost:3000

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

---

## Docker Setup

### Run dengan Docker
```bash
# Setup .env file
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/user_management_next_db"
BETTER_AUTH_SECRET=secretkey(generatedaribetterauthdocsaja)
BETTER_AUTH_URL=http://localhost:3000

# Build & run
docker-compose up --build / --d

# Check logs
docker-compose logs -f

# Stop
docker-compose down / -v
```

### Docker Commands
```bash
# Stop dan delete data
docker-compose down -v
```

---

## Tech Stack

- **Framework**: Nuxt.js 4.3
- **UI Library**: NuxtUI 4.4
- **Database**: PostgreSQL 8
- **ORM**: Prisma 7.3
- **Authentication**: Better Auth 1.4
- **Styling**: Tailwind CSS 4.1
- **Validation**: Zod 4.3 (Not yet used mostly)
- **Runtime**: Node.js 20
- **Container**: Docker

---
