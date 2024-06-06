import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

export async function deleteTask(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/task/:id',
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

        await prisma.task.delete({
          where: {
            id,
          },
        })

        reply.code(200).send()
      } catch (error) {
        console.error('Error creating task:', error)
        reply.code(500).send({
          message: 'An error occurred.',
          error: error?.toString(),
        })
      }
    },
  )
}
