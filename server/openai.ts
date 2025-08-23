import OpenAI from "openai";
import type { Message } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "demo_key" 
});

export interface FrenchResponse {
  french: string;
  translation: string;
  encouragement?: string;
}

export async function generateFrenchResponse(
  userInput: string,
  topic: string,
  conversationHistory: Message[]
): Promise<FrenchResponse> {
  try {
    // Build conversation context
    const context = conversationHistory
      .slice(-6) // Keep last 6 messages for context
      .map(msg => `${msg.role === 'user' ? 'Student' : 'Teacher'}: ${msg.content}`)
      .join('\n');

    const prompt = `You are Madame Sophie, a friendly French teacher helping a school child (ages 8-14) practice French conversation about "${topic}".

Context of previous conversation:
${context}

Student's latest message: "${userInput}"

Please respond as Madame Sophie with:
1. A natural French response that continues the conversation
2. Keep it simple and age-appropriate for children
3. Use encouraging tone
4. Ask a follow-up question to keep the conversation going
5. Correct any major errors gently if needed

Respond with JSON in this format:
{
  "french": "Your French response here",
  "translation": "English translation here",
  "encouragement": "Brief positive feedback if the student did well (optional)"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are Madame Sophie, a patient and encouraging French teacher for children. Always respond in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 300,
      temperature: 0.7
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      french: result.french || "Je ne comprends pas. Peux-tu répéter ?",
      translation: result.translation || "I don't understand. Can you repeat?",
      encouragement: result.encouragement
    };

  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Fallback responses for different topics
    const fallbacks: Record<string, FrenchResponse> = {
      "Se Présenter": {
        french: "C'est très bien ! Peux-tu me dire quel âge tu as ?",
        translation: "That's very good! Can you tell me how old you are?",
        encouragement: "Great job!"
      },
      "La Famille": {
        french: "Intéressant ! Raconte-moi plus sur ta famille.",
        translation: "Interesting! Tell me more about your family.",
      },
      "L'École": {
        french: "L'école, c'est important ! Quelle matière préfères-tu ?",
        translation: "School is important! What subject do you prefer?",
      },
      "Mes Loisirs": {
        french: "C'est génial ! J'aimerais en savoir plus sur tes loisirs.",
        translation: "That's awesome! I'd like to know more about your hobbies.",
      },
      "La Nourriture": {
        french: "Mmm, ça a l'air délicieux ! Qu'est-ce que tu aimes d'autre ?",
        translation: "Mmm, that sounds delicious! What else do you like?",
      }
    };

    return fallbacks[topic] || {
      french: "Très bien ! Continue à pratiquer ton français.",
      translation: "Very good! Keep practicing your French.",
      encouragement: "Keep going!"
    };
  }
}
