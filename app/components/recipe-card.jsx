import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native"
import { Bookmark, Clock } from "phosphor-react-native"
import { images } from "@/constants/images"
import { useRouter } from "expo-router";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";

// interface RecipeCardProps {
//   recipe: Recipe
//   style?: ViewStyle
//   layout?: "grid" | "list"
// }

export default function RecipeCard({ recipe, style, layout = "list" }) {
  const isListLayout = layout === "list"
  const nutrientColors = {
    Calories: '#FFB74D',       // Orange
    Protein: '#81C784',        // Green
    Fat: '#E57373',            // Red
    Carbohydrates: '#64B5F6',  // Blue
  };

  const dietIcons = {
    vegan: images.vegan,
    vegetarian: images.vegetarian,
    glutenFree: images.glutenFree,
    dairyFree: images.dairyFree,
    pescatarian: images.meat,
    
  }

  const dietTintColor = {
    vegan: '#4CAF50',        // Green — symbolizes plants, sustainability
    vegetarian: '#8BC34A',   // Light green — similar to vegan, but a bit softer
    glutenFree: '#FF9800',   // Orange — often used in allergy/warning contexts
    dairyFree: '#03A9F4',    // Blue — clean, cool, non-dairy feel
    meat: '#a73520',  // Teal — evokes the ocean and fish
  };

  const router = useRouter();
  const { setRecipe } = useContext(UserDetailContext);
  return (
    <TouchableOpacity 
      style={[styles.container, isListLayout ? styles.listContainer : styles.gridContainer, style]} 
      onPress={() => {
          setRecipe(recipe);
          router.push(`/recipes/detail`);
      }}
    >
      <View style={isListLayout ? styles.listContent : styles.gridContent}>
        
        <Image source={{ uri: recipe.image }} style={isListLayout ? styles.listImage : styles.gridImage} />

        <View style={isListLayout ? styles.listDetails : styles.gridDetails}>
          <View style={styles.categoryContainer}>
            {recipe.glutenFree ? <Image source={dietIcons.glutenFree} style={styles.dietIcon} tintColor={dietTintColor.glutenFree}/> : null}
            {recipe.vegan ? <Image source={dietIcons.vegan} style={styles.dietIcon} tintColor={dietTintColor.vegan}/> : <Image source={images.meat} style={styles.dietIcon} tintColor={dietTintColor.meat}></Image>}
            {recipe.vegetarian ? <Image source={dietIcons.vegetarian} style={styles.dietIcon} tintColor={dietTintColor.vegetarian}/> : null}
            {recipe.dairyFree ? <Image source={dietIcons.dairyFree} style={styles.dietIcon} tintColor={dietTintColor.dairyFree}/> : null}
            
          </View>

          <Text style={[styles.title, isListLayout && styles.listTitle]} numberOfLines={1}>
            {recipe.title}
          </Text>

          <View style={styles.dishTypeContainer}>
            <Text style={styles.dishType}>{recipe.dishTypes[0]}</Text>
          </View>

          <Text style={styles.readyInText}>
            <Clock size={14} color="#0d0d0d" style={{marginRight: 5}}/>
            {recipe.readyInMinutes} minutes
          </Text>

          <View style={styles.metaGridContainer}>
            {recipe.nutrition.nutrients
            .filter(nutrient =>
              ["Calories", "Protein", "Fat", "Carbohydrates"].includes(nutrient.name)
            )
            .map((nutrient, index) => (
              <View key={index} style={styles.metaGridItem}>
                {nutrient.name === "Calories" && (
                  <>
                    <Image source={images.calorie}  style={styles.imageStyle} tintColor={nutrientColors[nutrient.name]} />
                    <Text style={styles.metaText}>
                      {nutrient.amount.toFixed(0)} {nutrient.unit}
                    </Text>
                  </>
                )}
                {nutrient.name === "Protein" && (
                  <>
                    <Image source={images.protein}  style={styles.imageStyle} tintColor={nutrientColors[nutrient.name]}/>
                    <Text style={styles.metaText}>
                      {nutrient.amount.toFixed(0)} {nutrient.unit}
                    </Text>
                  </>
                )}
                {nutrient.name === "Fat" && (
                  <>
                    <Image source={images.lipids} style={styles.imageStyle} tintColor={nutrientColors[nutrient.name]}/>
                    <Text style={styles.metaText}>
                      {nutrient.amount.toFixed(0)} {nutrient.unit}
                    </Text>
                  </>
                )}
                {nutrient.name === "Carbohydrates" && (
                  <>
                    <Image source={images.carbs}  style={styles.imageStyle} tintColor={nutrientColors[nutrient.name]}/>
                    <Text style={styles.metaText}>
                      {nutrient.amount.toFixed(0)} {nutrient.unit}
                    </Text>
                  </>
                )}
              </View>
            ))}
          </View>

         
          

        </View>


      </View>

      <TouchableOpacity style={styles.bookmarkButton}>
        <Bookmark size={18} color="#309bae" />
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
    elevation: 0.1,
    position: "relative",
    borderWidth: 1,
    borderColor: "#cbc7b7"
  },
  gridContainer: {
    height: 300,
  },
  listContainer: {
    height: 150,
  },
  gridContent: {
    flex: 1,
  },
  listContent: {
    flex: 1,
    flexDirection: "row",
  },
  gridImage: {
    height: 140,
    width: "100%",
  },
  listImage: {
    width: 150,
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
    flexDirection: "row",

    paddingHorizontal: 2,
    paddingVertical: 2,
    
    alignSelf: "flex-start",

    marginBottom: 4,
  },
  category: {
    borderRadius: 4,
    fontSize: 10,
    backgroundColor: "#F0F0F0",
    color: "#222",
    fontWeight: "500",
    marginRight: 4,
  },
  dishTypeContainer: {
    flexDirection: "row",

    paddingHorizontal: 2,
    paddingVertical: 2,
    
    alignSelf: "flex-start",

  },
  dishType: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 10,
    backgroundColor: "#f3f3f5",
    color: "#232d14",
    fontWeight: "700",
    marginRight: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  listTitle: {
    fontSize: 16,
  },
  metaContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  metaRowContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginRight:4,
    marginBottom:4
  },
  metaGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginRight: 2,
    marginBottom: 2,
  },
  metaGridItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "50%", // ~50% minus margins/gaps
    aspectRatio: 1, // Makes it square
    marginBottom: 0, // space between rows
    backgroundColor: "", // just for visualization
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
    top: 6,
    right: 8,
    backgroundColor: "#FFF",
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 0,
  },
  imageStyle: {
    overflow: "hidden",
    width: 14,
    height: 14,
  },
  dietIcon: {
    width: 14,
    height: 14,
  },
  readyInText: {
    fontSize: 12,
    color: "#232d14",
    marginVertical: 4,
    
  },
})
