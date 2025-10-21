import mongoose, { Schema, Document, models } from 'mongoose';

export interface IBox extends Document {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  updatedAt: Date;
}

const BoxSchema = new Schema<IBox>(
  {
    id: { type: String, required: true, unique: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  { timestamps: true }
);

const BoxModel = models.Box || mongoose.model<IBox>('Box', BoxSchema);
export default BoxModel;
