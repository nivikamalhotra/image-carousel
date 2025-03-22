import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, Paper, CircularProgress } from '@mui/material';
import ImageCarousel from './components/ImageCarousel';
import ImageUpload from './components/ImageUpload';
import { ImageType } from './types';
import axiosInstance from './api/axios';

interface AppState {
  images: ImageType[];
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  images: [],
  loading: true,
  error: null,
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(initialState);
  const { images, loading, error } = state;

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const fetchImages = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });
      const response = await axiosInstance.get('/api/images');
      updateState({ images: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching images:', error);
      updateState({
        error: 'Failed to load images. Please try again later.',
        loading: false
      });
    }
  }, [updateState]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleReorder = useCallback(async (reorderedImages: ImageType[]) => {
    try {
      const sequences = reorderedImages.map((image, index) => ({
        id: image._id,
        sequence: index
      }));
      await axiosInstance.put('/api/images/sequence', { sequences });
      updateState({ images: reorderedImages });
    } catch (error) {
      console.error('Error reordering images:', error);
      fetchImages();
    }
  }, [fetchImages, updateState]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress size={40} thickness={4} />
        </Box>
      );
    }

    if (error) {
      return (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            textAlign: 'center', 
            color: 'error.main',
            bgcolor: 'error.light'
          }}
        >
          {error}
        </Paper>
      );
    }

    if (images.length === 0) {
      return (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            color: 'text.secondary',
            bgcolor: 'grey.50'
          }}
        >
          No images uploaded yet. Start by uploading some images above!
        </Paper>
      );
    }

    return (
      <ImageCarousel 
        images={images} 
        onReorder={handleReorder} 
        onUpdate={fetchImages}
        onDelete={fetchImages}
      />
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        my: 4,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ 
            color: 'primary.main',
            fontWeight: 600,
            letterSpacing: '0.02em'
          }}
        >
          Image Carousel
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            bgcolor: 'background.paper',
            borderRadius: 2
          }}
        >
          <ImageUpload onUploadSuccess={fetchImages} />
        </Paper>

        {renderContent()}
      </Box>
    </Container>
  );
};

export default App;