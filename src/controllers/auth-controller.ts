import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'
import bcrypt from 'bcryptjs'
import z from 'zod'
import type { FastifyInstance } from 'fastify'

const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(6),
})

interface LoginRequest {
  username: string
  password: string
}

export const login = async (
  { username, password }: LoginRequest,
  fastify: FastifyInstance
) => {
  try {
    // Valida os dados de entrada
    const validatedData = loginSchema.safeParse({ username, password })
    if (!validatedData.success) {
      throw new Error('Invalid user or password format') // Retorna um erro se os dados forem inválidos
    }

    // Busca o usuário no banco de dados
    const [user] = await db
      .select({ username: users.username, password: users.password })
      .from(users)
      .where(eq(users.username, username))
      .limit(1)

    if (!user) {
      throw new Error('Invalid username or password') // Retorna um erro se o usuário não for encontrado
    }

    // Verifica se a senha está correta
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error('Invalid password')
    }

    console.log('Provided password:', password)
    console.log('Stored password hash:', user.password)

    // Gera um token JWT
    const token = fastify.jwt.sign(
      { username: user.username }, // payload
      { expiresIn: '1h' } // configurações de expiração
    )

    return { token }
  } catch (error) {
    console.error('Error logging in user', error)
    throw new Error('Failed to login user')
  }
}
