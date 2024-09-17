# Next.js Boilerplate ![GitHub CI](https://github.com/michaelclemens/nextjs-boilerplate/actions/workflows/ci.yml/badge.svg)

## Overview

[Next.js 14 with App Router](https://nextjs.org/docs) boilerplate template including:

### Base Next.js 14

- ⚛️ [React 18](https://18.react.dev/)
- ✨ [TypeScript](https://www.typescriptlang.org/docs/)
- 💨 [Tailwind CSS 3](https://tailwindcss.com/docs)
- 📏 [ESLint](https://eslint.org/docs)

### Additional

- 🌈 [Prisma ORM](https://www.prisma.io/docs/orm)
- 🐘 [PostgreSQL 16](https://www.postgresql.org/docs/16/index.html) (docker-compose container)
- 🃏 [Jest](https://jestjs.io/docs) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
