import mongoose, { Schema, Document, models } from 'mongoose';

interface ISize {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IBox extends Document {
  id: string;
  size: {
    md: ISize;
    lg: ISize;
    sm: ISize;
    default: ISize;
  };
  updatedAt: Date;
  createdAt: Date;
}

const SizeSchema = new Schema<ISize>(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  { _id: false } // prevents Mongoose from creating _id inside each sub-size
);

const BoxSchema = new Schema<IBox>(
  {
    id: { type: String, required: true, unique: true },
    size: {
      md: { type: SizeSchema, required: true },
      lg: { type: SizeSchema, required: true },
      sm: { type: SizeSchema, required: true },
      default: { type: SizeSchema, required: true },
    },
  },
  { timestamps: true }
);

const BoxModel = models.Box || mongoose.model<IBox>('Box', BoxSchema);
export default BoxModel;
