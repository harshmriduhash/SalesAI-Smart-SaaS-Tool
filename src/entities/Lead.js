const Lead = {
  name: "Lead",
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Full name of the lead"
    },
    email: {
      type: "string",
      format: "email",
      description: "Email address"
    },
    company: {
      type: "string",
      description: "Company name"
    },
    position: {
      type: "string",
      description: "Job title/position"
    },
    phone: {
      type: "string",
      description: "Phone number"
    },
    industry: {
      type: "string",
      enum: [
        "Technology",
        "Healthcare",
        "Finance",
        "Manufacturing",
        "Retail",
        "Education",
        "Real Estate",
        "Marketing",
        "Other"
      ],
      description: "Industry sector"
    },
    company_size: {
      type: "string",
      enum: [
        "1-10",
        "11-50",
        "51-200",
        "201-1000",
        "1000+"
      ],
      description: "Number of employees"
    },
    status: {
      type: "string",
      enum: [
        "new",
        "contacted",
        "qualified",
        "proposal",
        "negotiation",
        "closed_won",
        "closed_lost"
      ],
      default: "new",
      description: "Lead status in sales pipeline"
    },
    lead_score: {
      type: "number",
      minimum: 0,
      maximum: 100,
      description: "AI-calculated lead score"
    },
    estimated_value: {
      type: "number",
      description: "Estimated deal value in USD"
    },
    source: {
      type: "string",
      enum: [
        "website",
        "referral",
        "cold_outreach",
        "social_media",
        "event",
        "advertisement",
        "other"
      ],
      description: "Lead source"
    },
    notes: {
      type: "string",
      description: "Additional notes about the lead"
    },
    last_contact_date: {
      type: "string",
      format: "date",
      description: "Date of last contact"
    },
    next_follow_up: {
      type: "string",
      format: "date",
      description: "Scheduled next follow-up date"
    },
    pain_points: {
      type: "array",
      items: {
        type: "string"
      },
      description: "Identified pain points"
    },
    interests: {
      type: "array",
      items: {
        type: "string"
      },
      description: "Lead interests and preferences"
    },
    ai_insights: {
      type: "string",
      description: "AI-generated insights and recommendations"
    },
    conversation_prep: {
      type: "string",
      description: "AI-generated conversation preparation notes"
    }
  },
  required: [
    "name",
    "email"
  ]
};

export default Lead;