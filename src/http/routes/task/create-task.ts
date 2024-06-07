import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '../../../lib/prisma'
import { TaskModel } from '../../../models/task'

const CreateTaskModel = TaskModel.omit({ id: true })

export async function createTask(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/tasks',
    {
      schema: {
        body: CreateTaskModel,
      },
    },
    async (request, reply) => {
      try {
        const { title, completed } = request.body
        const { userId } = request.cookies

        const task = await prisma.task.create({
          data: {
            title,
            completed,
            userId,
          },
        })

        reply.code(201).send(task)
      } catch (error) {
        console.error(error)
        reply.code(500).send({
          message: 'An error occurred.',
          error: error?.toString(),
        })
      }
    },
  )
}
