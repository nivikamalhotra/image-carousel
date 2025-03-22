import { Router } from 'express';
import { ImageController } from '../controllers/imageController';
import { upload, handleUploadError } from '../middleware/uploadMiddleware';

const router = Router();

// Routes
router.get('/', ImageController.getAllImages);
router.post('/', upload.single('image'), handleUploadError, ImageController.uploadImage);
router.put('/sequence', ImageController.updateSequences);
router.patch('/:id', ImageController.updateImage);
router.delete('/:id', ImageController.deleteImage);

export default router;