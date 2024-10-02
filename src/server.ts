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
import fastifyJwt from '@fastify/jwt'
import { authRoutes } from './routes/auth-routes'
import { env } from './env'

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

// Rota para autenticação de usuários
app.register(authRoutes)

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

// Registro do plugin JWT com a chave secreta
app.register(fastifyJwt, {
  secret: env.JWT_SECRET || 'super secret',
})

app.listen({ port: 3001 }).then(() => {
  console.log('HTTP server is running')
})
