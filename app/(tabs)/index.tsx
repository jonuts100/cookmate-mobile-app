import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { CaretCircleDoubleRight , Sparkle } from "phosphor-react-native"
import RecipeCard from "../components/recipe-card"
import { mockRecipes } from "@/constants/data"

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recipe Generation Hero */}
        <View style={styles.heroContainer}>
          <View style={styles.heroContent}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>Generate Custom Recipes</Text>
              <Text style={styles.heroSubtitle}>
                Create personalized recipes based on your ingredients and preferences
              </Text>
              <TouchableOpacity style={styles.generateButton} >
                <Text style={styles.generateButtonText}>Generate Recipe</Text>
                <Sparkle size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            {/* <Image
              source={{ uri: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=500" }}
              style={styles.heroImage}
            /> */}
          </View>
        </View>

        {/* Recipe History Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Viewed</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <CaretCircleDoubleRight size={16} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {mockRecipes.slice(0, 4).map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} style={styles.historyCard} />
            ))}
          </ScrollView>
        </View>

        {/* Recipe Recommendation Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <CaretCircleDoubleRight size={16} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
          <View style={styles.recommendationsGrid}>
            {mockRecipes.slice(4, 8).map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} style={styles.recommendationCard} />
            ))}
          </View>
        </View>

        {/* Food, nutrition and diet tips Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerTitle}>Nutrition & Diet Tips</Text>
          <View style={styles.tipContainer}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=200" }}
              style={styles.tipImage}
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Balanced Diet Essentials</Text>
              <Text style={styles.tipDescription}>
                Learn about the key components of a balanced diet and how to incorporate them into your meals.
              </Text>
              <TouchableOpacity>
                <Text style={styles.readMoreText}>Read More</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.tipContainer}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=200" }}
              style={styles.tipImage}
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Seasonal Eating Guide</Text>
              <Text style={styles.tipDescription}>
                Discover the benefits of eating seasonal produce and how it can improve your health.
              </Text>
              <TouchableOpacity>
                <Text style={styles.readMoreText}>Read More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  heroContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  generateButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 250,
  },
  generateButtonText: {
    color: "#FFF",
    fontWeight: "600",
    marginRight: 8,
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 14,
    color: "#FF6B6B",
    marginRight: 4,
  },
  horizontalScroll: {
    flexDirection: "row",
  },
  historyCard: {
    width: 160,
    marginRight: 12,
  },
  recommendationsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  recommendationCard: {
    width: "48%",
    marginBottom: 16,
  },
  footerContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  tipContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
  },
  tipImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  tipDescription: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    lineHeight: 18,
  },
  readMoreText: {
    color: "#FF6B6B",
    fontWeight: "500",
    fontSize: 13,
  },
})
