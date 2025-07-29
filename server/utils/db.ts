import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../../drizzle/schema'

type DB = ReturnType<typeof drizzle> & { schemas: typeof schema }

const db: DB = drizzle({ 
  connection: { 
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

db.schemas = schema

export default db