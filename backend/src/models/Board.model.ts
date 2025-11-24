import { Schema, model, Document, Types } from "mongoose";

export interface BoardAttrs {
  title: string;
  description?: string;
  backgroundColor?: string;
  owner: Types.ObjectId;
}

export interface BoardDocument extends Document, BoardAttrs {
  createdAt: Date;
  updatedAt: Date;
}

const boardSchema = new Schema<BoardDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    backgroundColor: { type: String, default: "" },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export const BoardModel = model<BoardDocument>("Board", boardSchema);
