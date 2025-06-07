import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View, Dimensions } from 'react-native';
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
                <ActivityIndicator size="large" color="#007AFF" />
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
            <Text style={styles.header}>All Recipes</Text>
            <FlatList
                data={allRecipes}
                keyExtractor={item => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                // Add padding to the container of the list itself
                contentContainerStyle={styles.listContentContainer}
                renderItem={({ item }) => (
                    <Pressable style={styles.recipeItem} onPress={() => goToRecipePage(item)}>
                        <Text style={styles.recipeTitle} numberOfLines={2}>{item.title}</Text>
                        {/* Render cuisines as tags */}
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
                        
                        {/* Show nutrition information if available */}
                        {item.nutrition && item.nutrition.nutrients && (
                            // container of 2x2
                                
                            <View style={{ 
                                display: 'flex', flexDirection: 'row', gap: 10, marginVertical: 10, flexWrap: 'wrap',
                                justifyContent: 'space-between', alignItems: 'center', maxWidth: '100%', maxHeight: 300,
                                 padding: 10, backgroundColor: '#f8f9fa', borderRadius: 10,
                            }}>
                                {item.nutrition.nutrients.slice(0,4).map((nutrient, index) => (
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
        display: 'flex',
        flex: 0.8,
        backgroundColor: '#F8F9FA', // A light background color for the whole screen
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#6c757d',
    },
    errorText: {
        color: '#dc3545',
        textAlign: 'center',
        fontSize: 16,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 16, // Align header with list container padding
    },
    listContentContainer: {
        paddingHorizontal: 8,
        paddingVertical: 10, // Adds some vertical space for the cards' shadow
    },
    recipeItem: {
        backgroundColor: '#fff',
        borderRadius: 16, // More rounded corners
        padding: 16,
        // Set the width of the card dynamically
        width: cardWidth,
        // Add horizontal margin for spacing between cards (8+8 = 16px gap)
        marginHorizontal: 8,
        // Nice shadow for iOS
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        // Shadow for Android
        elevation: 5,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#212529',
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 'auto', // Pushes the tags to the bottom of the card
    },
    badgeTag: {
        backgroundColor: '#e9ecef',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 4,
        marginTop: 4,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#495057',
    }
});
