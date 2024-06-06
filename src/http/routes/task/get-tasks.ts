import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '../../../lib/prisma'

export async function getTasks(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/tasks',
    {
      schema: {},
    },
    async (request, reply) => {
      try {
        const tasks = await prisma.task.findMany({})
        reply.code(200).send(tasks)
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
