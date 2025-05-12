"use client"

import { useEffect, useState, useCallback } from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MagnifyingGlass, SlidersHorizontal, X } from "phosphor-react-native"
import RecipeCard from "../components/recipe-card"
import { useRouter } from "expo-router"
import { fetchRecipes } from "../services/api"
import { Recipe } from "@/types/recipe"
import { dishTypeOptions, cuisineOptions, dietOptions, intoleranceOptions } from "@/constants/data"

export default function SearchScreen() {

  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Filters
  const [selectedDishTypes, setSelectedDishTypes] = useState<string[]>([])
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [selectedDiets, setSelectedDiets] = useState<string[]>([])
  const [selectedIntolerances, setSelectedIntolerances] = useState<string[]>([])

  const router = useRouter()

  // memoized search params avoid useless rerenders
  // basically only update when there actually isa change, not when the component re-renders
  const searchParams = useCallback(() => {
    return {
      query: searchQuery,
      cuisine: selectedCuisines.length > 0 ? selectedCuisines.join(',') : "",
      diet: selectedDiets.length > 0 ? selectedDiets.join(',') : "",
      intolerances: selectedIntolerances.length > 0 ? selectedIntolerances.join(','): "",
      dishType: selectedDishTypes.length > 0 ? selectedDishTypes.join('|') : ""
    }
  }, [searchQuery, selectedCuisines, selectedDiets, selectedIntolerances, selectedDishTypes])

  useEffect(() => {
    if(searchQuery.trim().length === 0){
      return;
    }

    setIsLoading(true)
    setError(null)

    const fetchData = setTimeout(async () => {
      try {
        const params = searchParams()
        const results = await fetchRecipes(params)
        setRecipes(results)
      }
      catch(err){
        console.error("Error fetching recipes", err) 
        setError("Fetch Error");
      }
      finally{
        setIsLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(fetchData)
    }
  }, [searchParams])
  
  // Clear search query and filters
  const clearSearch = () => {
    setSearchQuery('')
  }

  const clearAllFilters = () => {
    setSelectedDishTypes([]);
    setSelectedCuisines([]);
    setSelectedDiets([]);
    setSelectedIntolerances([]);
  }

  const optionsFilter = (title: string, options: string[], selectedOptions: string[], setSelectedOptions: (options: string[]) => void) => {
    return (
      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>{title}</Text>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.filterItem,
                selectedOptions.includes(option) && styles.filterItemSelected,
              ]}
              onPress = {() => {
                setSelectedOptions(prev => {
                  return prev.includes(option) ? prev.filter(opt => opt !== option) : [...prev, option]
                })
              }}  
            >
              <Text style={styles.filterItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MagnifyingGlass size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for recipes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={18} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={20} color={showFilters ? "#FF6B6B" : "#666"} />
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {searchQuery ? (
          <Text style={styles.resultsTitle}>Results for {searchQuery}</Text>
        ) : (
          <Text style={styles.resultsTitle}>All Recipes</Text>
        )}

        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RecipeCard recipe={item} style={styles.resultCard}/>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsGrid}
          numColumns={1}
          
        />
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          {optionsFilter("Dish Type", dishTypeOptions, selectedDishTypes, setSelectedDishTypes)}
          {optionsFilter("Cuisine", cuisineOptions, selectedCuisines, setSelectedCuisines)}
          {optionsFilter("Diet", dietOptions, selectedDiets, setSelectedDiets)}
          {optionsFilter("Intolerance", intoleranceOptions, selectedIntolerances, setSelectedIntolerances)}
      </View>
      )}

      {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text style={styles.loadingText}>Finding delicious recipes...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                // Trigger a re-fetch
                const params = searchParams();
                setIsLoading(true);
                setError(null);
                
                fetchRecipes(params)
                  .then(results => setRecipes(results))
                  .catch(err => {
                    console.error("Error retrying fetch:", err);
                    setError("Failed to fetch recipes. Please try again.");
                  })
                  .finally(() => setIsLoading(false));
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : recipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recipes found. Try adjusting your search or filters.</Text>
          </View>
        ) : (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <RecipeCard recipe={item} style={styles.resultCard} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsGrid}
            numColumns={1}
          />
        )}

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  filtersContainer: {
    flexDirection: "column",
    backgroundColor: "#f8f9f0",
    borderBottomWidth: 1,
    borderBottomColor: "#cbc7b7",
    paddingVertical: 10,
    paddingHorizontal: 16
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  filterHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#232d14",
  },
  clearFiltersText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#232d14",
    marginBottom: 8,
  },
  filterItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#cbc7b7",
    marginRight: 8,
    marginBottom: 8,
    alignSelf: "flex-start",
    backgroundColor: "#f8f9f0",
  },
  filterItemSelected: {
    backgroundColor: "#8cb89f",
    borderColor: "#232d14",
  },
  filterItemText: {
    fontSize: 14,
    color: "#232d14",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 12,
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  resultsGrid: {
    paddingBottom: 16,
  },
  resultCard: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF6B6B",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
})