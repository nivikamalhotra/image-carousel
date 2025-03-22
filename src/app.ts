import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import config from './config/config';
import imageRoutes from './routes/images';
import { errorHandler, notFound } from './middleware/errorMiddleware';

const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '..', config.uploadDir)));

// Routes
app.use('/api/images', imageRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

export default app;