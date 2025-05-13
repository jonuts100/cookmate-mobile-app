// App.tsx or Navigation.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingPage from "./(auth)/landing";
import HomeScreen from "@/app/(tabs)/index";
import RecipeDetail from "@/app/recipes/[id]";
import SignInPage from "./(auth)/sign-in";
import SignUpPage from "./(auth)/sign-up";
import { Recipe } from "@/types/recipe";
import App from "./(tabs)/_layout"; 
import {UserDetailContext} from "@/context/UserDetailContext";
import { useState } from "react";
export type RootStackParamList = {
  Landing: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Main: undefined;
  RecipeDetail: { recipe: Recipe };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootLayout() {
  const [userDetail, setUserDetail] = useState();
  return (
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <Stack.Navigator>

          <Stack.Screen name="Landing" component={LandingPage} />
          <Stack.Screen name="SignUp" component={SignUpPage} />
          <Stack.Screen name="SignIn" component={SignInPage} />
          <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
          <Stack.Screen name="Main" component={App} options={{ headerShown: false }} />
          
        </Stack.Navigator>
      </UserDetailContext.Provider>

  )
}
