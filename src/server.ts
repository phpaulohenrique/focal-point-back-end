import fastify from 'fastify'
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { getTasks } from './http/routes/task/get-tasks'
import { createTask } from './http/routes/task/create-task'
import cors from '@fastify/cors'
import { updateTask } from './http/routes/task/update-task'
import { deleteTask } from './http/routes/task/delete-task'

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
  origin: '*',
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
