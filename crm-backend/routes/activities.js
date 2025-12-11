// crm-backend/routes/activities.js
import express from 'express'; // Corrected to ESM import
import Activity from '../models/Activity.js'; // Corrected to ESM import
import Lead from '../models/Lead.js'; // Also need Lead model for population

const router = express.Router();

// Get all activities for authenticated user, with optional leadId filter
router.get('/', async (req, res) => {
  try {
    const { leadId } = req.query; // Query parameter for filtering by lead
    const query = { created_by: req.user._id };

    if (leadId) {
      // Ensure leadId is valid ObjectId and belongs to the user
      const leadExists = await Lead.findOne({ _id: leadId, created_by: req.user._id });
      if (!leadExists) {
        return res.status(404).json({ success: false, message: 'Lead not found or does not belong to user.' });
      }
      query.lead_id = leadId;
    }
    
    const activities = await Activity.find(query)
      .populate('lead_id', 'name company') // Populate lead details
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create activity
router.post('/', async (req, res) => {
  try {
    const { lead_id, ...rest } = req.body;

    // Validate lead_id exists and belongs to the user
    const leadExists = await Lead.findOne({ _id: lead_id, created_by: req.user._id });
    if (!leadExists) {
      return res.status(404).json({ success: false, message: 'Lead not found or does not belong to user.' });
    }

    const activityData = {
      lead_id,
      ...rest,
      created_by: req.user._id
    };
    const newActivity = new Activity(activityData);
    await newActivity.save();
    
    // Populate lead details for response consistency
    const populatedActivity = await Activity.findById(newActivity._id).populate('lead_id', 'name company');

    res.status(201).json({ success: true, data: populatedActivity });
  } catch (error) {
    console.error("Error creating activity:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single activity
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findOne({ _id: req.params.id, created_by: req.user._id })
      .populate('lead_id', 'name company');
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.json({ success: true, data: activity });
  } catch (error) {
    console.error("Error getting activity:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update activity
router.put('/:id', async (req, res) => {
  try {
    const { lead_id, ...updateData } = req.body;

    // Optional: Validate if lead_id is being changed and belongs to user
    if (lead_id) {
      const leadExists = await Lead.findOne({ _id: lead_id, created_by: req.user._id });
      if (!leadExists) {
        return res.status(404).json({ success: false, message: 'New lead_id not found or does not belong to user.' });
      }
    }

    const activity = await Activity.findOneAndUpdate(
      { _id: req.params.id, created_by: req.user._id },
      { ...updateData, lead_id }, // Update lead_id if provided
      { new: true, runValidators: true }
    ).populate('lead_id', 'name company');

    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.json({ success: true, data: activity });
  } catch (error) {
    console.error("Error updating activity:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete activity
router.delete('/:id', async (req, res) => {
  try {
    const activity = await Activity.findOneAndDelete({ _id: req.params.id, created_by: req.user._id });
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.json({ success: true, message: 'Activity deleted' });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router; // Corrected to ESM export