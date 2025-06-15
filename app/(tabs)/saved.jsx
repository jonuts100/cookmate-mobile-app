import { useEffect, useState, useContext } from "react"
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Pressable, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { BookBookmark, GridFour, List } from "phosphor-react-native"
import RecipeCard from "../components/recipe-card"
import { db } from "@/config/firebaseConfig"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { UserDetailContext } from "@/context/UserDetailContext"
import NutritionInfoBlock from "../components/nutrition-block"
import { useRouter } from "expo-router"
export default function SavedScreen() {
  const { user, setRecipe } = useContext(UserDetailContext)
  const [userSavedRecipes, setSavedRecipes] = useState([])
  const [viewMode, setViewMode] = useState("grid")
  const router = useRouter()
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

  const goToRecipePage = (recipe) => {
    // This function now correctly receives the recipe object
    if (setRecipe) {
        setRecipe(recipe);
    }
    router.push("/recipes/detail");
  };

  return (
    <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Saved Recipes</Text>
            {userSavedRecipes.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.emptyMessage}>
                        You have not saved any recipes yet.
                    </Text>
                    <TouchableOpacity
                        style={styles.generateButton}
                        onPress={() => router.push('/(tabs)/search')}
                    >
                        <Text style={styles.generateButtonText}>
                            Explore recipes
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={userSavedRecipes}
                    keyExtractor={item => item.id.toString()}
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContentContainer}
                    renderItem={({ item }) => (
                        <Pressable style={styles.recipeItem} onPress={() => goToRecipePage(item)}>
                            <Text style={styles.recipeTitle} numberOfLines={2}>{item.title}</Text>
                            <View style={styles.badgeContainer}>
                                {item.cuisines?.map((cuisine, index) => (
                                    <View key={index} style={styles.badgeTag}>
                                        <Text style={styles.badgeText}>{cuisine}</Text>
                                    </View>
                                ))}
                                <View style={styles.badgeTag}>
                                    <Text style={styles.badgeText}>
                                        {item.diets?.length > 0 ? item.diets[0] : 'No specific diets'}
                                    </Text>
                                </View>
                                <View style={styles.badgeTag}>
                                    <Text style={styles.badgeText}>
                                        {item.readyInMinutes ? `${item.readyInMinutes} min` : 'No time specified'}
                                    </Text>
                                </View>
                            </View>

                            {item.nutrition && item.nutrition.nutrients && (
                                <View style={styles.nutritionContainer}>
                                    {item.nutrition.nutrients.slice(0, 4).map((nutrient, index) => (
                                        <NutritionInfoBlock
                                            key={index}
                                            name={nutrient.name}
                                            amount={nutrient.amount}
                                            unit={nutrient.unit}
                                            percentage={nutrient.percentOfDailyNeeds}
                                        />
                                    ))}
                                </View>
                            )}
                        </Pressable>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

// Get the width of the screen
const { width: screenWidth } = Dimensions.get('window');
// Set the width of the card to be 75% of the screen width
const cardWidth = screenWidth * 0.9;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9f0',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin:'auto',
        padding: 20,
    },
    emptyMessage: {
        fontSize: 18,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 24,
    },
    generateButton: {
        backgroundColor: '#cc3300',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    generateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    listContentContainer: {
        paddingHorizontal: 10,
    },
    recipeItem: {
        backgroundColor: '#f2ede0',
        borderRadius: 16,
        padding: 20,
        width: cardWidth,
        marginHorizontal: 10,
        marginVertical: 10,
        elevation: 1,
    },
    recipeTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#cc3300',
        marginBottom: 12,
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 15,
    },
    badgeTag: {
        backgroundColor: '#f8f9f0',
        borderRadius: 15,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6c757d',
    },
    nutritionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
        padding: 15,
        backgroundColor: '#f2ede0',
        borderRadius: 15,
    }
});