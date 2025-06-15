import {StyleSheet } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import Header from "./../components/home/Header"
import CreatedRecipes from "./../components/home/CreatedRecipes"

function HomeScreen() {
  return (
    
      <SafeAreaProvider style={styles.container}>
        {/* Recipe Generation Hero */}

        <Header/>
        {/* Food, nutrition and diet tips Footer */}
        <CreatedRecipes/>
        
      </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: "#f8f9f0",
  },
  
})
export default HomeScreen;
