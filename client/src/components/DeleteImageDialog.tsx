import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, FormControl, InputLabel, Select, MenuItem, Box, Typography 
} from '@mui/material';
import { ImageType } from '../types';

interface DeleteImageDialogProps {
  open: boolean;
  images: ImageType[];
  onClose: () => void;
  onDelete: (imageId: string) => void;
}

const DeleteImageDialog: React.FC<DeleteImageDialogProps> = ({ open, images, onClose, onDelete }) => {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(images.length > 0 ? images[0] : null);

  const handleImageChange = (event: any) => {
    const selectedId = event.target.value;
    const selectedImg = images.find((img) => img._id === selectedId) || null;
    setSelectedImage(selectedImg);
  };

  const handleDeleteConfirm = async () => {
    if (selectedImage) {
      try {
        onDelete(selectedImage._id);
        onClose();
      } catch (error) {
        console.error('Error in delete confirmation:', error);
      }
    }
  };

  useEffect(() => {
    if (open && images.length > 0) {
      setSelectedImage(images[0]);
    } else {
      setSelectedImage(null);
    }
  }, [open, images]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>Delete Image</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 3 }}>
        
        {/* Dropdown to Select Image */}
        <FormControl fullWidth sx={{ minWidth: 200 }}>
        <InputLabel id="delete-image-label">Select Image to Delete</InputLabel>
          <Select 
            labelId="delete-image-label"
            value={selectedImage?._id || ''} 
            onChange={handleImageChange}
            label="Select Image to Delete"
            sx={{ 
              fontSize: '1rem', 
              bgcolor: 'background.paper',
              '& .MuiSelect-select': {
                padding: '16.5px 14px'
              }
            }}
          >
            {images.map((img) => (
              <MenuItem key={img._id} value={img._id} sx={{ fontSize: '1rem' }}>
                {img.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Image Preview */}
        {selectedImage && (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              style={{
                maxWidth: '100%',
                height: 150,
                objectFit: 'contain',
                borderRadius: 8,
                boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
              }}
            />
            <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
              {selectedImage.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedImage.description}
            </Typography>
          </Box>
        )}

        {/* Confirmation Message */}
        <Typography variant="body1" sx={{ textAlign: 'center', color: 'error.main', fontWeight: 'bold' }}>
          Are you sure you want to delete this image?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ padding: 3 }}>
        <Button onClick={onClose} color="primary" variant="outlined" sx={{ fontSize: '1rem', padding: '8px 16px' }}>
          Cancel
        </Button>
        <Button onClick={handleDeleteConfirm} color="error" variant="contained" sx={{ fontSize: '1rem', padding: '8px 16px' }}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteImageDialog;
