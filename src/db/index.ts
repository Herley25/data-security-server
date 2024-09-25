import postgres from 'postgres'
import { env } from '../env'
import * as schema from './schema'
import { drizzle } from 'drizzle-orm/postgres-js'

// Cria uma conexão com o banco de dados
export const client = postgres(env.DATABASE_URL)
export const db = drizzle(client, { schema, logger: true })
