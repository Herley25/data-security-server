import fastify from 'fastify'
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
import fastifyHelmet from '@fastify/helmet'
import { checkUrlRoute } from './routes/check-url-route'

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

// Rota para verificar a segurança de uma URL
app.register(checkUrlRoute)

// Configuração básica do helmet com Content Security Policy (CSP)
app.register(fastifyHelmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // Permite apenas o carregamento de recursos do mesmo domínio
      styleSrc: ["'self'", 'stackpath.bootstrapcdn.com'], // Permite estilos internos e do mesmo domínio
      scriptSrc: ["'self'", "'unsafe-inline'"], // Permite scripts internos e do mesmo domínio
      objectSrc: ["'none'"], // Bloqueia objetos de Flash e outros
      upgradeInsecureRequests: [], // Força o navegador a acessar o site via HTTPS
    },
  },
})

app.listen({ port: 3001 }).then(() => {
  console.log('HTTP server is running')
})
