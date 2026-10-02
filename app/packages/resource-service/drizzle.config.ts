import { defineConfig } from 'drizzle-kit'

const connectionString =
  process.env.RESOURCE_DATABASE_URL ??
  'postgresql://empreinte:empreinte@127.0.0.1:54329/empreinte'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema.ts',
  out: './drizzle',
  dbCredentials: { url: connectionString },
  strict: true,
  verbose: true,
})
