import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyAuthCookie(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (
    request.method === 'POST' &&
    (request.routeOptions.url === '/login' ||
      request.routeOptions.url === '/users')
  ) {
    return
  }
  const { userId } = request.cookies
  // console.log(userId)

  if (!userId) {
    reply.code(401).send({ code: 'cookie-not-found' })
  }
}
