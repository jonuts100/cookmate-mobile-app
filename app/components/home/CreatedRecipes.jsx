import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '@/config/firebaseConfig';
import { UserDetailContext } from "@/context/UserDetailContext";
import {  useRouter } from 'expo-router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import NutritionInfoBlock from '@/app/components/nutrition-block';

const CreatedRecipes = () => {
    const [allRecipes, setAllRecipes] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setRecipe } = useContext(UserDetailContext);
    const router = useRouter();
    const fetchAllRecipes = async () => {
        setLoading(true);
        try {
            
                
            const collectionRef = collection(db, 'recipes');
            const q = query(collectionRef, orderBy("createdOn", "desc"));
            const recipesData = await getDocs(q);
            
            const fetchedRecipes = recipesData.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAllRecipes(fetchedRecipes);
            
        } catch (err) {
            console.error("Error fetching recipes: ", err);
            setError("Failed to load recipes. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchAllRecipes();
    }, []);

    const goToRecipePage = (recipe) => {
        // This function now correctly receives the recipe object
        if (setRecipe) {
            setRecipe(recipe);
        }
        router.push("/recipes/detail");
    };

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#FF6B6B" />
                <Text style={styles.loadingText}>Loading Recipes...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Generated Recipes</Text>
            {allRecipes.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.emptyMessage}>
                        You have not generated any recipes yet.
                    </Text>
                    <TouchableOpacity
                        style={styles.generateButton}
                        onPress={() => router.push('/screens/create-recipe')}
                    >
                        <Text style={styles.generateButtonText}>
                            Ask AI for recipes
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={allRecipes}
                    keyExtractor={item => item.id.toString()}
                    horizontal={true}
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

export default CreatedRecipes;

// Get the width of the screen
const { width: screenWidth } = Dimensions.get('window');
// Set the width of the card to be 75% of the screen width
const cardWidth = screenWidth * 0.75;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fdfdfd',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyMessage: {
        fontSize: 18,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 24,
    },
    generateButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
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
        paddingVertical: 10,
    },
    recipeItem: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        width: cardWidth,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 6,
    },
    recipeTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 12,
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 15,
    },
    badgeTag: {
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#555',
    },
    nutritionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 15,
    }
});