# Image Carousel Client

A modern React-based image carousel application built with TypeScript, featuring drag-and-drop upload capabilities, comprehensive image management, and an interactive slideshow experience.

## Features

- Interactive drag-and-drop image upload with instant preview
- Dynamic image carousel with customizable rotation intervals
- Comprehensive image management:
  - Add/edit image titles and descriptions
  - Delete unwanted images
- Modern, responsive design that works on all devices
- Touch-enabled navigation with swipe gestures
- Real-time updates and smooth transitions
- Keyboard navigation support
- Reorder the image sequence

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see main README)

## Getting Started

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment**
Create a `.env` file in the client directory:
```bash
VITE_APP_API_URL=http://localhost:5000/api
```

3. **Start Development Server**
```bash
npm run dev
```

4. The application will be available at http://localhost:5173

## Usage Guide

### Image Upload
- Drag and drop images directly into the upload area
- Click the upload area to select files manually
- Supported formats: JPG, PNG, GIF
- Maximum file size: 5MB

### Image Management
- Click on an image to view details
- Edit title and description using the edit button
- Delete images using the delete button
- Use arrow buttons or swipe to navigate

### Slideshow Controls
- Play/Pause: Toggle automatic rotation
- Interval: Adjust rotation speed (1-10 seconds)
- Navigation: Use arrow keys or swipe gestures

## Development

### Project Structure
```
src/
  ├── components/     # React components
  ├── api/           # API integration
  ├── types/         # TypeScript definitions
  └── utils/         # Helper functions
```

### Available Scripts
- `npm run dev`: Start development server

### Tech Stack
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Query for API integration