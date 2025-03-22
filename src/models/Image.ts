import { Schema, model, Document } from 'mongoose';

export interface IImage extends Document {
  title: string;
  description: string;
  imageUrl: string;
  sequence: number;
  uploadDate: Date;
}

const imageSchema = new Schema<IImage>({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  sequence: { type: Number, default: 0 },
  uploadDate: { type: Date, default: Date.now }
});

export default model<IImage>('Image', imageSchema);