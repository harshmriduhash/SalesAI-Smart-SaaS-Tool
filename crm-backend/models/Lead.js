// crm-backend/models/Lead.js
import mongoose from 'mongoose'; // Corrected to ESM import

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  company: String,
  position: String,
  phone: String,
  industry: {
    type: String,
    enum: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Real Estate', 'Marketing', 'Other', ''] // Added empty string for default/optional
  },
  company_size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-1000', '1000+', ''] // Added empty string
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'],
    default: 'new'
  },
  lead_score: { type: Number, min: 0, max: 100, default: 50 },
  estimated_value: { type: Number, default: 0 },
  source: {
    type: String,
    enum: ['website', 'referral', 'cold_outreach', 'social_media', 'event', 'advertisement', 'other', ''] // Added empty string
  },
  notes: String,
  last_contact_date: Date,
  next_follow_up: Date,
  pain_points: [String],
  interests: [String],
  ai_insights: String,
  conversation_prep: String,
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead; // Corrected to ESM export