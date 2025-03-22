# Image Carousel Application

A full-stack application featuring an interactive image carousel with upload capabilities and automatic rotation.

## Features

- Drag-and-drop image upload
- Automatic image rotation with adjustable timing
- Image management (edit, delete)
- Responsive design
- Touch-enabled navigation
- Secure file storage

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Quick Start

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd image-carousel
npm install
cd client && npm install
```
2. **Configure Environment Variables**
```bash
# Create a .ePORT=5000PORT=5000
PORT=5000
MONGODB_URI=mongodb://localhost:27017/image-carousel
UPLOAD_DIR=./uploads
```
3. **Run the Application**
```bash
# Start the server
npm run dev
```
4. **Database Setup**
```bash
- Install MongoDB
- Start MongoDB service
- Database will be created automatically
```

## API Routes
- GET /api/images : Fetch all images
- POST /api/images : Upload new image
- PATCH /api/images/:id : Update image
- DELETE /api/images/:id : Delete image

## Usage Guide
1. Access application at http://localhost:3000
2. Upload images:
   - Drag and drop files
   - Click upload area to select files
   - Add title and description
3. Manage images:
   - Edit titles/descriptions
   - Delete images
   - Adjust rotation speed
4. Navigate:
   - Use arrow buttons
   - Swipe on touch devices
   - Auto-rotation

### Image Processing
- Supported formats: JPG, PNG, GIF
- Max file size: 5MB
- Storage: Local filesystem
- Unique filename generation

### Security Considerations
- File type validation
- Size limits
- Sanitized filenames
- CORS configuration

## Future Improvements
1. Features
   
   - User authentication
   - Image categories
   - Cloud storage integration
   - Image optimization
   - Drag-and-drop reordering
2. Technical
   
   - Unit tests
   - E2E testing
   - CI/CD pipeline
   - Docker containerization
   - Performance monitoring
   
## Troubleshooting
1. MongoDB Connection Issues
   
   - Ensure MongoDB is running
   - Check connection string in .env
   - Verify network connectivity
2. Image Upload Problems
   
   - Check file size (max 5MB)
   - Verify supported formats (JPG, PNG, GIF)
   - Ensure uploads directory exists
3. Frontend Connection Issues
   
   - Verify API URL in client/.env
   - Check proxy settings in vite.config.ts
   - Ensure both servers are running