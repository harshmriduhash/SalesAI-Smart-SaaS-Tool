// crm-backend/routes/leads.js
import express from 'express'; // Corrected to ESM import
import Lead from '../models/Lead.js'; // Corrected to ESM import
import Activity from '../models/Activity.js'; // Corrected to ESM import

const router = express.Router();

// Get all leads for authenticated user
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find({ created_by: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new lead
router.post('/', async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      created_by: req.user._id,
      lead_score: req.body.lead_score || 50
    };

    const newLead = new Lead(leadData);
    await newLead.save();

    // Create activity for lead addition
    const activity = new Activity({
      lead_id: newLead._id,
      type: 'note',
      subject: `New lead added: ${newLead.name}`,
      description: `Lead "${newLead.name}" from ${newLead.company || 'N/A'} was added to the system.`,
      completed: true,
      priority: 'medium',
      created_by: req.user._id
    });
    await activity.save();

    res.status(201).json({ success: true, data: newLead });
  } catch (error) {
    console.error('Lead creation error:', error);
    // More detailed error response for frontend
    if (error.code === 11000) { // Duplicate key error (e.g., email unique constraint)
      return res.status(409).json({ success: false, message: 'Lead with this email already exists.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single lead
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, created_by: req.user._id });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: lead });
  } catch (error) {
    console.error('Error getting lead:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update lead
router.put('/:id', async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, created_by: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Create activity for status change
    if (req.body.status && lead.status !== req.body.status) { // Only create if status actually changed
      const activity = new Activity({
        lead_id: lead._id,
        type: 'note',
        subject: `Lead status updated to ${req.body.status}`,
        description: `${lead.name}'s status was changed from ${lead.status} to ${req.body.status}.`,
        completed: true,
        priority: 'medium',
        created_by: req.user._id
      });
      await activity.save();
    }

    res.json({ success: true, data: lead });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, created_by: req.user._id });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    
    // Delete associated activities
    await Activity.deleteMany({ lead_id: req.params.id, created_by: req.user._id });
    
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router; // Corrected to ESM export