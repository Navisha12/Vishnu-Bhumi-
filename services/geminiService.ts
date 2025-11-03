
import { GoogleGenAI, Type } from "@google/genai";
import type { SoilAnalysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const soilAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        soilQuality: {
            type: Type.NUMBER,
            description: "A numerical score from 0 (very poor) to 100 (excellent) representing the overall health of the soil.",
        },
        soilType: {
            type: Type.STRING,
            description: "A string identifying the primary soil type (e.g., 'Sandy', 'Clay', 'Loam', 'Silt', 'Peat', 'Chalky').",
        },
        summary: {
            type: Type.STRING,
            description: "A concise, one-paragraph summary of the soil's condition.",
        },
        cropRecommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of strings, listing crops that are well-suited for this type of soil.",
        },
        restPeriod: {
            type: Type.STRING,
            description: "A string suggesting an appropriate fallow or rest period for the soil to recover nutrients (e.g., '2-3 months', 'One planting season').",
        },
        improvementSteps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of strings providing actionable steps to improve the soil quality. If the soil is excellent, suggest steps to maintain its health.",
        },
    },
    required: ["soilQuality", "soilType", "summary", "cropRecommendations", "restPeriod", "improvementSteps"],
};


export const analyzeSoilImage = async (base64Image: string, mimeType: string): Promise<SoilAnalysis> => {
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: "You are an expert agricultural scientist specializing in soil health and regenerative farming. Analyze this soil image and provide a detailed analysis based on the provided JSON schema. Do not include any introductory text, markdown formatting, or explanations in your response. Only the JSON object is allowed."
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
    config: {
        responseMimeType: "application/json",
        responseSchema: soilAnalysisSchema,
    }
  });

  const jsonString = response.text;
  
  try {
      const parsedJson = JSON.parse(jsonString);
      return parsedJson as SoilAnalysis;
  } catch (error) {
      console.error("Failed to parse JSON response:", jsonString);
      throw new Error("The model returned an invalid data format.");
  }
};
