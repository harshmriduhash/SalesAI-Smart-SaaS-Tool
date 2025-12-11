import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Import routes
import userRoutes from './routes/users.js'; // Corrected import
import leadRoutes from './routes/leads.js';
import activityRoutes from './routes/activities.js';
import aiRoutes from './routes/ai.js'; // Corrected import
import authMiddleware from './middleware/auth.js'; // Corrected import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- CORS Configuration ---
app.use(cors({
  origin: 'http://localhost:5174', // Explicitly allow your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); // For parsing application/json

// --- Authentication Middleware (Moved to middleware/auth.js) ---
// Note: It's better to import it from its file as done above

// Public routes (no authentication needed)
app.use('/api/users', userRoutes); // For login/register

// Protected routes (authentication required)
app.use('/api/leads', authMiddleware, leadRoutes);
app.use('/api/activities', authMiddleware, activityRoutes);
app.use('/api/ai', authMiddleware, aiRoutes); // Protected AI routes

// Basic root route
app.get('/', (req, res) => {
  res.send('CRM Backend is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'Connected' : 'Not Set'}`);
  console.log(`AI Routes ${process.env.AI_ENABLED === 'true' ? 'ENABLED' : 'DISABLED'}`);
});