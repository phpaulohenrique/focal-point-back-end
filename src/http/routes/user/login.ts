import type { FastifyInstance, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '../../../lib/prisma'

import { LoginModel } from '../../../models/login'

const customResponse = (
  reply: FastifyReply,
  statusCode: number,
  message: string,
) => {
  reply.code(statusCode).send({ message, error: true })
}

export async function login(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/login',
    {
      schema: {
        body: LoginModel,
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body

        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        })

        if (!user) {
          customResponse(
            reply,
            401,
            'Não existe conta para o e-mail informado.',
          )
          return
        }

        const isPasswordCorrect = await app.bcrypt.compare(
          password,
          user!.password,
        )
        if (!isPasswordCorrect) {
          customResponse(reply, 401, 'E-mail ou senha inválida.')
          return
        }

        reply
          .setCookie('userId', user!.id, {
            path: '/',
            signed: false,
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hora
          })
          .send({ name: user.name })
      } catch (error) {
        console.error(error)
        customResponse(reply, 500, 'An error occurred.')
      }
    },
  )
}
