export interface Recipe {
  id: number;
  image: string;
  imageType: string;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  sustainable: boolean;
  lowFodmap: boolean;
  weightWatcherSmartPoints: number;
  gaps: string;
  preparationMinutes: number | null;
  cookingMinutes: number | null;
  aggregateLikes: number;
  healthScore: number;
  creditsText: string;
  license: string | null;
  sourceName: string;
  pricePerServing: number;
  nutrition: {
    nutrients: {
      name: string;
      amount: number;
      unit: string;
      percentOfDailyNeeds: number;
    }[];
    properties: {
      name: string;
      amount: number;
      unit: string;
    }[];
    flavonoids: {
      name: string;
      amount: number;
      unit: string;
    }[];
    ingredients: {
      id: number
      name: string;
      amount: number;
      unit: string;
      nutrients: {
        name: string;
        amount: number;
        unit: string;
        percentOfDailyNeeds: number;
      }[];
    }[];
    caloricBreakdown: {
      percentProtein: number;
      percentFat: number;
      percentCarbs: number;
    };
    weightPerServing: {
      amount: number;
      unit: string;
    }
  };
  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  occasions: string[];
  analyzedInstructions: {
    name: string;
    steps: {
      number: number;
      step: string;
      ingredients: {
        id: number;
        name: string;
        localizedName: string;
        image: string;
      }[];
      equipment: {
        id: number;
        name: string;
        localizedName: string;
        image: string;
        temperature?: {
          number: number;
          unit: string;
        }
      }[];
      length?: {
        number: number;
        unit: string;
      };
    }[];
  }[];
  spoonacularScore: number;
  spoonacularSourceUrl: string;
}


