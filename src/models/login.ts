import { z } from 'zod'

export const LoginModel = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type LoginModelType = z.infer<typeof LoginModel>
