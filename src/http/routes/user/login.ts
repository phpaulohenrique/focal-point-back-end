import type { FastifyInstance, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '../../../lib/prisma'

import { LoginModel } from '../../../models/login'

const clearCookieAndRespond = (
  reply: FastifyReply,
  statusCode: number,
  message: string,
) => {
  reply
    .clearCookie('userId', {
      path: '/',
      signed: true,
      httpOnly: true,
      secure: true,
    })
    .code(statusCode)
    .send({ message })
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
          clearCookieAndRespond(
            reply,
            400,
            'Não existe conta para o e-mail informado.',
          )
          return
        }

        const isPasswordCorrect = await app.bcrypt.compare(
          password,
          user!.password,
        )
        if (!isPasswordCorrect) {
          clearCookieAndRespond(reply, 401, 'E-mail ou senha inválida.')
          return
        }

        reply
          .setCookie('userId', user!.id, {
            path: '/',
            signed: true,
            httpOnly: true,
            secure: true, // definir como true em prod
            // sameSite: 'Strict',
            expires: new Date(Date.now() + 1000 * 60), // 1 hour
          })
          .send({ message: 'Cookie set' })
      } catch (error) {
        console.error(error)
        clearCookieAndRespond(reply, 500, 'An error occurred.')
      }
    },
  )
}
