# solid-trellix

A Trello-inspired kanban board app built with SolidStart. Create boards, add columns, and drag cards between them. Includes user auth and persistent storage via Prisma.

## Features

- **Boards** — create and manage multiple kanban boards
- **Columns** — add, rename, and reorder columns within a board
- **Cards** — create cards inside columns; drag to move between columns
- **Auth** — sign up and log in to keep your boards private
- **Persistent** — data stored in a PostgreSQL database via Prisma

## Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Frontend | SolidJS + SolidStart        |
| Styling  | Tailwind CSS                |
| Database | PostgreSQL via Prisma ORM   |
| Auth     | Session-based (cookie)      |

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL

## Setup

```bash
npm install

# Set your DATABASE_URL in .env
echo "DATABASE_URL=postgresql://user:pass@localhost:5432/solid-trellix" > .env

# Run migrations
npx prisma migrate dev

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Building

```bash
npm run build
npm start
```