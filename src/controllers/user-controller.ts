import { db } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import z from 'zod'

const createUserSchema = z.object({
  username: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(6),
})

const getUserByIdSchema = z.object({
  id: z.string(),
})

const updateUserSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(255).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
})

const deleteUserSchema = z.object({
  id: z.string(),
})

interface CreateUserRequest {
  username: string
  email: string
  password: string
}

interface GetUserByIdRequest {
  id: string
}

interface UpdateUserRequest {
  id: string
  username?: string
  email?: string
  password?: string
}

interface DeleteUserResponse {
  id: string
}

// Função para criar um novo usuário
export const createUser = async ({
  email,
  password,
  username,
}: CreateUserRequest) => {
  try {
    const validatedData = createUserSchema.safeParse({
      username,
      email,
      password,
    }) // Valida os dados

    if (!validatedData.success) {
      throw new Error('Invalid data')
    } // Se os dados não forem válidos, lança um erro

    const hashedPassword = await bcrypt.hash(password, 10) // Hash da senha
    const [user] = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
      })
      .returning() // Opcional: retorna o registro recém-criado

    return user // Retorna o usuário inserido
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('Failed to create user')
  }
}

// Função para buscar um usuário pelo ID
export const getUserById = async ({ id }: GetUserByIdRequest) => {
  try {
    const validatedData = getUserByIdSchema.safeParse({ id }) // Valida os dados

    if (!validatedData.success) {
      throw new Error('Invalid data')
    } // Se os dados não forem válidos, lança um erro
    const user = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    return user // Retorna o usuário ou null se não encontrado
  } catch (error) {
    console.error('Error fetching user:', error)
    throw new Error('Failed to fetch user')
  }
}

// Função que atualiza um usuário pelo ID
export const updateUser = async ({
  id,
  username,
  email,
  password,
}: UpdateUserRequest) => {
  const validatedData = updateUserSchema.safeParse({
    id,
    username,
    email,
    password,
  }) // Valida os dados

  if (!validatedData.success) {
    throw new Error('Invalid data')
  } // Se os dados não forem válidos, lança um erro

  try {
    const [updateUser] = await db
      .update(users)
      .set({
        username,
        email,
        password,
      })
      .where(eq(users.id, id))
      .returning() // Opcional: retorna o registro atualizado

    return updateUser // Retorna o usuário atualizado
  } catch (error) {
    console.error('Error updating user:', error)
    throw new Error('Failed to update user')
  }
}

// Função para deletar um usuário pelo ID
export const deleteUser = async ({ id }: DeleteUserResponse) => {
  try {
    const validatedData = deleteUserSchema.safeParse({ id }) // Valida os dados

    if (!validatedData.success) {
      throw new Error('Invalid data')
    } // Se os dados não forem válidos, lança um erro

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning() // Opcional: retorna o registro deletado

    return deletedUser // Retorna o usuário deletado
  } catch (error) {
    console.error('Error deleting user:', error)
    throw new Error('Failed to delete user')
  }
}
