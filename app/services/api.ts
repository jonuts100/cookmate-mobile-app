import { Recipe } from "@/types/recipe";

export const SPOONACULAR_CONFIG = {
  BASE_URL: "https://api.spoonacular.com/recipes/complexSearch",
  API_KEY: process.env.EXPO_PUBLIC_RECIPE_API_KEY,
  headers: {
    accept: "application/json",
  },
};

export const fetchRecipes = async ({
  query,
  cuisine,
  diet,
  intolerances,
  dishType,
  minCarbs = "0",
  maxCarbs = "100",
  minProtein = "0",
  maxProtein = "100",
  minFats = "0",
  maxFats = "100",
}: {
  query?: string;
  cuisine?: string;
  diet?: string;
  intolerances?: string;
  dishType?: string;
  minCarbs?: string;
  maxCarbs?: string;
  minProtein?: string;
  maxProtein?: string;
  minFats?: string;
  maxFats?: string;
}): Promise<Recipe[]> => {
  const params = query ? new URLSearchParams({
    apiKey: SPOONACULAR_CONFIG.API_KEY || "", // fallback in case env is undefined
    query: query.trim(),
    ...(cuisine && { cuisine }),
    ...(diet && { diet }),
    ...(intolerances && { intolerances }),
    ...(dishType && { type: dishType }),
    ...(minCarbs && { minCarbs }),
    ...(maxCarbs && { maxCarbs }),
    ...(minProtein && { minProtein }),
    ...(maxProtein && { maxProtein }),
    ...(minFats && { minFats }),
    ...(maxFats && { maxFats }),
    instructionsRequired: "true",
    addRecipeInformation: "true",
    addRecipeInstructions: "true",
    addRecipeNutrition: "true",

  }) : new URLSearchParams({
    apiKey: SPOONACULAR_CONFIG.API_KEY || "",
    instructionsRequired: "true",
    addRecipeInformation: "true",
    addRecipeInstructions: "true",
    addRecipeNutrition: "true",
  });
  console.log(params)
  const endpoint = `${SPOONACULAR_CONFIG.BASE_URL}?${params.toString()}`;
  console.log(endpoint)
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: SPOONACULAR_CONFIG.headers,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to fetch recipes: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    return data.results as Recipe[];
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};
