import fastify from 'fastify'
import fastifyHelmet from 'fastify-helmet'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import fastifyCors from '@fastify/cors'
import {
  createUserRoute,
  deleteUserRoute,
  getUserByIdRoute,
  updateUserRoute,
} from './routes/user-routes'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifyHelmet)

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Rota para criar um novo usuário
app.register(createUserRoute)
// Rota para obter um usuário pelo ID
app.register(getUserByIdRoute)
// Rota para atualizar um usuário
app.register(updateUserRoute)
// Rota para deletar um usuário
app.register(deleteUserRoute)

app.listen({ port: 3001 }).then(() => {
  console.log('HTTP server is running')
})
