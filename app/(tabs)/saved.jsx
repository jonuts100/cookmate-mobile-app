import { useEffect, useState, useContext } from "react"
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { BookBookmark, GridFour, List } from "phosphor-react-native"
import RecipeCard from "../components/recipe-card"
import { db } from "@/config/firebaseConfig"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { UserDetailContext } from "@/context/UserDetailContext"
export default function SavedScreen() {
  const { user } = useContext(UserDetailContext)
  const [userSavedRecipes, setSavedRecipes] = useState([])
  const [viewMode, setViewMode] = useState("grid")
  
  const fetchSavedRecipes = async () => {
  try {
    const collectionRef = collection(db, 'savedRecipes')
    const queryRef = query(
      collectionRef,
      where('user', '==', user.email),
      orderBy("savedOn", "desc")
    )
    const querySnapshot = await getDocs(queryRef)
    
    const recipesData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data().recipeData,   // This gets the full recipe details
      savedOn: doc.data().savedOn,
    }))

    setSavedRecipes(recipesData)
  } catch (error) {
    console.error("Error fetching saved recipes: ", error)
  }
}

  useEffect(() => {
    console.log(userSavedRecipes)
    fetchSavedRecipes()
    
  }, [])


  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <BookBookmark size={60} color="#DDD" />
      <Text style={styles.emptyTitle}>No saved recipes yet</Text>
      <Text style={styles.emptySubtitle}>
        Your saved recipes will appear here. Start exploring and save recipes you love!
      </Text>
      <TouchableOpacity style={styles.exploreButton}>
        <Text style={styles.exploreButtonText}>Explore Recipes</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Recipes</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.viewToggleButton, viewMode === "grid" && styles.viewToggleButtonActive]}
            onPress={() => setViewMode("grid")}
          >
            <GridFour size={18} color={viewMode === "grid" ? "#FF6B6B" : "#888"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewToggleButton, viewMode === "list" && styles.viewToggleButtonActive]}
            onPress={() => setViewMode("list")}
          >
            <List size={18} color={viewMode === "list" ? "#FF6B6B" : "#888"} />
          </TouchableOpacity>
        </View>
      </View>

      {userSavedRecipes.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={userSavedRecipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              style={viewMode === "grid" ? styles.gridCard : styles.listCard}
              layout={viewMode}
              
            />
          )}
          numColumns={viewMode === "grid" ? 2 : 1}
          key={viewMode} // Force re-render when changing layout
          contentContainerStyle={styles.recipesList}
          columnWrapperStyle={viewMode === "grid" ? styles.gridWrapper : undefined}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 4,
  },
  viewToggleButton: {
    padding: 8,
    borderRadius: 6,
  },
  viewToggleButtonActive: {
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  recipesList: {
    padding: 16,
  },
  gridWrapper: {
    justifyContent: "space-between",
  },
  gridCard: {
    width: "48%",
    marginBottom: 16,
  },
  listCard: {
    marginBottom: 16,
    width: "100%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  exploreButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
})
