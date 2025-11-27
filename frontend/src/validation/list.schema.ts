import z from "zod";

export const createListSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const updateListSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export type CreateListForm = z.infer<typeof createListSchema>;
export type UpdateListForm = z.infer<typeof updateListSchema>;
