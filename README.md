# Image Carousel Application

A full-stack application featuring an interactive image carousel with upload capabilities, automatic rotation, and comprehensive image management features.

## Features

- Drag-and-drop image upload with preview
- Automatic image rotation with customizable intervals
- Image management (edit titles/descriptions, delete)
- Responsive design for all devices
- Touch-enabled navigation with swipe gestures
- Secure file storage with validation
- Real-time preview updates

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Quick Start

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd image-carousel

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install
cd ..
```

2. **Configure Environment Variables**
Create a `.env` file in the root directory:
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/image-carousel

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880  # 5MB in bytes
```

3. **Database Setup**
```bash
# Start MongoDB service
# On macOS with Homebrew:
brew services start mongodb-community

# On Windows:
net start MongoDB

# On Linux:
sudo systemctl start mongod
```

4. **Run the Application**
```bash
# Start the backend server (from root directory)
npm run dev

# In a new terminal, start the frontend (from client directory)
cd client
npm run dev
```

## API Documentation

### Image Routes

#### GET /api/images
- Fetches all images
- Query Parameters:
  - `limit`: Number of images to return (default: 10)
  - `page`: Page number for pagination (default: 1)
  - `sort`: Sort order ('asc' or 'desc' by date)

#### POST /api/images
- Uploads a new image
- Content-Type: multipart/form-data
- Body:
  - `image`: File (required)
  - `title`: String (optional)
  - `description`: String (optional)

#### PATCH /api/images/:id
- Updates image details
- Body (JSON):
  - `title`: String (optional)
  - `description`: String (optional)

#### DELETE /api/images/:id
- Deletes an image and its file

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

## Additional info
   - For detailed frontend setup instructions, please refer to the README file in the client folder.