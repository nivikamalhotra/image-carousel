import { useState, useCallback } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, IconButton } from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import axiosInstance from '../api/axios';

interface ImageUploadProps {
  onUploadSuccess: () => void;
}

interface UploadState {
  title: string;
  description: string;
  file: File | null;
  uploading: boolean;
  dragActive: boolean;
}

const initialState: UploadState = {
  title: '',
  description: '',
  file: null,
  uploading: false,
  dragActive: false,
};

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess }) => {
  const [uploadState, setUploadState] = useState<UploadState>(initialState);
  const { title, description, file, uploading, dragActive } = uploadState;

  const updateState = useCallback((updates: Partial<UploadState>) => {
    setUploadState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setUploadState(initialState);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateState({ 
      dragActive: e.type === 'dragenter' || e.type === 'dragover' 
    });
  }, [updateState]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateState({ 
      dragActive: false,
      file: e.dataTransfer.files?.[0] || null 
    });
  }, [updateState]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateState({ file: e.target.files?.[0] || null });
  }, [updateState]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateState({ [name]: value });
  }, [updateState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      updateState({ uploading: true });
      await axiosInstance.post('/api/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      resetForm();
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      updateState({ uploading: false });
    }
  };

  const renderDropZone = () => (
    <Box
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      sx={{
        border: '2px dashed',
        borderColor: dragActive ? 'primary.main' : 'grey.300',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        cursor: 'pointer',
        bgcolor: dragActive ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'action.hover',
        },
      }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="image-upload"
        name="image"
      />
      <label htmlFor="image-upload">
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drag and drop an image here
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or click to select a file
        </Typography>
        {file && (
          <Box sx={{ position: 'relative', mt: 1 }}>
            <Typography variant="body2" color="primary">
              Selected: {file.name}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault();
                updateState({ file: null });
              }}
              sx={{
                position: 'absolute',
                top: -10,
                right: -10,
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': {
                  bgcolor: 'error.light',
                  color: 'white'
                }
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        )}
      </label>
    </Box>
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mb: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {renderDropZone()}

      <TextField
        name="title"
        label="Title"
        value={title}
        onChange={handleInputChange}
        required
        fullWidth
      />
      <TextField
        name="description"
        label="Description"
        value={description}
        onChange={handleInputChange}
        multiline
        rows={3}
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        disabled={!file || uploading}
        sx={{ mt: 2 }}
      >
        {uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload Image'}
      </Button>
    </Box>
  );
};

export default ImageUpload;