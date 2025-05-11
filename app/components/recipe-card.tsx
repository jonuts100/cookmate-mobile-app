import { StyleSheet, Text, View, Image, TouchableOpacity, type ViewStyle } from "react-native"
import { Clock, Flame, BookBookmark, Star } from "phosphor-react-native"
import type { Recipe } from "@/types/recipe"

interface RecipeCardProps {
  recipe: Recipe
  style?: ViewStyle
  layout?: "grid" | "list"
}

export default function RecipeCard({ recipe, style, layout = "grid" }: RecipeCardProps) {
  const isListLayout = layout === "list"

  return (
    <TouchableOpacity style={[styles.container, isListLayout ? styles.listContainer : styles.gridContainer, style]}>
      <View style={isListLayout ? styles.listContent : styles.gridContent}>
        <Image source={{ uri: recipe.imageUrl }} style={isListLayout ? styles.listImage : styles.gridImage} />

        <View style={isListLayout ? styles.listDetails : styles.gridDetails}>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{recipe.category}</Text>
          </View>

          <Text style={[styles.title, isListLayout && styles.listTitle]} numberOfLines={1}>
            {recipe.title}
          </Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={14} color="#888" />
              <Text style={styles.metaText}>{recipe.cookTime} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Flame size={14} color="#888" />
              <Text style={styles.metaText}>{recipe.calories} cal</Text>
            </View>
            <View style={styles.metaItem}>
              <Star size={14} color="#FFB800" />
              <Text style={styles.metaText}>{recipe.rating}</Text>
            </View>
          </View>

          {isListLayout && (
            <Text style={styles.description} numberOfLines={2}>
              {recipe.description}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.bookmarkButton}>
        <BookBookmark size={18} color="#FF6B6B" />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 0.05,
    position: "relative",
  },
  gridContainer: {
    height: 230,
  },
  listContainer: {
    height: 130,
  },
  gridContent: {
    flex: 1,
  },
  listContent: {
    flex: 1,
    flexDirection: "row",
  },
  gridImage: {
    height: 100,
    width: "100%",
  },
  listImage: {
    width: 120,
    height: "100%",
  },
  gridDetails: {
    padding: 12,
  },
  listDetails: {
    flex: 1,
    padding: 12,
  },
  categoryContainer: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  category: {
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 16,
  },
  metaContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    color: "#888",
    marginLeft: 4,
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    lineHeight: 18,
  },
  bookmarkButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFF",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
})
