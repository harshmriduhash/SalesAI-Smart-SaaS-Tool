// src/lib/sampleData.js
export const sampleLeads = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    company: "TechCorp Solutions",
    position: "VP of Engineering",
    phone: "+1-555-0123",
    industry: "Technology",
    company_size: "201-1000",
    status: "qualified",
    lead_score: 85,
    estimated_value: 50000,
    source: "website",
    notes: "Interested in enterprise solution for team scaling",
    created_date: "2024-01-15T10:30:00Z",
    ai_insights: "High-potential lead with budget authority. Focus on ROI and team productivity benefits.",
    conversation_prep: "Discuss integration with their existing CI/CD pipeline and developer experience improvements."
  },
  {
    id: "2", 
    name: "Mike Chen",
    email: "mike.chen@healthplus.com",
    company: "HealthPlus Medical",
    position: "CTO",
    phone: "+1-555-0124",
    industry: "Healthcare",
    company_size: "51-200",
    status: "contacted",
    lead_score: 72,
    estimated_value: 35000,
    source: "referral",
    notes: "Looking to modernize patient data systems",
    created_date: "2024-01-10T14:20:00Z"
  }
];

export const sampleActivities = [
  {
    id: "1",
    lead_id: "1",
    type: "call",
    subject: "Initial discovery call",
    description: "Discussed current challenges and requirements",
    outcome: "positive",
    duration: 45,
    scheduled_date: "2024-01-20T09:00:00Z",
    completed: true,
    priority: "high",
    created_date: "2024-01-15T16:00:00Z"
  }
];