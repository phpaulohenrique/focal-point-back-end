import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyAuthCookie(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.log(request.method)
  if (
    request.method === 'POST' &&
    (request.routerPath === '/login' || request.routerPath === '/users')
  ) {
    return
  }
  const { userId } = request.cookies

  if (!userId) {
    reply.code(401).send({ message: 'Autenticação necessária.' })
    return
  }

  try {
    const verifiedUserId = await request.unsignCookie(userId)
    if (!verifiedUserId.valid) {
      reply
        .clearCookie('userId', {
          path: '/',
          signed: true,
          httpOnly: true,
          secure: true,
        })
        .code(401)
        .send({ message: 'Cookie inválido.' })
    }
    // request.userId = verifiedUserId.value
  } catch (err) {
    reply
      .clearCookie('userId', {
        path: '/',
        signed: true,
        httpOnly: true,
        secure: true,
      })
      .code(401)
      .send({ message: 'Erro na verificação do cookie.' })
  }
}
