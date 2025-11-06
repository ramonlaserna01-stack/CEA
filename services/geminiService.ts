
import { GoogleGenAI } from "@google/genai";

// This is a placeholder for a real API key, which should be stored in environment variables.
// The persona instructions specify to use process.env.API_KEY.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY for Gemini is not set. Using mock responses.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const callGeminiApi = async (prompt: string): Promise<string> => {
    if (!ai) {
        // Mock response for development when API key is not available
        return new Promise(resolve => {
            setTimeout(() => {
                if (prompt.toLowerCase().includes("summarize")) {
                    resolve("This ordinance updates zoning for commercial districts, focusing on operating hours for businesses near residential areas to balance economic activity and community welfare.");
                } else if (prompt.toLowerCase().includes("clarity") || prompt.toLowerCase().includes("wording")) {
                    resolve("Suggestion for Section 3.2: 'To mitigate noise disturbances, businesses in commercial districts that are adjacent to any residential zone must cease public operations between 10:00 PM and 7:00 AM daily. The Planning Commission may grant a special permit to extend these hours upon a public hearing.' This provides more concrete language than 'reasonable hours'.");
                } else {
                    resolve("The AI assistant is configured in mock mode. This is a sample response. For real interaction, please provide a valid API key.");
                }
            }, 1500);
        });
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are an expert legislative assistant. Your role is to analyze legal documents, provide clear summaries, identify potential issues, and suggest improvements in a professional, neutral tone.",
                temperature: 0.7,
                topP: 1.0,
            }
        });
        
        return response.text;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to communicate with the Gemini API.");
    }
};
