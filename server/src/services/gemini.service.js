import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiClient = null;

function getClient() {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return geminiClient;
}

/**
 * Generates an optional 2-sentence polished explanation using Gemini if GEMINI_API_KEY is available.
 * Always falls back smoothly to ruleBasedText without throwing errors.
 */
export async function polishExplanation(toolName, userAnswers, ruleBasedText) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return ruleBasedText;
  }

  try {
    const ai = getClient();
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an AI advisor. In exactly two concise sentences, explain why "${toolName}" is an ideal recommendation for a developer needing "${userAnswers.category || 'tech development'}" with a budget of "${userAnswers.budget}" and ${userAnswers.reasoningLevel} reasoning level. Avoid buzzwords.`;

    const result = await model.generateContent(prompt);
    const text = result?.response?.text();
    return text ? text.trim() : ruleBasedText;
  } catch (err) {
    // Graceful fallback on API limit, network issue, or invalid key
    return ruleBasedText;
  }
}
