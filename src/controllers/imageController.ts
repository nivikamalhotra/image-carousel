import { Request, Response } from 'express';
import { ImageService, ImageSequence } from '../services/imageService';

export class ImageController {
  static async getAllImages(req: Request, res: Response) {
    try {
      const images = await ImageService.getAllImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: `Error fetching images - ${JSON.stringify(error)}` });
    }
  }

  static async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const { title, description } = req.body;
      const imageUrl = `/uploads/${req.file.filename}`;

      const newImage = await ImageService.createImage({
        title,
        description,
        imageUrl
      });
      res.status(201).json(newImage);
    } catch (error) {
      res.status(500).json({ error: `Error uploading image - ${JSON.stringify(error)}`});
    }
  }

  static async updateSequences(req: Request, res: Response) {
    try {
      const { sequences } = req.body as { sequences: ImageSequence[] };
      const updatedImages = await ImageService.updateSequences(sequences);
      res.json(updatedImages);
    } catch (error) {
      res.status(500).json({ error: `Error updating image sequence - ${JSON.stringify(error)}` });
    }
  }

  static async updateImage(req: Request, res: Response) {
    try {
      const { title, description, sequence } = req.body;
      const image = await ImageService.updateImage(req.params.id, {
        title,
        description,
        sequence
      });
      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }
      res.json(image);
    } catch (error) {
      res.status(500).json({ error: `Error updating image - ${JSON.stringify(error)}` });
    }
  }

  static async deleteImage(req: Request, res: Response) {
    try {
      const image = await ImageService.deleteImage(req.params.id);
      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }
      res.json({ message: 'Image deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: `Error deleting image - ${JSON.stringify(error)}`});
    }
  }
}