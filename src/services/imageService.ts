import { Types } from 'mongoose';
import Image, { IImage } from '../models/Image';
import fs from 'fs';
import path from 'path';

export interface ImageSequence {
  id: string;
  sequence: number;
}

export class ImageService {
  static async getAllImages(): Promise<IImage[]> {
    return await Image.find().sort({ sequence: 1 });
  }

  static async createImage(imageData: {
    title: string;
    description?: string;
    imageUrl: string;
  }): Promise<IImage> {
    const lastImage = await Image.findOne().sort({ sequence: -1 });
    const sequence = lastImage ? lastImage.sequence + 1 : 0;

    const newImage = new Image({
      ...imageData,
      sequence
    });

    return await newImage.save();
  }

  static async updateSequences(sequences: ImageSequence[]): Promise<IImage[]> {
    const updateOperations = sequences.map(({ id, sequence }) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(id) },
        update: { $set: { sequence } }
      }
    }));

    await Image.bulkWrite(updateOperations);
    return await this.getAllImages();
  }

  static async deleteImage(id: string): Promise<IImage | null> {
    const image = await Image.findById(id);
    if (!image) return null;

    // Delete the image file from uploads folder
    const imagePath = path.join(process.cwd(), 'uploads', path.basename(image.imageUrl));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    return await Image.findByIdAndDelete(id);
  }

  static async updateImage(id: string, updateData: {
    title?: string;
    description?: string;
    sequence?: number;
  }): Promise<IImage | null> {
    const image = await Image.findById(id);
    if (!image) return null;

    if (updateData.sequence !== undefined && updateData.sequence !== image.sequence) {
      // If sequence is being updated, ensure no conflicts
      if (updateData.sequence > image.sequence) {
        await Image.updateMany(
          { sequence: { $gt: image.sequence, $lte: updateData.sequence } },
          { $inc: { sequence: -1 } }
        );
      } else {
        await Image.updateMany(
          { sequence: { $gte: updateData.sequence, $lt: image.sequence } },
          { $inc: { sequence: 1 } }
        );
      }
    }

    Object.assign(image, updateData);
    return await image.save();
  }
}