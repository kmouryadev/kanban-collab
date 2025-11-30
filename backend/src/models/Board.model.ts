import { Schema, model, Document, Types } from "mongoose";

export interface BoardDocument extends Document {
  title: string;
  description?: string;
  backgroundColor?: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const boardSchema = new Schema<BoardDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    backgroundColor: { type: String, default: "" },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const BoardModel = model<BoardDocument>("Board", boardSchema);
