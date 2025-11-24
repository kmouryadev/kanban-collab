import { z } from "zod";

export const createBoardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  backgroundColor: z.string(),
});

export const updateBoardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  backgroundColor: z.string(),
});

export type CreateBoardForm = z.infer<typeof createBoardSchema>;
export type UpdateBoardForm = z.infer<typeof updateBoardSchema>;