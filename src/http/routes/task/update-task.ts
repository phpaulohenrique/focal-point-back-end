import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '../../../lib/prisma'
import { TaskModel } from '../../../models/task'
import { z } from 'zod'
import console from 'console'

export async function updateTask(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/task/:id',
    {
      schema: {
        body: TaskModel,
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { title, completed } = request.body
        const { id } = request.params

        const updatedTask = await prisma.task.update({
          where: {
            id,
          },
          data: {
            title,
            completed,
          },
        })

        reply.code(200).send(updatedTask)
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
