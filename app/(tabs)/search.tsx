"use client"

import { useState } from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MagnifyingGlass, SlidersHorizontal, X } from "phosphor-react-native"
import RecipeCard from "../components/recipe-card"
import { mockRecipes } from "@/constants/data"
import { useRouter } from "expo-router"

export default function SearchScreen() {
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  // Filter recipes based on search query
  const filteredRecipes = searchQuery.trim() 
    ? mockRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : mockRecipes

  // Clear search query
  const clearSearch = () => {
    setSearchQuery('')
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
          data={filteredRecipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RecipeCard recipe={item} style={styles.resultCard} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsGrid}
          numColumns={1}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
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
})