import { GoogleGenAI } from "@google/genai";
import * as FileSystem from 'expo-file-system';

/**
 * Generates a caption for an image using the Gemini API.
 *
 * @param imagePath - The path to the image file.
 * @param prompt - The prompt to use for captioning (optional, defaults to "Caption this image.").
 * @param modelName - The name of the Gemini model to use (optional, defaults to "gemini-2.0-flash").
 * @returns A promise that resolves to the generated caption, or null on error.
 */
export async function generateImageCaption(
    imagePath: string,
    prompt: string =  "Scan all the food ingredients you see in this image. List down all the ingredients, and the estimated quantity with units.",
    modelName: string = "gemini-2.0-flash"
): Promise<string | null> {
    if (!imagePath) {
            console.error("Image path is undefined or null");
            return null;
        }

    console.log("generateImageCaption received:", imagePath);
    try {
        const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
        const ai = new GoogleGenAI({apiKey: apiKey});
        const base64ImageFile = await FileSystem.readAsStringAsync(imagePath, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const extension = imagePath.split('.').pop()?.toLowerCase() || 'jpeg';
        const mimeType = `image/${extension}`;

        const structuredPrompt = `Analyze the provided image and identify all discernible food ingredients. For each ingredient you identify, please provide the following information:

            1.  **Name:** The common name of the food ingredient (e.g., "tomato", "onion", "olive oil"). Be as specific as possible (e.g., "cherry tomatoes" instead of just "tomatoes").
            2.  **Estimated Quantity:** A numerical estimation of the amount of the ingredient present. Use your best judgment based on visual cues like volume, weight, or count.
            3.  **Unit of Measurement:** The appropriate unit for the estimated quantity (e.g., "grams", "ml", "pieces", "cups", "tablespoons"). Choose the most relevant and common unit.
            4.  **Preparation (Optional):** If discernible, briefly describe the preparation state of the ingredient (e.g., "sliced", "diced", "whole", "chopped").
            5.  **Location (Optional):** Briefly describe where the ingredient is located within the image to provide spatial context (e.g., "in the bowl", "on the plate", "next to the knife").

            Structure your JSON output as follows:

            {
            "ingredients": [
                {
                "name": "string",
                "quantity": "string",
                "unit": "string",
                "preparation": "string (optional)",
                "location": "string (optional)"
                },
                {
                "name": "string",
                "quantity": "string",
                "unit": "string",
                "preparation": "string (optional)",
                "location": "string (optional)"
                },
                // ... more ingredients
            ]
            
            `;
        const contents = [
            {
                inlineData: {
                    mimeType: mimeType, // Assuming the image is a JPEG.  You might need to adjust this.
                    data: base64ImageFile,
                },
            },
            { text: structuredPrompt },
        ];

        const response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
        });

        // Check if response.text is defined before accessing it.
        if (response && response.candidates && response.candidates[0] && response.candidates[0].content) {
            return response.text!
        } else {
            console.warn("Received empty response from Gemini API.");
            return null; // Or you might want to throw an error here.
        }


    } catch (error) {
        console.error("Error generating image caption:", error);
        return null; // Handle the error and return null
    }
}
