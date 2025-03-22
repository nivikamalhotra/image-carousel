import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { ImageType } from '../types';
import axiosInstance from '../api/axios';

interface EditImageDialogProps {
  open: boolean;
  image: ImageType | null;
  onClose: () => void;
  onSave?: () => void;  // Made optional using ? syntax
}

const EditImageDialog: React.FC<EditImageDialogProps> = ({ open, image, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    if (image) {
      setFormData({
        title: image.title,
        description: image.description
      });
    }
  }, [image]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (!image?._id) return;

      await axiosInstance.patch(`/api/images/${image._id}`, formData);
      onSave?.();  // Optional chaining for cleaner code
      onClose();
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Failed to update image. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Image</DialogTitle>
      <DialogContent>
        <TextField
          name="title"
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          value={formData.title}
          onChange={handleInputChange}
        />
        <TextField
          name="description"
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button 
          onClick={handleSave} 
          color="primary"
          disabled={!formData.title.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditImageDialog;