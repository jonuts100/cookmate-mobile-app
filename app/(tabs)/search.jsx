import { useEffect, useState, useCallback, useRef, useContext } from "react"
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Animated,
  Image,
  Platform,
  Pressable,
  Dimensions
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MagnifyingGlass, X, Funnel } from "phosphor-react-native"
import { fetchRecipes } from "../services/api"
import { dishTypeOptions, cuisineOptions, dietOptions, intoleranceOptions } from "@/constants/data"
import { BlurView } from "expo-blur"
import NutritionInfoBlock from "../components/nutrition-block"
import { UserDetailContext } from "@/context/UserDetailContext"
import { useRouter } from "expo-router"

export default function SearchScreen() {
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [recipes, setRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const { setRecipe } = useContext(UserDetailContext);
  const router = useRouter()
  // Filters
  const [selectedDishTypes, setSelectedDishTypes] = useState([])
  const [selectedCuisines, setSelectedCuisines] = useState([])
  const [selectedDiets, setSelectedDiets] = useState([])
  const [selectedIntolerances, setSelectedIntolerances] = useState([])

  const filterSlideAnim = useRef(new Animated.Value(0)).current
  const filterOpacityAnim = useRef(new Animated.Value(0)).current

  // Calculate active filters count
  useEffect(() => {
    const count =
      selectedDishTypes.length + selectedCuisines.length + selectedDiets.length + selectedIntolerances.length
    setActiveFiltersCount(count)
  }, [selectedDishTypes, selectedCuisines, selectedDiets, selectedIntolerances])

  // Animate filter panel
  useEffect(() => {
    Animated.parallel([
      Animated.timing(filterSlideAnim, {
        toValue: showFilters ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(filterOpacityAnim, {
        toValue: showFilters ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [showFilters])

  // memoized search params avoid useless rerenders
  const searchParams = useCallback(() => {
    return {
      query: searchQuery,
      cuisine: selectedCuisines.length > 0 ? selectedCuisines.join(",") : "",
      diet: selectedDiets.length > 0 ? selectedDiets.join(",") : "",
      intolerances: selectedIntolerances.length > 0 ? selectedIntolerances.join(",") : "",
      dishType: selectedDishTypes.length > 0 ? selectedDishTypes.join("|") : "",
    }
  }, [searchQuery, selectedCuisines, selectedDiets, selectedIntolerances, selectedDishTypes])

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      return
    }

    setIsLoading(true)
    setError(null)

    const fetchData = setTimeout(async () => {
      try {
        const params = searchParams()
        const results = await fetchRecipes(params)
        setRecipes(results)
      } catch (err) {
        console.error("Error fetching recipes", err)
        setError("Failed to fetch recipes. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }, 500)

    return () => {
      clearTimeout(fetchData)
    }
  }, [searchParams])

  // Clear search query and filters
  const clearSearch = () => {
    setSearchQuery("")
  }

  const clearAllFilters = () => {
    setSelectedDishTypes([])
    setSelectedCuisines([])
    setSelectedDiets([])
    setSelectedIntolerances([])
  }

  const optionsFilter = (
    title,
    options,
    selectedOptions,
    setSelectedOptions
  ) => {
    return (
      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>{title}</Text>
        <View style={styles.filterOptionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.filterItem, selectedOptions.includes(option) && styles.filterItemSelected]}
              onPress={() => {
                setSelectedOptions((prev) => {
                  return prev.includes(option) ? prev.filter((opt) => opt !== option) : [...prev, option]
                })
              }}
            >
              <Text style={[styles.filterItemText, selectedOptions.includes(option) && styles.filterItemSelectedText]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

    const goToRecipePage = (recipe) => {
        // This function now correctly receives the recipe object
        if (setRecipe) {
            setRecipe(recipe);
        }
        router.push("/recipes/detail");
    };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#cc3300" />
          <Text style={styles.loadingText}>Finding delicious recipes...</Text>
        </View>
      )
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/5741/5741333.png" }}
            style={{ width: 80, height: 80, marginBottom: 16, opacity: 0.7 }}
          />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              const params = searchParams()
              setIsLoading(true)
              setError(null)

              fetchRecipes(params)
                .then((results) => setRecipes(results))
                .catch((err) => {
                  console.error("Error retrying fetch:", err)
                  setError("Failed to fetch recipes. Please try again.")
                })
                .finally(() => setIsLoading(false))
            }}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )
    }

    if (searchQuery && recipes.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/7486/7486754.png" }}
            style={{ width: 100, height: 100, marginBottom: 16, opacity: 0.7 }}
          />
          <Text style={styles.emptyText}>No recipes found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
        </View>
      )
    }

    if (!searchQuery) {
      return (
        <View style={styles.centerContainer}>
          {/* <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/3480/3480710.png" }}
            style={{ width: 100, height: 100, marginBottom: 16, opacity: 0.7 }}
          /> */}
          <Text style={styles.emptyText}>Search for recipes</Text>
          <Text style={styles.emptySubtext}>Find delicious recipes by name, ingredient, or cuisine</Text>
        </View>
      )
    }

    return null
  }

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recipe Search</Text>
        <View style={{ width: 40 }} />
      </View> */}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MagnifyingGlass size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for recipes..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Funnel size={18} weight={showFilters ? "fill" : "regular"} color={showFilters ? "#fff" : "#666"} />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Results */}
      <View style={styles.resultsContainer}>
        {searchQuery ? (
          <View style={styles.resultsTitleContainer}>
            <Text style={styles.resultsTitle}>Results for {searchQuery}</Text>
            {recipes.length > 0 && <Text style={styles.resultsCount}>{recipes.length} recipes found</Text>}
          </View>
        ) : (
          <View style={styles.resultsTitleContainer}>
            <Text style={styles.resultsTitle}>All Recipes</Text>
          </View>
        )}

        {recipes.length > 0 ? (
          <FlatList
            data={recipes}
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
        ) : (
          renderEmptyState()
        )}
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <Animated.View
          style={[
            styles.filtersOverlay,
            {
              opacity: filterOpacityAnim,
            },
          ]}
        >
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setShowFilters(false)}>
            <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.filtersPanel,
              {
                transform: [
                  {
                    translateY: filterSlideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [600, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.filtersPanelHeader}>
              <Text style={styles.filtersPanelTitle}>Filters</Text>
              <TouchableOpacity onPress={clearAllFilters} style={styles.clearFiltersButton}>
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filtersPanelHandle} />

            <ScrollView style={styles.filtersScrollView} showsVerticalScrollIndicator={false}>
              {optionsFilter("Dish Type", dishTypeOptions, selectedDishTypes, setSelectedDishTypes)}
              {optionsFilter("Cuisine", cuisineOptions, selectedCuisines, setSelectedCuisines)}
              {optionsFilter("Diet", dietOptions, selectedDiets, setSelectedDiets)}
              {optionsFilter("Intolerance", intoleranceOptions, selectedIntolerances, setSelectedIntolerances)}
            </ScrollView>

            <View style={styles.filtersPanelFooter}>
              <TouchableOpacity style={styles.applyFiltersButton} onPress={() => setShowFilters(false)}>
                <Text style={styles.applyFiltersText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </SafeAreaView>
  )
}
// Get the width of the screen
const { width: screenWidth } = Dimensions.get('window');
// Set the width of the card to be 75% of the screen width
const cardWidth = screenWidth * 0.9
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f2ede0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "#f8f9f0",
    borderBottomWidth: 1,
    borderBottomColor: "#f2ede0",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2ede0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#666",
  },
  clearButton: {
    padding: 6,
  },
  filterButton: {
    marginLeft: 12,
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f2ede0",
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#cc3300",
  },
  filterBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#cc3300",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: "#f7f7f7",
    fontSize: 10,
    fontWeight: "bold",
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitleContainer: {
    marginBottom: 16,
    paddingLeft: 16,
    paddingTop: 16,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  resultsCount: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  resultsGrid: {
    paddingBottom: 16,
  },
  resultCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#cc3300",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#cc3300",
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  filtersOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  filtersPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    maxHeight: "80%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  filtersPanelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  filtersPanelTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  filtersPanelHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    position: "absolute",
    top: 10,
  },
  clearFiltersButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearFiltersText: {
    fontSize: 14,
    color: "#cc3300",
    fontWeight: "600",
  },
  filtersScrollView: {
    paddingHorizontal: 24,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  filterOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  filterItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#F5F5F5",
  },
  filterItemSelected: {
    backgroundColor: "#cc3300",
    borderColor: "#cc3300",
  },
  filterItemText: {
    fontSize: 14,
    color: "#666",
  },
  filterItemSelectedText: {
    color: "#FFF",
    fontWeight: "500",
  },
  filtersPanelFooter: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  applyFiltersButton: {
    backgroundColor: "#cc3300",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  applyFiltersText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  listContentContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        gap: 12
    },
  recipeItem: {
        backgroundColor: '#f2ede0',
        borderRadius: 20,
        padding: 20,
        width: cardWidth,
        marginHorizontal: 10,
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
})
