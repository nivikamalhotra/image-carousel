import { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Paper, Slider, Typography, Stack, Button } from '@mui/material';
import { ChevronLeft, ChevronRight, Edit, Delete } from '@mui/icons-material';
import EditImageDialog from './EditImageDialog';
import axiosInstance from '../api/axios';
import { useSwipeable } from 'react-swipeable';
import { ImageType } from '../types';

interface ImageCarouselProps {
  images: ImageType[];
  onReorder?: (images: ImageType[]) => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, onUpdate, onDelete }) => {
  const [carouselState, setCarouselState] = useState({
    currentIndex: 0,
    autoPlayInterval: 5000,
    editDialogOpen: false,
    selectedImage: null as ImageType | null,
  });

  const { currentIndex, autoPlayInterval, editDialogOpen, selectedImage } = carouselState;

  const handleNavigation = useCallback((direction: 'next' | 'previous') => {
    setCarouselState(prev => ({
      ...prev,
      currentIndex: direction === 'next'
        ? (prev.currentIndex === images.length - 1 ? 0 : prev.currentIndex + 1)
        : (prev.currentIndex === 0 ? images.length - 1 : prev.currentIndex - 1)
    }));
  }, [images.length]);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNavigation('next'),
    onSwipedRight: () => handleNavigation('previous'),
    trackMouse: true,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleNavigation('next');
    }, autoPlayInterval);
    return () => clearInterval(intervalId);
  }, [autoPlayInterval, handleNavigation]);

  const handleEdit = useCallback((image: ImageType) => {
    setCarouselState(prev => ({
      ...prev,
      selectedImage: image,
      editDialogOpen: true
    }));
  }, []);

  const handleDelete = async (imageId: string) => {
    try {
      if (!window.confirm('Are you sure you want to delete this image?')) return;

      await axiosInstance.delete(`/api/images/${imageId}`);
      onDelete?.();

      setCarouselState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex === images.length - 1 ? 0 : prev.currentIndex
      }));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  const handleDialogClose = useCallback(() => {
    setCarouselState(prev => ({
      ...prev,
      editDialogOpen: false,
      selectedImage: null
    }));
  }, []);

  const handleIntervalChange = useCallback((_: Event, newValue: number | number[]) => {
    setCarouselState(prev => ({
      ...prev,
      autoPlayInterval: (newValue as number) * 1000
    }));
  }, []);

  if (!images.length) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography variant="body1">No images available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <Box sx={{ position: 'relative', width: '80%', height: '500px', margin: 'auto' }} {...handlers}>
        <Paper 
          elevation={3}
          sx={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            overflow: 'hidden'
          }}
        >
          <img 
            src={images[currentIndex].imageUrl} 
            alt={images[currentIndex].title} 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain',
              transition: 'transform 0.3s ease'
            }} 
          />
        </Paper>
        <IconButton 
          onClick={() => handleNavigation('previous')}
          sx={{ 
            position: 'absolute', 
            left: 10, 
            top: '50%', 
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255,255,255,0.8)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
          }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton 
          onClick={() => handleNavigation('next')}
          sx={{ 
            position: 'absolute', 
            right: 10, 
            top: '50%', 
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255,255,255,0.8)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      <Typography variant="h6" sx={{ mt: 2 }}>{images[currentIndex].title}</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>{images[currentIndex].description}</Typography>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<Edit />} 
          onClick={() => handleEdit(images[currentIndex])}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => handleDelete(images[currentIndex]._id)}
        >
          Delete
        </Button>
      </Stack>

      <Box sx={{ width: '50%', margin: '0 auto', mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Auto-play Interval (seconds)
        </Typography>
        <Slider
          value={autoPlayInterval / 1000}
          min={1}
          max={10}
          step={1}
          marks={[
            { value: 1, label: '1s' },
            { value: 3, label: '3s' },
            { value: 5, label: '5s' },
            { value: 7, label: '7s' },
            { value: 10, label: '10s' }
          ]}
          onChange={handleIntervalChange}
          valueLabelDisplay="auto"
        />
      </Box>

      <EditImageDialog 
        open={editDialogOpen} 
        image={selectedImage} 
        onClose={handleDialogClose} 
        onSave={onUpdate} 
      />
    </Box>
  );
};

export default ImageCarousel;