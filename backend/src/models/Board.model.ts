import { Schema, model, Document, Types } from "mongoose";

export interface BoardTransition {
  from: Types.ObjectId;
  to: Types.ObjectId;
}

export interface BoardDocument extends Document {
  title: string;
  description?: string;
  backgroundColor?: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  allowedTransitions: BoardTransition[];
  createdAt: Date;
  updatedAt: Date;
}

const transitionSchema = new Schema<BoardTransition>(
  {
    from: { type: Schema.Types.ObjectId, ref: "List", required: true },
    to: { type: Schema.Types.ObjectId, ref: "List", required: true },
  },
  { _id: false }
);

const boardSchema = new Schema<BoardDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    backgroundColor: { type: String, default: "" },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    allowedTransitions: { type: [transitionSchema], default: [] },
  },
  { timestamps: true }
);

boardSchema.index({ owner: 1 });
boardSchema.index({ members: 1 });

export const BoardModel = model<BoardDocument>("Board", boardSchema);
