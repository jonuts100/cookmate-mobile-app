import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import HTML from 'react-native-render-html';
import Collapsible from 'react-native-collapsible';
import { UserDetailContext } from '@/context/UserDetailContext';

const RecipeDetailScreen = () => {
  const { recipe } = useContext(UserDetailContext);
 
  const [isSaved, setIsSaved] = useState(false);
  const [isNutritionExpanded, setIsNutritionExpanded] = useState(false);
  const { width } = useWindowDimensions();

  // Get main nutrients for display
  const calories = recipe.nutrition.nutrients.find(
    (nutrient) => nutrient.name === "Calories"
  );
  const protein = recipe.nutrition.nutrients.find(
    (nutrient) => nutrient.name === "Protein"
  );
  const fat = recipe.nutrition.nutrients.find(
    (nutrient) => nutrient.name === "Fat"
  );
  const carbs = recipe.nutrition.nutrients.find(
    (nutrient) => nutrient.name === "Carbohydrates"
  );

  // Get ingredients list from nutrition data
  const ingredients = recipe.nutrition.ingredients;

  // Get instructions
  const instructions = recipe.analyzedInstructions[0]?.steps || [];

  const Badge = ({ label }) => (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );

  const NutrientCard = ({ 
    label, 
    value, 
    unit 
  }) => (
    <View style={styles.nutrientCard}>
      <Text style={styles.nutrientLabel}>{label}</Text>
      <Text style={styles.nutrientValue}>{value}</Text>
      <Text style={styles.nutrientUnit}>{unit}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recipe Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: recipe.image || 'https://via.placeholder.com/600x400' }}
            style={styles.recipeImage}
            resizeMode="cover"
          />
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{recipe.title}</Text>
            
            <TouchableOpacity 
              style={[
                styles.saveButton, 
                isSaved && styles.savedButton
              ]} 
              onPress={() => setIsSaved(!isSaved)}
            >
              <Ionicons 
                name={isSaved ? "heart" : "heart-outline"} 
                size={18} 
                color={isSaved ? "white" : "#ff4081"} 
              />
              <Text style={[
                styles.saveButtonText, 
                isSaved && styles.savedButtonText
              ]}>
                {isSaved ? "Saved" : "Save Recipe"}
              </Text>
            </TouchableOpacity>

            <View style={styles.badgeContainer}>
              {recipe.vegetarian && <Badge label="Vegetarian" />}
              {recipe.vegan && <Badge label="Vegan" />}
              {recipe.glutenFree && <Badge label="Gluten-Free" />}
              {recipe.dairyFree && <Badge label="Dairy-Free" />}
              {recipe.veryHealthy && <Badge label="Very Healthy" />}
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.infoText}>{recipe.readyInMinutes} min</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="people-outline" size={16} color="#666" />
                <Text style={styles.infoText}>{recipe.servings} servings</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Health Score:</Text>
                <Text style={styles.infoText}>{recipe.healthScore}/100</Text>
              </View>
            </View>

            <HTML 
              source={{ html: recipe.summary }} 
              contentWidth={width - 40}
              baseStyle={styles.summary}
            />
          </View>
        </View>

        {/* Nutrition Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Nutrition Information</Text>
          <View style={styles.nutrientGrid}>
            <NutrientCard 
              label="Calories" 
              value={calories ? Math.round(calories.amount) : "N/A"} 
              unit={calories?.unit || ""} 
            />
            <NutrientCard 
              label="Protein" 
              value={protein ? Math.round(protein.amount) : "N/A"} 
              unit={protein?.unit || ""} 
            />
            <NutrientCard 
              label="Carbs" 
              value={carbs ? Math.round(carbs.amount) : "N/A"} 
              unit={carbs?.unit || ""} 
            />
            <NutrientCard 
              label="Fat" 
              value={fat ? Math.round(fat.amount) : "N/A"} 
              unit={fat?.unit || ""} 
            />
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Ingredients */}
          <View style={styles.ingredientsContainer}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {ingredients.map((ingredient) => (
              <View key={ingredient.id} style={styles.ingredientItem}>
                <Ionicons name="chevron-forward" size={18} color="#ff4081" />
                <Text style={styles.ingredientText}>
                  {ingredient.amount} {ingredient.unit} {ingredient.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {instructions.length > 0 ? (
              instructions.map((step) => (
                <View key={step.number} style={styles.instructionStep}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>{step.number}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepText}>{step.step}</Text>
                    
                    {(step.ingredients.length > 0 || step.equipment.length > 0) && (
                      <View style={styles.stepDetails}>
                        {step.ingredients.length > 0 && (
                          <Text style={styles.stepDetailsText}>
                            <Text style={styles.stepDetailsLabel}>Ingredients: </Text>
                            {step.ingredients.map(i => i.name).join(", ")}
                          </Text>
                        )}
                        
                        {step.equipment.length > 0 && (
                          <Text style={styles.stepDetailsText}>
                            <Text style={styles.stepDetailsLabel}>Equipment: </Text>
                            {step.equipment.map(e => e.name).join(", ")}
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noInstructionsText}>No instructions available.</Text>
            )}
          </View>
        </View>

        {/* Detailed Nutrition */}
        <View style={styles.detailedNutritionContainer}>
          <TouchableOpacity 
            style={styles.accordionHeader}
            onPress={() => setIsNutritionExpanded(!isNutritionExpanded)}
          >
            <Text style={styles.sectionTitle}>Detailed Nutrition Information</Text>
            <Ionicons 
              name={isNutritionExpanded ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#333" 
            />
          </TouchableOpacity>
          
          <Collapsible collapsed={!isNutritionExpanded}>
            <View style={styles.nutritionTable}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Nutrient</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>Amount</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>% Daily</Text>
              </View>
              
              {recipe.nutrition.nutrients.map((nutrient, index) => (
                <View 
                  key={nutrient.name} 
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                  ]}
                >
                  <Text style={[styles.tableCell, { flex: 2 }]}>{nutrient.name}</Text>
                  <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                    {Math.round(nutrient.amount * 10) / 10} {nutrient.unit}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                    {Math.round(nutrient.percentOfDailyNeeds)}%
                  </Text>
                </View>
              ))}
            </View>
          </Collapsible>
        </View>

        {/* Source Attribution */}
        <View style={styles.sourceContainer}>
          <Text style={styles.sourceText}>
            Recipe from{" "}
            <Text style={styles.sourceLink}>{recipe.sourceName}</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
  },
  recipeImage: {
    width: '100%',
    height: 250,
  },
  titleContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#ff4081',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  savedButton: {
    backgroundColor: '#ff4081',
    borderColor: '#ff4081',
  },
  saveButtonText: {
    color: '#ff4081',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  savedButtonText: {
    color: 'white',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#666',
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  summary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  nutrientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutrientCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  nutrientLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  nutrientValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  nutrientUnit: {
    fontSize: 10,
    color: '#666',
  },
  contentContainer: {
    flexDirection: 'column',
    padding: 16,
  },
  ingredientsContainer: {
    marginBottom: 24,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginLeft: 8,
  },
  instructionsContainer: {
    marginBottom: 24,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  stepNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ff4081',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  stepDetails: {
    marginTop: 8,
  },
  stepDetailsText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  stepDetailsLabel: {
    fontWeight: '500',
  },
  noInstructionsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  detailedNutritionContainer: {
    padding: 16,
    marginBottom: 16,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutritionTable: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tableRowEven: {
    backgroundColor: 'white',
  },
  tableRowOdd: {
    backgroundColor: '#fafafa',
  },
  tableCell: {
    fontSize: 13,
    color: '#333',
  },
  sourceContainer: {
    padding: 16,
    marginBottom: 24,
  },
  sourceText: {
    fontSize: 12,
    color: '#666',
  },
  sourceLink: {
    color: '#ff4081',
  },
});

export default RecipeDetailScreen;