import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, Paper, CircularProgress, Button, Drawer } from '@mui/material';
import ImageCarousel from './components/ImageCarousel';
import ImageUpload from './components/ImageUpload';
import { ImageType } from './types';
import axiosInstance from './api/axios';

const App: React.FC = () => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/api/images');
      setImages(response.data);
    } catch (error) {
      setError('Failed to load images. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          position: 'relative'
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 600 }}>
            Image Carousel
          </Typography>
          <Button variant="contained" onClick={() => setUploadPanelOpen(true)}>
            Upload Image
          </Button>
        </Box>

        {/* Image Upload Drawer (Opens on Button Click) */}
        <Drawer
          anchor="right"
          open={uploadPanelOpen}
          onClose={() => setUploadPanelOpen(false)}
        >
          <Box sx={{ width: 350, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload New Image
            </Typography>
            <ImageUpload onUploadSuccess={() => {
              fetchImages();
              setUploadPanelOpen(false);
            }} />
          </Box>
        </Drawer>

        {/* Main Content: Image Carousel */}
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress size={40} thickness={4} />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 3, textAlign: 'center', color: 'error.main', bgcolor: 'error.light' }}>
            {error}
          </Paper>
        ) : images.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary', bgcolor: 'grey.50' }}>
            No images uploaded yet. Click "Upload Image" to add new images.
          </Paper>
        ) : (
          <ImageCarousel images={images} onUpdate={fetchImages} onDelete={fetchImages} />
        )}
      </Box>
    </Container>
  );
};

export default App;
