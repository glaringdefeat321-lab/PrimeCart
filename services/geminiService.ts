import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Safe access to API Key that works in various environments (Vite, Next, standard Node)
const getApiKey = () => {
    try {
        // Check standard process.env (Node/Create React App)
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            return process.env.API_KEY;
        }
        // Check Vite specific env
        if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_KEY) {
            return (import.meta as any).env.VITE_API_KEY;
        }
    } catch (e) {
        console.warn("Could not read environment variables");
    }
    return '';
};

const apiKey = getApiKey();

// We initialize conditionally to avoid crashing if no key is present immediately
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI", e);
  }
}

export const getAIRecommendation = async (product: Product): Promise<string> => {
  if (!ai || !apiKey) {
    return "AI Features unavailable. Please configure your API Key in the deployment settings.";
  }

  try {
    const model = "gemini-3-flash-preview"; 
    const prompt = `
      You are a high-end fashion stylist assistant for 'PrimeCart'.
      I am looking at a product called "${product.name}".
      Description: ${product.description}.
      Category: ${product.category}.
      
      Please provide a short, sophisticated paragraph (max 80 words) advising on:
      1. What occasion fits this item best.
      2. One specific item (generic type) that pairs perfectly with it.
      
      Tone: Luxury, helpful, elegant.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Our stylists are currently busy. Please try again later.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to load AI recommendations at this moment.";
  }
};

export const getAdminProductInsight = async (products: Product[]): Promise<string> => {
    if (!ai || !apiKey) {
        return "AI Analytics unavailable. Please configure API_KEY.";
    }

    if (!products || products.length === 0) {
        return "No products available to analyze.";
    }

    try {
        const model = "gemini-3-flash-preview";
        const productNames = products.map(p => p.name).join(", ");
        const prompt = `
          Analyze this product catalog for a luxury e-commerce store: ${productNames}.
          Suggest 3 trending keywords or categories we should focus on adding next to increase revenue.
          Keep it brief and bulleted.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text || "Analysis pending...";
    } catch (error) {
        console.error("Gemini Insight Error:", error);
        return "Could not generate insights.";
    }
}