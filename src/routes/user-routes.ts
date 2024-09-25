import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import {
  createUser,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/user-controller'

export const createUserRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/users',
    {
      schema: {
        body: z.object({
          username: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { username, email, password } = request.body

        const user = await createUser({ username, email, password }) // Ajusta os parâmetros aqui

        // Retorna uma resposta de sucesso com o usuário criado
        reply.status(201).send({ message: 'User created successfully', user })
      } catch (error) {
        // Em caso de erro, retorne a mensagem de erro apropriada
        reply.status(500).send({ error: 'Failed to create user' })
      }
    }
  )
}

export const getUserByIdRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/users/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params

        // Chame a função getUserById do controlador
        const user = await getUserById({ id })

        // Retorna o usuário encontrado
        reply.send({ user })
      } catch (error) {
        // Em caso de erro, retorne a mensagem de erro apropriada
        reply.status(500).send({ error: 'Failed to get user' })
      }
    }
  )
}

export const updateUserRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/users/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          username: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params
        const { username, email, password } = request.body

        // Chame a função updateUser do controlador
        const user = await updateUser({ id, username, email, password })

        // Retorna o usuário atualizado
        reply.send({ user })
      } catch (error) {
        // Em caso de erro, retorne a mensagem de erro apropriada
        reply.status(500).send({ error: 'Failed to update user' })
      }
    }
  )
}

export const deleteUserRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/users/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params

        // Chame a função deleteUser do controlador
        const user = await deleteUser({ id })

        // Retorna o usuário deletado
        reply.send({ user })
      } catch (error) {
        // Em caso de erro, retorne a mensagem de erro apropriada
        reply.status(500).send({ error: 'Failed to delete user' })
      }
    }
  )
}
