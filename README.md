# Recipe Book App (WIP) ![GitHub CI](https://github.com/michaelclemens/recipe-book-app/actions/workflows/ci.yml/badge.svg)

> [!WARNING] This is very much a Work In Progress

## Overview

### Stack

- ⚡️ [Next.js 14 with App Router](https://nextjs.org/docs)
- ⚛️ [React 18](https://18.react.dev/)
- ✨ [TypeScript](https://www.typescriptlang.org/docs/)
- 💨 [Tailwind CSS 3](https://tailwindcss.com/docs)
- ❔[TanStack React Query](https://tanstack.com/query/latest/docs)
- 🖼️ [Framer Motion](https://www.framer.com/motion/)
- 🌈 [Prisma ORM](https://www.prisma.io/docs/orm)
- 🐘 [PostgreSQL 17](https://www.postgresql.org/docs/17/index.html) (docker-compose container)
- 🤓 [Vitest](https://vitest.dev/guide/) + 🏛 [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- 📏 [ESLint](https://eslint.org/docs)
- 💖 [Prettier](https://prettier.io/docs/en/)
- 👷 [GitHub Actions](https://docs.github.com/en/actions) (CI + Dependabot config)

## Getting started 🚀

### 1. Install dependencies

Install npm dependencies:

```
npm ci
```

### 2. Create and seed the database

If you're using Docker on your computer, the following script will set up a PostgreSQL database using the `docker-compose.yml` file at the root of
your project:

```
npm run db:up
```

[Model your data in the Prisma schema](https://www.prisma.io/docs/getting-started/quickstart#2-model-your-data-in-the-prisma-schema) by editing the
[`prisma/schema.prisma`](./prisma/schema.prisma) fiile

Run the following command to create your PostgreSQL database:

```
npx prisma migrate dev --name init
```

When `npx prisma migrate dev` is executed against a newly created database, seeding is also triggered. To add seeding, create a
[`seed file`](https://www.prisma.io/docs/getting-started/quickstart#2-model-your-data-in-the-prisma-schema) in [`prisma/seed.ts`](./prisma/seed.ts)
and it will be executed against your database.

### 3. Configuring your environment

```
cp .env.example .env
```

Ensure these variables are correct.

### 4. Start the app

```
npm run dev
```

The app is now running, navigate to [`http://localhost:3000/`](http://localhost:3000/) in your browser to explore its UI.
