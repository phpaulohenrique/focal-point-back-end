import fastify from 'fastify'
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import cors from '@fastify/cors'
import { fastifyCookie } from '@fastify/cookie'
import { getTasks } from './http/routes/task/get-tasks'
import { createTask } from './http/routes/task/create-task'
import { updateTask } from './http/routes/task/update-task'
import { deleteTask } from './http/routes/task/delete-task'
import { fastifyBcrypt } from 'fastify-bcrypt'
import { createUser } from './http/routes/user/create-user'
import { login } from './http/routes/user/login'
import { verifyAuthCookie } from './middlewares/auth-cookie'

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyBcrypt, {
  saltWorkFactor: 12,
})

app.register(cors, {
  origin: '*',
})

app.addHook('preHandler', verifyAuthCookie)

app.register(fastifyCookie, {
  secret: 'secret',
  parseOptions: {},
})

app.listen({ port: 3333 }, (err) => {
  console.log(`Http server running on port ${3333} 🚀`)
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})

app.register(getTasks)
app.register(createTask)
app.register(updateTask)
app.register(deleteTask)
app.register(createUser)
app.register(login)
