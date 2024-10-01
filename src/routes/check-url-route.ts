import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { checkURLSafety } from '../utils/checkURLSafety'

// Rota para verificar a segurança de uma URL
export const checkUrlRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/check-url',
    {
      schema: {
        body: z.object({
          url: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { url } = request.body

      if (!url) {
        return reply.status(400).send({ error: 'URL is required' })
      }

      try {
        const isSafe = await checkURLSafety(url) // Ajusta os parâmetros aqui
        return reply.send({ isSafe })
      } catch (error) {
        // Em caso de erro, retorne a mensagem de erro apropriada
        reply.status(500).send({ error: 'Failed to check URL safety' })
      }
    }
  )
}
