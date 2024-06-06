import { z } from 'zod'

export const UserModel = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
})

export type UserModelType = z.infer<typeof UserModel>
