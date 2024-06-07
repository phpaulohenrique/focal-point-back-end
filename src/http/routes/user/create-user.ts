import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '../../../lib/prisma'

import { UserModel } from '../../../models/user'

const CreateUserModel = UserModel.omit({ id: true })

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        body: CreateUserModel,
      },
    },
    async (request, reply) => {
      try {
        const { email, name, password } = request.body
        const passwordHash = await app.bcrypt.hash(password)
        const emailExists = await prisma.user.findUnique({
          where: {
            email,
          },
        })

        if (emailExists) {
          reply
            .code(400)
            .send({ message: 'Já existe uma conta com esse email.' })
        }

        await prisma.user.create({
          data: {
            email,
            name,
            password: passwordHash,
          },
        })

        reply.code(201).send()
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
