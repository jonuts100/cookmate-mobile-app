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

export interface RecipePromptInput {
  ingredients: string[];
  cuisines?: string[];
  dishType?: string[]; // now a list
  intolerances?: string[];
  diets?: string[];
  servings?: number;
  cookingTime?: number;
  minCarbs?: number;
  minFats?: number;
  minProteins?: number;
  equipmentLevel?: string;
}


export async function generateImageCaption(
    imagePath: string,
    prompt: string =  "Scan all the food ingredients you see in this image. List down all the ingredients, and the estimated quantity with units.",
    modelName: string = "gemini-2.0-flash"
): Promise<string | null> {
    if (!imagePath) {
            console.error("Image path is undefined or null");
            return null;
        }

    
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


function generateRecipePrompt({
  ingredients,
  cuisines = [],
  dishType = [],
  intolerances = [],
  diets = [],
  servings = 1,
  cookingTime = undefined,
  minCarbs = undefined,
  minFats = undefined,
  minProteins = undefined,
  equipmentLevel = "basic"
}: RecipePromptInput): string {
  const listOrNone = (arr: string[]) => arr.length ? arr.join(", ") : "none specified";
  const withUnit = (val: number | undefined, unit: string) => val !== undefined ? `${val} ${unit}` : "not specified";
  const quoteList = (arr: string[]) => arr.map(item => `"${item}"`).join(", ");
  return `
You are a world-class AI chef. You will generate **one recipe only** in **strict JSON format** based on the user's ingredients and preferences.

---

### 🍳 ABSOLUTE RULES:

1. ✅ **Use ONLY the ingredients provided below** — no substitutions, no assumptions, no additions.
2. ❌ **Do NOT invent or assume** any ingredients (e.g., oil, salt, garlic, herbs, spices) unless they are explicitly listed.
3. ✅ The recipe must use only these ingredients and reflect them accurately in all steps, instructions, and nutrition.
4. ✅ The response must contain exactly **one recipe**, not more.
5. ✅ Follow all dietary and intolerance requirements strictly.
6. ✅ Assume the user has only **${equipmentLevel}-level kitchen tools**.

---

### 🧾 User Inputs

- **Ingredients**: ${quoteList(ingredients)}
- **Preferred Cuisines**: ${listOrNone(cuisines)}
- **Dish Types**: ${listOrNone(dishType)}
- **Avoid These (Intolerances)**: ${listOrNone(intolerances)}
- **Diets**: ${listOrNone(diets)}
- **Servings**: ${servings}
- **Max Cooking Time**: ${withUnit(cookingTime, "minutes")}
- **Minimum Macros per Serving**:
  - Protein: ${withUnit(minProteins, "g")}
  - Fats: ${withUnit(minFats, "g")}
  - Carbs: ${withUnit(minCarbs, "g")}

---

### 🧠 JSON Response Format

Respond ONLY with a valid JSON object like this (no markdown, no commentary):

\`\`\`json
{
  "recipe": {
    "image": "<food_image_url>",
    "imageType": "jpg",
    "title": "<recipe name>",
    "readyInMinutes": <number>,
    "servings": ${servings},
    "healthScore": <number>,
    "creditsText": "AI Generated",
    "nutrition": {
      "nutrients": [
        {
          "name": "Calories",
          "amount": <number>,
          "unit": "kcal",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Protein",
          "amount": <number>,
          "unit": "g",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Fat",
          "amount": <number>,
          "unit": "g",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Carbohydrates",
          "amount": <number>,
          "unit": "g",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Net Carbohydrates",
          "amount": <number>,
          "unit": "g",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Sugar",
          "amount": <number>,
          "unit": "g",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Cholesterol",
          "amount": <number>,
          "unit": "mg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Sodium",
          "amount": <number>,
          "unit": "mg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Alcohol",
          "amount": <number>,
          "unit": "g",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Alcohol %",
          "amount": <number>,
          "unit": "%",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Protein",
          "amount": <number>,
          "unit": "g",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Manganese",
          "amount": <number>,
          "unit": "mg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Vitamin C",
          "amount": <number>,
          "unit": "mg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Magnesium",
          "amount": <number>,
          "unit": "mg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Phosphorus",
          "amount": <number>,
          "unit": "mg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Copper",
          "amount": <number>,
          "unit": "mg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Folate",
          "amount": <number>,
          "unit": "µg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Vitamin A",
          "amount": <number>,
          "unit": "IU",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Fiber",
          "amount": <number>,
          "unit": "g",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Vitamin B6",
          "amount": <number>,
          "unit": "mg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Iron",
          "amount": <number>,
          "unit": "mg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Vitamin B1",
          "amount": <number>,
          "unit": "mg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Zinc",
          "amount": <number>,
          "unit": "mg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Vitamin E",
          "amount": <number>,
          "unit": "mg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Vitamin B2",
          "amount": <number>,
          "unit": "mg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Potassium",
          "amount": <number>,
          "unit": "mg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Calcium",
          "amount": <number>,
          "unit": "mg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Selenium",
          "amount": <number>,
          "unit": "µg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Vitamin B5",
          "amount": <number>,
          "unit": "mg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Vitamin B3",
          "amount": <number>,
          "unit": "mg",
          "percentOfDailyNeeds": <number>
        },
        {
          "name": "Vitamin K",
          "amount": <number>,
          "unit": "µg",
          "percentOfDailyNeeds": <number>
        }
      ],
      "ingredients": [
        {
          "name": <ingredient name>,
          "amount" : <number>,
          "unit" : <unit>,
          "percentOfDailyNeeds": <number>
        }
      ]
    },
    "summary": "<short HTML-formatted description of the dish>",
    "cuisines": [${quoteList(cuisines)}],
    "dishTypes": [${quoteList(dishType)}],
    "diets": [${quoteList(diets)}],
    "analyzedInstructions": [
      {
        "name": "",
        "steps": [
          {
            "number": 1,
            "step": "<step instruction>",
            "ingredients" : [
              {
                "name": <ingredient name>
              }
              // More ingredients if needed...
            ],
            "equipment" : [
              {
                "name": <equipment name>,
              }
              // More equipment if needed...
            ]
          }
          // More steps if needed...
        ]
      }
    ]
  }
}
\`\`\`

---

### 🔒 Final Reminder:
- Use only the ingredients: ${quoteList(ingredients)}
- Generate just **one recipe**
- Do not add or invent anything else
`.trim();
}

export async function generateRecipeFromGemini(userInput: RecipePromptInput): Promise<any> {
  const prompt = generateRecipePrompt(userInput);
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
  const ai = new GoogleGenAI({apiKey: apiKey});
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      temperature: 0.2,
      systemInstruction: "You are a professional home cook and recipe expert named Neko. You specialize in creating creative, nutritious, and easy-to-follow recipes tailored to the user's available ingredients, dietary preferences, and cooking equipment. Always respond with helpful, clear, and structured cooking instructions in a JSON format suitable for use in a cooking app."
    },
  });
    // Check if response.text is defined before accessing it.
  if (response && response.candidates && response.candidates[0] && response.candidates[0].content) {
      return response.text!
  } else {
      console.warn("Received empty response from Gemini API.");
      return null; // Or you might want to throw an error here.
  }
  
}

