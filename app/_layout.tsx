// App.tsx or Navigation.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/app/(tabs)/index";
import RecipeDetail from "@/app/recipes/[id]";
import { Recipe } from "@/types/recipe";
import App from "./(tabs)/_layout"; 

export type RootStackParamList = {
  Main: undefined;
  RecipeDetail: { recipe: Recipe };
};

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function RootLayout() {
  return (

      <Stack.Navigator>
        <Stack.Screen name="Main" component={App} options={{ headerShown: false }} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
        
      </Stack.Navigator>

  )
}
