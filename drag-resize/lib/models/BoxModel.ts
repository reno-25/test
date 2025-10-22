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
    xs: ISize;
    xl: ISize;
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
      xs: { type: SizeSchema, required: true, default: { x: 25, y: 25, width: 100, height: 50 } },
      sm: { type: SizeSchema, required: true, default: { x: 50, y: 50, width: 150, height: 100 } },
      md: { type: SizeSchema, required: true, default: { x: 75, y: 75, width: 200, height: 150 } },
      lg: { type: SizeSchema, required: true, default: { x: 100, y: 100, width: 250, height: 200 } },
      xl: { type: SizeSchema, required: true, default: { x: 125, y: 125, width: 300, height: 250 } },
      default: { type: SizeSchema, required: true, default: { x: 50, y: 50, width: 200, height: 150 } },
    },
  },
  { timestamps: true }
);

const BoxModel = models.Box || mongoose.model<IBox>('Box', BoxSchema);
export default BoxModel;
