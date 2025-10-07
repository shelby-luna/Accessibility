
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateAltText = async (imageDataBase64: string, mimeType: string): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        data: imageDataBase64,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: "Generate a descriptive yet concise alt text for this image. The alt text should be suitable for screen readers and improve web accessibility. Focus on the main subject and context of the image.",
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    const text = response.text;
    if (!text) {
      throw new Error("API returned an empty response.");
    }
    
    // Sometimes the model might wrap the text in quotes, so we remove them.
    return text.trim().replace(/^"|"$/g, '');

  } catch (error) {
    console.error("Error generating alt text:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};
