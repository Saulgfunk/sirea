import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Prisma 7 moved the connection URL out of schema.prisma — Migrate/Studio
// read it from here. The runtime client (src/lib/prisma.ts) connects
// separately via the pg adapter, using the same DATABASE_URL.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
