// crm-backend/routes/users.js
import express from 'express'; // Corrected to ESM import
import bcrypt from 'bcryptjs'; // Corrected to ESM import
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Corrected to ESM import

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  // Frontend sends 'name', not 'full_name'
  const { name, email, password } = req.body; 

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const newUser = new User({ name, email, password }); // Use 'name' to match model
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name }, // Use 'name'
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      success: true,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }, // Use 'name'
      token 
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, name: user.name }, // Use 'name'
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }, // Use 'name'
      token 
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Get current user (protected) - this won't be called directly by frontend AuthAPI usually
// For the frontend to get 'me' it would need this route to be protected by authMiddleware
// but AuthAPI.getCurrentUser() works by reading localStorage anyway.
// If you want a protected /users/me endpoint, you'd add authMiddleware before this handler.
router.get('/me', async (req, res) => { // Note: This route is NOT protected by authMiddleware by default in server.js
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
});

export default router; // Corrected to ESM export