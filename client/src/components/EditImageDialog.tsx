import { useEffect, useState } from 'react';
import { 
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, 
  TextField, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import { ImageType } from '../types';
import axiosInstance from '../api/axios';

interface EditImageDialogProps {
  open: boolean;
  images: ImageType[]; // List of all images
  image: ImageType | null; // Selected image
  onClose: () => void;
  onSave: () => void;
}

const EditImageDialog: React.FC<EditImageDialogProps> = ({ open, images, image, onClose, onSave }) => {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(image);
  const [title, setTitle] = useState(image?.title || '');
  const [description, setDescription] = useState(image?.description || '');

  useEffect(() => {
    setSelectedImage(image);
    setTitle(image?.title || '');
    setDescription(image?.description || '');
  }, [image]);

  const handleImageChange = (event: any) => {
    const selectedId = event.target.value;
    const selectedImg = images.find((img) => img._id === selectedId) || null;

    setSelectedImage(selectedImg);
    setTitle(selectedImg?.title || '');
    setDescription(selectedImg?.description || '');
  };

  const handleSave = async () => {
    if (!selectedImage) return;

    try {
      await axiosInstance.patch(`/api/images/${selectedImage._id}`, {
        title,
        description,
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Failed to update image. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Edit Image
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 3 }}>
        
        {/* Dropdown to Select Image */}
        <FormControl fullWidth>
          <InputLabel sx={{ textAlign: 'left', padding: 1.5 }}>Select Image to Edit</InputLabel>
          <Select 
            value={selectedImage?._id || ''} 
            onChange={handleImageChange}
            displayEmpty
            sx={{ 
              textAlign: 'left',
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
                height: 180,
                objectFit: 'contain',
                borderRadius: 8,
                boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
              }}
            />
          </Box>
        )}

        {/* Title & Description Fields */}
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ fontSize: '1rem', bgcolor: 'background.paper' }}
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={2}
          sx={{ fontSize: '1rem', bgcolor: 'background.paper' }}
        />
      </DialogContent>
      <DialogActions sx={{ padding: 3 }}>
        <Button onClick={onClose} color="error" variant="outlined" sx={{ fontSize: '1rem', padding: '8px 16px' }}>
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained" sx={{ fontSize: '1rem', padding: '8px 16px' }}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditImageDialog;
