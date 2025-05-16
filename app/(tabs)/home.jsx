import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Header from "./../components/home/Header"
export default function HomeScreen() {
  return (
    
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recipe Generation Hero */}

        <Header/>
        {/* Food, nutrition and diet tips Footer */}
        
      </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  
})
