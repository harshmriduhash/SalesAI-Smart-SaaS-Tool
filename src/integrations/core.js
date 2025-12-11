// src/integrations/core.js - Real AI integration with kill switch
import { AIAPI } from '@/entities/all';

// ✅ MASTER AI KILL SWITCH - Set to false to disable ALL AI in the app (frontend)
const AI_ENABLED_FRONTEND = false; // Set to false for demo to bypass all AI API calls

export async function InvokeLLM({ prompt, response_json_schema, leadId, leadData, activities }) {
  if (!AI_ENABLED_FRONTEND) {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    
    // Return a structured response that matches expected AI insight format for components
    // This mock data is designed to prevent crashes if AI components are accidentally rendered
    return {
      ai_insights: "AI insights are disabled for the demo. This is mock data.",
      conversation_prep: "Focus on core value propositions. No AI prep for demo.",
      lead_score: Math.floor(Math.random() * 30) + 60, // Simulate a score
      summary: "AI insights disabled. Demo functionality is prioritized.",
      next_steps: ["Verify data manually"],
      risk_factors: ["No AI analysis available"],
      sentiment: "neutral",
      confidence: "low"
    };
  }

  // Original AI code (only runs if AI_ENABLED_FRONTEND is true)
  try {
    if (leadId) { // Check if leadId is provided for lead-specific analysis
      const response = await fetch('http://localhost:5001/api/ai/analyze-lead/' + leadId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ leadData, activities: activities || [] })
      });
      
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: `HTTP Error ${response.status}` }));
        throw new Error(errorBody.message || 'AI analysis failed');
      }
      const data = await response.json();
      return data.data; // Assuming response.data.data contains the insights
    }
    
    // Fallback response for other InvokeLLM uses if not lead specific
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    return {
      ai_insights: "Frontend AI analysis temporarily unavailable.",
      conversation_prep: "Frontend research company background.",
      lead_score: 50
    };
  } catch (error) {
    console.error('AI Integration Error:', error);
    
    return {
      ai_insights: "Frontend AI analysis temporarily unavailable due to error.",
      conversation_prep: "Research company background.",
      lead_score: 50
    };
  }
}

export async function ScoreLead(leadData) {
  if (!AI_ENABLED_FRONTEND) {
    return { 
      score: Math.floor(Math.random() * 30) + 60, // Simulate a score
      confidence: 'medium',
      factors: ['Manual review recommended']
    };
  }

  try {
    const response = await fetch('http://localhost:5001/api/ai/score-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(leadData)
    });
    
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: `HTTP Error ${response.status}` }));
      throw new Error(errorBody.message || 'Lead scoring failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lead scoring error:', error.message);
    return { score: 50, confidence: 'low', factors: ['Error during AI scoring'] };
  }
}

export async function GenerateEmail(leadData, recentActivities = []) {
  if (!AI_ENABLED_FRONTEND) {
    return {
      subject: `Following up on ${leadData.company} (Demo Mock)`,
      body: `Hi ${leadData.name},\n\nI hope this email finds you well. This is a demo email, AI is currently disabled.\n\nLooking forward to connecting.\n\nBest regards`,
      tone: "professional",
      follow_up_in_days: 3
    };
  }

  try {
    const response = await AIAPI.generateEmail(leadData, recentActivities);
    return response.data;
  } catch (error) {
    console.error('Email Generation Error:', error);
    return {
      subject: `Regarding ${leadData.company} (Error)`,
      body: `Hi ${leadData.name},\n\nI hope this email finds you well. I wanted to reach out regarding your work at ${leadData.company}.\n\nBest,`,
      tone: "professional",
      follow_up_in_days: 3
    };
  }
}