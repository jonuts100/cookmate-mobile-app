// context/UserDetailContext.jsx
import { createContext } from "react";

export const UserDetailContext = createContext({
  user: null,
  setUser: () => {},
  recipe: null,
  setRecipe: () => {}
});
