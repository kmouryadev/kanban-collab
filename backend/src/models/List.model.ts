import { Schema, model, Document, Types } from "mongoose";

export interface IList extends Document {
  title: string;
  boardId: Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ListSchema = new Schema<IList>(
  {
    title: { type: String, required: true, trim: true },
    boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export const ListModel = model<IList>("List", ListSchema);
