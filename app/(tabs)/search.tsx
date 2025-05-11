"use client"

import { useState } from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MagnifyingGlass, SlidersHorizontal, X } from "phosphor-react-native"
import RecipeCard from "../components/recipe-card"
import { mockRecipes } from "@/constants/data"

const filterCategories = [
  { id: "cuisine", name: "Cuisine", options: ["Italian", "Mexican", "Asian", "Indian", "American"] },
  { id: "diet", name: "Diet", options: ["Vegetarian", "Vegan", "Gluten-Free", "Keto", "Paleo"] },
  { id: "meal", name: "Meal Type", options: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"] },
  { id: "time", name: "Cook Time", options: ["< 15 min", "15-30 min", "30-60 min", "> 60 min"] },
]

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter))
    } else {
      setActiveFilters([...activeFilters, filter])
    }
  }

  const clearFilters = () => {
    setActiveFilters([])
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
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={18} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal size={20} color={showFilters ? "#FF6B6B" : "#666"} />
        </TouchableOpacity>
      </View>

      {/* Filters Section */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filters</Text>
            {activeFilters.length > 0 && (
              <TouchableOpacity onPress={clearFilters}>
                <Text style={styles.clearFiltersText}>Clear all</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeFiltersContainer}>
            {activeFilters.map((filter) => (
              <TouchableOpacity key={filter} style={styles.activeFilterChip} onPress={() => toggleFilter(filter)}>
                <Text style={styles.activeFilterText}>{filter}</Text>
                <X size={14} color="#FFF" />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView style={styles.filterCategoriesContainer}>
            {filterCategories.map((category) => (
              <View key={category.id} style={styles.filterCategory}>
                <Text style={styles.filterCategoryTitle}>{category.name}</Text>
                <View style={styles.filterOptionsContainer}>
                  {category.options.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[styles.filterOptionChip, activeFilters.includes(option) && styles.filterOptionChipActive]}
                      onPress={() => toggleFilter(option)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          activeFilters.includes(option) && styles.filterOptionTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {searchQuery ? (
          <Text style={styles.resultsTitle}>Results for {searchQuery}</Text>
        ) : (
          <Text style={styles.resultsTitle}>Popular Recipes</Text>
        )}

        <FlatList
          data={mockRecipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <RecipeCard recipe={item} style={styles.resultCard} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsGrid}
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
  filtersContainer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  filtersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  clearFiltersText: {
    fontSize: 14,
    color: "#FF6B6B",
  },
  activeFiltersContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  activeFilterChip: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  activeFilterText: {
    color: "#FFF",
    marginRight: 6,
    fontSize: 13,
  },
  filterCategoriesContainer: {
    maxHeight: 300,
  },
  filterCategory: {
    marginBottom: 16,
  },
  filterCategoryTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  filterOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterOptionChip: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionChipActive: {
    backgroundColor: "#FFE0E0",
  },
  filterOptionText: {
    color: "#666",
    fontSize: 13,
  },
  filterOptionTextActive: {
    color: "#FF6B6B",
    fontWeight: "500",
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
