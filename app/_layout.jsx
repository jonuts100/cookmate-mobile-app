
import { UserDetailContext} from "@/context/UserDetailContext";

import { Stack } from "expo-router";
import { useState } from "react";


export default function RootLayout() {

    const [user, setUser] = useState(null);
    const [recipe, setRecipe] = useState(null);
  return (
    
      <UserDetailContext.Provider value={{ user, setUser, recipe, setRecipe }}>
        <Stack screenOptions={{ headerShown: false }}></Stack>
      </UserDetailContext.Provider>

  )
}
