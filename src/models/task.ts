import { z } from 'zod'

export const TaskModel = z.object({
  id: z.string().uuid(),
  title: z.string(),
  completed: z.boolean(),
})

export type TaskModelType = z.infer<typeof TaskModel>
