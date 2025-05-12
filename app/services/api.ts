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
  minCarbs,
  maxCarbs,
  minProtein,
  maxProtein,
  minFats,
  maxFats,
}: {
  query: string;
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
}) => {
  const params = new URLSearchParams();

  params.append('apiKey', SPOONACULAR_CONFIG.API_KEY!);
  params.append('instructionsRequired', 'true');
  params.append('addRecipeInstructions', 'true');
  params.append('addRecipeNutrition', 'true');

  if (query) params.append('query', query);
  if (cuisine) params.append('cuisine', cuisine); // comma-separated if multiple
  if (diet) params.append('diet', diet);
  if (intolerances) params.append('intolerances', intolerances); // comma-separated
  if (dishType) params.append('type', dishType); // e.g., 'main course'

  if (minCarbs !== undefined) params.append('minCarbs', minCarbs);
  if (maxCarbs !== undefined) params.append('maxCarbs', maxCarbs);
  if (minProtein !== undefined) params.append('minProtein', minProtein);
  if (maxProtein !== undefined) params.append('maxProtein', maxProtein);
  if (minFats !== undefined) params.append('minFat', minFats);
  if (maxFats !== undefined) params.append('maxFat', maxFats);

  const endpoint = `${SPOONACULAR_CONFIG.BASE_URL}?${params}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: SPOONACULAR_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data: ' + response.statusText);
  }

  const data = await response.json();
  return data.results;
};
