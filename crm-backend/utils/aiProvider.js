// crm-backend/utils/aiProvider.js
import { GoogleGenerativeAI } from '@google/generative-ai'; // Corrected import
import OpenAI from 'openai'; // Corrected import

// Initialize the AI provider
const initAI = () => {
  if (process.env.GEMINI_API_KEY) {
    console.log('🤖 Using Google Gemini AI');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // API Key direct in constructor
    return {
      provider: 'gemini',
      client: genAI
    };
  } else if (process.env.OPENAI_API_KEY) {
    console.log('🤖 Using OpenAI');
    return {
      provider: 'openai',
      client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    };
  } else {
    console.warn('⚠️ No AI provider configured');
    return { provider: 'none' };
  }
};

// Universal AI completion function
const generateCompletion = async (prompt, jsonMode = false) => {
  const ai = initAI();

  if (ai.provider === 'none') {
    throw new Error('No AI provider configured. Please set GEMINI_API_KEY or OPENAI_API_KEY in .env');
  }

  try {
    if (ai.provider === 'gemini') {
      const model = ai.client.getGenerativeModel({ model: "gemini-pro" });
      
      const generationConfig = jsonMode ? { responseMimeType: "application/json" } : {};

      const result = await model.generateContent(
        { contents: [{ role: "user", parts: [{ text: prompt }] }] },
        generationConfig
      );
      const response = await result.response;
      const text = response.text();

      if (jsonMode) {
        // Gemini returns JSON as a string, attempt to parse
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleanText);
      }
      
      return text;

    } else if (ai.provider === 'openai') {
      const completion = await ai.client.chat.completions.create({
        model: 'gpt-4-turbo-preview', // Or gpt-3.5-turbo
        messages: [{ role: 'user', content: prompt }],
        response_format: jsonMode ? { type: 'json_object' } : undefined,
      });

      const content = completion.choices[0].message.content;
      return jsonMode ? JSON.parse(content) : content;
    }
  } catch (error) {
    console.error(`❌ ${ai.provider} error:`, error.message);
    throw error;
  }
};

export { generateCompletion, initAI }; // Corrected to ESM export