import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { login } from '../controllers/auth-controller'

export const authRoutes: FastifyPluginAsyncZod = async app => {
  app.post(
    '/login',
    {
      schema: {
        body: z.object({
          username: z.string(),
          password: z.string().min(6),
        }),
      },
    },

    async (request, reply) => {
      const { username, password } = request.body

      try {
        // Chama a função de login do controlador
        const token = await login({ username, password }, app)

        // Retorna o token gerado
        if (!token) {
          return reply.status(401).send({ error: 'Invalid email or password' })
        }

        return reply.send({ token }) // Retorna o token gerado
      } catch (error) {
        if (error === 'Invalid email or password') {
          return reply.status(401).send({ error: 'Invalid email or password' })
        }
        return reply.status(500).send({ error: 'Failed to login user' })
      }
    }
  )
}
