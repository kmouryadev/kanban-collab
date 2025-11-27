import { Schema, model, Document, Types } from "mongoose";

export type TaskPriority = "low" | "medium" | "high";

export interface ITask extends Document {
  title: string;
  description?: string;
  boardId: Types.ObjectId;
  listId: Types.ObjectId;
  order: number;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    listId: { type: Schema.Types.ObjectId, ref: "List", required: true },
    order: { type: Number, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

export const TaskModel = model<ITask>("Task", TaskSchema);
