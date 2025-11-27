import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
});

export type TaskFormValues = z.infer<typeof TaskSchema>;
