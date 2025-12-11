// crm-backend/routes/ai.js
import express from "express"; // Corrected to ESM import
// import auth from '../middleware/auth.js'; // authMiddleware is applied in server.js for all /api/ai routes
import { generateCompletion } from "../utils/aiProvider.js"; // Corrected to ESM import
import Lead from "../models/Lead.js"; // Corrected to ESM import

const router = express.Router();

// ✅ IMPORTANT: Use process.env.AI_ENABLED to control mock data
const AI_ENABLED = process.env.AI_ENABLED === "true"; // Reads from .env file

router.post("/generate-email", async (req, res) => {
  // Removed 'auth' middleware here, it's applied in server.js
  if (!AI_ENABLED) {
    const { leadData } = req.body;
    return res.json({
      success: true,
      subject: `Following up on our conversation - ${leadData.company}`,
      body: `Hi ${leadData.name},\n\nI hope this email finds you well. I wanted to follow up on our previous conversation regarding ${leadData.company}'s needs.\n\nI believe we have some solutions that could be a great fit. Would you be available for a brief call this week to discuss further?\n\nLooking forward to connecting.\n\nBest regards`,
    });
  }

  try {
    const { leadData } = req.body;

    const prompt = `Write a professional follow-up email for:
Lead: ${leadData.name}
Company: ${leadData.company}
Status: ${leadData.status}

Respond in JSON:
{
  "subject": "email subject line",
  "body": "full email body with proper formatting"
}`;

    const email = await generateCompletion(prompt, true);
    res.json({ success: true, ...email });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/analyze-lead/:id", async (req, res) => {
  // Removed 'auth' middleware here
  if (!AI_ENABLED) {
    // Provide consistent mock data for AI insights and conversation prep
    return res.json({
      success: true,
      data: {
        ai_insights:
          "Based on historical data and market trends, this lead shows strong potential due to high engagement with past marketing campaigns and a clear need for our core product. Recommend focusing on a value proposition that highlights efficiency gains.",
        conversation_prep:
          "Key discussion points: 1. Acknowledge their industry's current challenges. 2. Present case study of similar company. 3. Propose a personalized solution. 4. Address potential budget concerns upfront. 5. Next steps: schedule a follow-up demo.",
      },
    });
  }

  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }

    const prompt = `Analyze the following lead data to provide AI insights and conversation preparation:
Lead Name: ${lead.name}
Company: ${lead.company}
Status: ${lead.status}
Industry: ${lead.industry}
Company Size: ${lead.company_size}
Estimated Value: $${lead.estimated_value}
Source: ${lead.source}
Notes: ${lead.notes || "N/A"}
Last Contact: ${
      lead.last_contact_date ? lead.last_contact_date.toISOString() : "N/A"
    }
Next Follow-up: ${
      lead.next_follow_up ? lead.next_follow_up.toISOString() : "N/A"
    }
Pain Points: ${
      lead.pain_points && lead.pain_points.length > 0
        ? lead.pain_points.join(", ")
        : "N/A"
    }
Interests: ${
      lead.interests && lead.interests.length > 0
        ? lead.interests.join(", ")
        : "N/A"
    }

Provide a JSON object with two fields:
1. "ai_insights": A concise paragraph summarizing key insights and potential opportunities.
2. "conversation_prep": Bullet points for effective conversation preparation.
`;

    const aiResponse = await generateCompletion(prompt, true);

    // Optionally update the lead with the generated insights
    lead.ai_insights = aiResponse.ai_insights;
    lead.conversation_prep = aiResponse.conversation_prep;
    await lead.save();

    res.json({ success: true, data: aiResponse });
  } catch (error) {
    console.error("AI analyze-lead error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/score-lead", async (req, res) => {
  // Removed 'auth' middleware here
  if (!AI_ENABLED) {
    return res.json({
      success: true,
      score: Math.floor(Math.random() * 30) + 60,
      confidence: "medium",
      factors: ["Mock AI: Industry Fit", "Mock AI: Engagement History"],
    });
  }

  try {
    const { leadData } = req.body;
    const prompt = `Score the following lead (0-100) and provide a confidence level (low, medium, high) and key factors for the score:
Lead Data: ${JSON.stringify(leadData)}
Return JSON: {"score": number, "confidence": "string", "factors": ["string"]}`;
    const aiResponse = await generateCompletion(prompt, true);
    res.json({ success: true, ...aiResponse });
  } catch (error) {
    console.error("AI score-lead error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router; // Corrected to ESM export
