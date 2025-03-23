import { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Paper, Slider, Typography, Stack, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ChevronLeft, ChevronRight, Edit, Delete, Reorder } from '@mui/icons-material';
import EditImageDialog from './EditImageDialog';
import DeleteImageDialog from './DeleteImageDialog';
import axiosInstance from '../api/axios';
import { ImageType } from '../types';

interface ImageCarouselProps {
  images: ImageType[];
  onUpdate?: () => void;
  onDelete?: () => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, onUpdate, onDelete }) => {
  const [carouselState, setCarouselState] = useState({
    currentIndex: 0,
    autoPlayInterval: 5000,
    editDialogOpen: false,
    deleteDialogOpen: false,
    reorderDialogOpen: false, 
    selectedImage: null as ImageType | null,
    selectedDeleteImage: images.length > 0 ? images[0] : null, // Default first image for delete
    reorderedImages: [...images],
  });

  const { currentIndex, autoPlayInterval, editDialogOpen, deleteDialogOpen, selectedImage, reorderedImages, reorderDialogOpen } = carouselState;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCarouselState((prev) => ({
        ...prev,
        currentIndex: (prev.currentIndex + 1) % images.length,
      }));
    }, autoPlayInterval);

    return () => clearInterval(intervalId);
  }, [autoPlayInterval, images.length]);

  const handleNavigation = useCallback((direction: 'next' | 'previous') => {
    setCarouselState((prev) => ({
      ...prev,
      currentIndex:
        direction === 'next'
          ? (prev.currentIndex === images.length - 1 ? 0 : prev.currentIndex + 1)
          : (prev.currentIndex === 0 ? images.length - 1 : prev.currentIndex - 1),
    }));
  }, [images.length]);

  const handleIntervalChange = useCallback((_: Event, newValue: number | number[]) => {
    setCarouselState((prev) => ({
      ...prev,
      autoPlayInterval: (newValue as number) * 1000,
    }));
  }, []);

  const handleEdit = useCallback((image: ImageType) => {
    setCarouselState((prev) => ({
      ...prev,
      selectedImage: image,
      editDialogOpen: true,
    }));
  }, []);

  const handleDeleteDialogOpen = () => {
    setCarouselState((prev) => ({
      ...prev,
      deleteDialogOpen: true,
    }));
  };

  const handleDeleteDialogClose = () => {
    setCarouselState((prev) => ({
      ...prev,
      deleteDialogOpen: false,
    }));
  };

  const handleDeleteImage = async (imageId: string) => {
  try {
    await axiosInstance.delete(`/api/images/${imageId}`);
    onDelete?.();
    setCarouselState(prev => ({ ...prev, deleteDialogOpen: false }));
  } catch (error) {
    console.error('Error deleting image:', error);
    alert('Failed to delete image. Please try again.');
  }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('draggedIndex', index.toString());
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData('draggedIndex'));
    const items = [...reorderedImages];
    const [draggedItem] = items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, draggedItem);

    setCarouselState(prev => ({
      ...prev,
      reorderedImages: items
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Modify the renderReorderDialog function
  const renderReorderDialog = () => (
    <Dialog
      open={reorderDialogOpen}
      onClose={() => setCarouselState(prev => ({ ...prev, reorderDialogOpen: false }))}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Reorder Images</DialogTitle>
      <DialogContent>
        <Box sx={{ minHeight: 400, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {reorderedImages.map((image, index) => (
            <Paper
              key={image._id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'grab',
                '&:active': { cursor: 'grabbing' },
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <img
                src={image.imageUrl}
                alt={image.title}
                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
              />
              <Typography>{image.title}</Typography>
            </Paper>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: 2, gap: 1 }}>
        <Button 
          onClick={() => setCarouselState(prev => ({ ...prev, reorderDialogOpen: false, reorderedImages: [...images] }))}
          variant="outlined"
          color="error"
        >
          Cancel
        </Button>
        <Button 
          onClick={async () => {
            try {
              const sequences = reorderedImages.map((image, index) => ({
                id: image._id,
                sequence: index
              }));
              await axiosInstance.put('/api/images/sequence', { sequences });
              onUpdate?.();
              setCarouselState(prev => ({ ...prev, reorderDialogOpen: false }));
            } catch (error) {
              console.error('Error reordering images:', error);
              alert('Failed to save new order. Please try again.');
            }
          }}
          disabled={JSON.stringify(images) === JSON.stringify(reorderedImages)}
          variant="contained"
          color="primary"
        >
          Confirm Order
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ width: '100%', textAlign: 'center', mt: 3 }}>
      <Grid container spacing={3} justifyContent="center">
        {/* Left Side: Image Carousel */}
        <Grid item xs={12} md={8}>
          <Box sx={{ position: 'relative', width: '100%', height: '500px', borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
            <Paper sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={images[currentIndex].imageUrl}
                alt={images[currentIndex].title}
                style={{
                  width: '100%',
                  height: '500px',
                  objectFit: 'contain',
                  borderRadius: 3,
                  transition: 'opacity 0.5s ease, transform 0.3s ease',
                }}
              />
            </Paper>

            {/* Navigation Buttons */}
            <IconButton
              onClick={() => handleNavigation('previous')}
              sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.8)' }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={() => handleNavigation('next')}
              sx={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.8)' }}
            >
              <ChevronRight />
            </IconButton>
          </Box>

          {/* Image Title & Description */}
          <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold', color: 'primary.main' }}>
            {images[currentIndex].title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {images[currentIndex].description}
          </Typography>
        </Grid>

        {/* Right Side: Auto-Play Interval Panel + Buttons */}
        <Grid item xs={12} md={4}>
          <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Auto-Play Interval (seconds)
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

            {/* Edit & Delete Buttons (Now Below Interval Panel) */}
            <Stack direction="column" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
              <Button variant="contained" startIcon={<Edit />} onClick={() => handleEdit(images[currentIndex])}>
                Edit
              </Button>
              <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleDeleteDialogOpen}>
                Delete
              </Button>
              <Button 
                variant="contained" 
                startIcon={<Reorder />} 
                onClick={() => setCarouselState((prev) => ({ ...prev, reorderDialogOpen: true }))}
              >
                Reorder Images
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <EditImageDialog open={editDialogOpen} images={images} image={selectedImage} onClose={() => setCarouselState(prev => ({ ...prev, editDialogOpen: false }))} onSave={onUpdate} />

      {/* Delete Dialog */}
      <DeleteImageDialog 
        open={deleteDialogOpen} 
        images={images} 
        onClose={handleDeleteDialogClose} 
        onDelete={handleDeleteImage} 
      />

      {/* Reorder Dialog */}
      {renderReorderDialog()}
    </Box>
  );
};

export default ImageCarousel;
