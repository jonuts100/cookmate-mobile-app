import { StyleSheet, Text, View, Alert, TouchableOpacity, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import React, { useContext, useState } from 'react'
import * as ImagePicker from "expo-image-picker"
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import 'react-native-url-polyfill/auto'
import { generateImageCaption } from "../services/gemini"
import { cuisineOptions , dishTypeOptions, intoleranceOptions, dietOptions } from "../../constants/data"
import { useRouter } from "expo-router"
import IngredientCard from '../components/ingredients-card'
import AddIngredientModal from '../components/create-recipe/AddIngredientModal'
import Slider from '@react-native-community/slider';
import { generateRecipeFromGemini, RecipePromptInput } from '../services/gemini'
import { UserDetailContext } from '../../context/UserDetailContext'
import { setDoc, doc, addDoc, collection } from "firebase/firestore"
import { db } from "../../config/firebaseConfig"
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'


const CreateRecipeScreen = () => {
    const router = useRouter()

    const [isLoading, setLoading] = useState(false)

    const { user } = useContext(UserDetailContext);

    const [image, setImage] = useState(null)
    const [error, setError] = useState(null)

    // ingredients
    const [ingredients, setIngredients] = useState([])
    const [modalVisible, setModalVisible] = useState(false)

    // intolerances
    const [intolerances, setIntolerances] = useState([])
    // cuisines
    const [cuisines, setCuisines] = useState([])
    // diets
    const [diets, setDiets] = useState([])
    // dish type
    const [dishType, setDishType] = useState([])
    // equipment
    const [equipmentLevel, setEquipmentLevel] = useState("Basic")
    // protein level
    const nutrient_points = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    const [minimumProtein, setMinimumProtein] = useState(0)
    // fat level
    const [minimumFat, setMinimumFat] = useState(0)
    // carbs level
    const [minimumCarbs, setMinimumCarbs] = useState(0)
    // servings 
    const SERVINGS_POINTS = [1,2,3,4,5,6,7,8,9,10]
    const [servings, setServings] = useState(1)
    // serving time
    const SERVINGTIME_POINTS = [15,30,45,60]
    const [servingTime, setServingTime] = useState(30)

    const generateRecipe = async () => {
        setLoading(true)
        const userInput = {
            ingredients,
            intolerances,
            cuisines,
            diets,
            dishType,
            servings,
            cookingTime: servingTime,
            minCarbs: minimumCarbs,
            minFats: minimumFat,
            minProteins: minimumProtein,
            equipmentLevel
        }

        try {
            const RESULT = await generateRecipeFromGemini(userInput);
            const match = RESULT.match(/{[\s\S]*}/)

            if (!match) {
                throw new Error("No valid JSON object found in caption.")
            }
            console.log("Raw Recipe Result:", RESULT)
            // Extract the first match which should be the JSON object
            console.log("Matched JSON:", match[0])
            const rp = match[0]
            const parsedRecipes = JSON.parse(rp)

            const recipe = parsedRecipes.recipe
            console.log("Parsed Recipe:", recipe)
            if (recipe) {
                console.log("Generated Recipe:", recipe);
                console.log("User:", user?.email);
                await addDoc(collection(db, "recipes"), {
                    ...recipe,
                    createdOn: Date.now(),
                    createdBy: user?.email
                })
                
                setLoading(false)
                router.push("/(tabs)/home")
            } else {
                setLoading(false)
                throw new Error("Parsed JSON does not contain 'ingredients'")
                
            }
            setLoading(false)
            router.push("/(tabs)/home")
            
        } catch (error) {
            setLoading(false)
            console.error("Failed to generate recipes:", error);
        }
        
    }
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if(status !== "granted") {
            Alert.alert("Permission to access media library is required", 
                "Sorry, we need camera roll permission to upload images.")
            setError("Permission to access media library is required")
            return
        }
        else{
            const result = await ImagePicker.launchImageLibraryAsync()
            if(!result.canceled){
                setImage(result.assets[0].uri)
                setError(null)
            }
        }
    }

    const takeImage = async () => {
        const { status} = await ImagePicker.requestCameraPermissionsAsync()
        if(status !== "granted") {
            Alert.alert("Permission to access camera is required", 
                "Sorry, we need camera permission to take photos.")
            setError("Permission to access camera is required")
            return
        }
        else{
            const result = await ImagePicker.launchCameraAsync()
            if(!result.canceled){
                setImage(result.assets[0].uri)
                setError(null)
            }
        }
    }

    async function identifyIngredients() {
        if (!image) {
            Alert.alert("No image selected", "Please select or take a photo first")
            return
        }
        
        try {
            console.log("Image URI being sent to Gemini:", image)
            
            const caption = await generateImageCaption(image)

            if (caption) {
                console.log("Generated Caption:", caption)
                const match = caption.match(/{[\s\S]*}/)

                if (!match) {
                    throw new Error("No valid JSON object found in caption.")
                }

                const ing = match[0]
                const parsedIngredients = JSON.parse(ing)

                if (parsedIngredients.ingredients) {
                    setIngredients(parsedIngredients.ingredients)
                } else {
                    throw new Error("Parsed JSON does not contain 'ingredients'")
                }
            } else {
                throw new Error("Failed to generate caption")
            }
        } catch (err) {
            Alert.alert("Error", err.message || "Failed to identify ingredients")
            console.error(err)
        }
    }

    const handleAddIngredient = (newIngredient) => {
        setIngredients([...ingredients, newIngredient])
    }

    const handleDeleteIngredient = (index) => {
        const updatedIngredients = [...ingredients]
        updatedIngredients.splice(index, 1)
        setIngredients(updatedIngredients)
    }

    const toggleItem = (item, list, setList) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const toggleEquipmentLevel = (level) => {
        setEquipmentLevel(level);
    }

    const insets = useSafeAreaInsets();

    return (
        
        <ScrollView 
            style={styles.container}
            contentContainerStyle={{
                paddingBottom: insets.bottom + 20, 
                paddingTop: insets.top + 20, 
            }}
        >
            <View style={styles.headerContainer}>
                <Text style={styles.header}>What are we cooking with?</Text>
                <Text style={styles.subHeader}>Upload a photo of your ingredients</Text>
            </View>

            <View style={styles.imageControlsRow}>
                {image ? (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: image }} style={styles.image} />
                        <TouchableOpacity 
                            style={styles.removeButton}
                            onPress={() => setImage(null)}>
                            <MaterialIcons name="close" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.placeholderContainer}>
                        <MaterialIcons name="add-photo-alternate" size={36} color="#CCCCCC" />
                        <Text style={styles.placeholderText}>No image</Text>
                    </View>
                )}
                
                <TouchableOpacity 
                    style={[styles.controlButton, styles.galleryButton]}
                    onPress={pickImage}>
                    <Ionicons name="images-outline" size={22} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Gallery</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.controlButton, styles.cameraButton]}
                    onPress={takeImage}>
                    <Ionicons name="camera-outline" size={22} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Camera</Text>
                </TouchableOpacity>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
                style={styles.identifyButton}
                onPress={identifyIngredients}
            >
                <Ionicons name="eye-outline" size={22} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>View Ingredients</Text>
            </TouchableOpacity>

            <View style={styles.ingredientsContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Ingredients {ingredients.length > 0 ? `(${ingredients.length})` : ''}
                    </Text>
                    <TouchableOpacity 
                        style={styles.addIngredientButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons name="add" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {ingredients.length > 0 ? (
                    <ScrollView style={styles.ingredientsList}>
                        {ingredients.map((item, index) => (
                            <IngredientCard 
                                key={index} 
                                ingredient={item} 
                                onDelete={() => handleDeleteIngredient(index)}
                            />
                        ))}
                    </ScrollView>
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="nutrition-outline" size={40} color="#CCCCCC" />
                        <Text style={styles.emptyStateText}>
                            No ingredients yet. Take a photo or add them manually.
                        </Text>
                    </View>
                )}
            </View>

            {/* User Preferences Section */}
            <View style={styles.userSectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Cuisine {cuisines.length > 0 ? `(${cuisines.length})` : ''}
                    </Text>
                </View>
                <View style={styles.optionContainer}>
                {cuisineOptions.map((cuisine, index) => {
                    const isSelected = cuisines.includes(cuisine);

                    return (
                        <Pressable
                            key={index}
                            style={[
                                styles.optionButton,
                                isSelected && styles.optionButtonSelected, // Apply selected style if chosen
                            ]}
                            onPress={() => toggleItem(cuisine, cuisines, setCuisines)}
                        >
                            <Text
                                style={[
                                    styles.optionButtonText,
                                    isSelected && styles.optionButtonTextSelected,
                                ]}
                            >
                                {cuisine}
                            </Text>
                        </Pressable>
                    );
                })}
                </View>
            </View>

            <View style={styles.userSectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Diet {diets.length > 0 ? `(${diets.length})` : ''}
                    </Text>
                </View>
                
                <View style={styles.optionContainer}>

                {dietOptions.map((diet, index) => {
                    const isSelected = diets.includes(diet);

                    return (
                        
                        <Pressable
                            key={index}
                            style={[
                                styles.optionButton,
                                isSelected && styles.optionButtonSelected, // Apply selected style if chosen
                            ]}
                            onPress={() => toggleItem(diet, diets, setDiets)}
                        >
                            <Text
                                style={[
                                    styles.optionButtonText,
                                    isSelected && styles.optionButtonTextSelected,
                                ]}
                            >
                                {diet}
                            </Text>
                        </Pressable>
                    );
                })}
                </View>
            </View>

            <View style={styles.userSectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Intolerances {intolerances.length > 0 ? `(${intolerances.length})` : ''}
                    </Text>
                </View>
                <View style={styles.optionContainer}>
                {intoleranceOptions.map((intol, index) => {
                    const isSelected = intolerances.includes(intol);

                    return (
                        <Pressable
                            key={index}
                            style={[
                                styles.optionButton,
                                isSelected && styles.optionButtonSelected, // Apply selected style if chosen
                            ]}
                            onPress={() => toggleItem(intol, intolerances, setIntolerances)}
                        >
                            <Text
                                style={[
                                    styles.optionButtonText,
                                    isSelected && styles.optionButtonTextSelected,
                                ]}
                            >
                                {intol}
                            </Text>
                        </Pressable>
                    );
                })}
                </View>
            </View>
            
            <View style={styles.userSectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Dish Type {dishType.length > 0 ? `(${dishType.length})` : ''}
                    </Text>
                </View>
                <View style={styles.optionContainer}>
                {dishTypeOptions.map((dt, index) => {
                    const isSelected = dishType.includes(dt);

                    return (
                        <Pressable
                            key={index}
                            style={[
                                styles.optionButton,
                                isSelected && styles.optionButtonSelected, // Apply selected style if chosen
                            ]}
                            onPress={() => toggleItem(dt, dishType, setDishType)}
                        >
                            <Text
                                style={[
                                    styles.optionButtonText,
                                    isSelected && styles.optionButtonTextSelected,
                                ]}
                            >
                                {dt}
                            </Text>
                        </Pressable>
                    );
                })}
                </View>
            </View>

            <View style={styles.userSectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Equipment Level
                    </Text>
                </View>
                <View style={styles.optionContainer}>
                    {["Basic", "Intermediate", "Advanced"].map((level, index) => {
                        const isSelected = level === equipmentLevel;
                        return (

                        
                        <Pressable
                            key={index}
                            style={[
                                styles.optionButton,
                                isSelected && styles.optionButtonSelected, // Apply selected style if chosen
                            ]}
                            onPress={() => toggleEquipmentLevel(level)}
                        >
                            <Text
                                style={[
                                    styles.optionButtonText,
                                    isSelected && styles.optionButtonTextSelected,
                                ]}
                            >
                                {level}
                            </Text>
                        </Pressable>
                        )
                    })}
                    
                </View>
            </View>

            {/* Sliders */}
             <View style={styles.userSectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Nutrients
                    </Text>
                </View>

                <View style={styles.sliderContainer}>
                    <Text>Minimum Carbohydrates</Text>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={0}
                        maximumValue={100}
                        step={10} // Snap to checkpoints
                        value={minimumCarbs}
                        onValueChange={setMinimumCarbs}
                        minimumTrackTintColor="#1fb28a"
                        maximumTrackTintColor="#d3d3d3"
                        thumbTintColor="#1a9274"
                    />

                </View>

                <View style={styles.sliderContainer}>
                    <Text>Minimum Protein</Text>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={0}
                        maximumValue={100}
                        step={10} // Snap to checkpoints
                        value={minimumProtein}
                        onValueChange={setMinimumProtein}
                        minimumTrackTintColor="#1fb28a"
                        maximumTrackTintColor="#d3d3d3"
                        thumbTintColor="#1a9274"
                    />

                </View>

                <View style={styles.sliderContainer}>
                    <Text>Minimum Fats</Text>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={0}
                        maximumValue={100}
                        step={10} // Snap to checkpoints
                        value={minimumFat}
                        onValueChange={setMinimumFat}
                        minimumTrackTintColor="#1fb28a"
                        maximumTrackTintColor="#d3d3d3"
                        thumbTintColor="#1a9274"
                    />

                </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: 10,
                    width: "95%",
                }}>
                    {nutrient_points.map((point, index) => (
                    <View key={index} style={{
                        flexDirection: "column",
                        alignItems: "center",
                        
                    }}>
                        <View style={{
                            width: 2,
                            height: 8,
                            borderRadius: 0,
                            backgroundColor: '#555',
                            marginBottom: 2,
                        }} />
                        <Text>{point}</Text>
                    </View>
                    ))}
                </View>
            </View>
            
            <View style={styles.userSectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Servings & Time
                    </Text>
                </View>

                <View style={styles.sliderContainer}>
                    <Text>Servings</Text>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={1}
                        maximumValue={10}
                        step={1} // Snap to checkpoints
                        value={servings}
                        onValueChange={setServings}
                        minimumTrackTintColor="#1fb28a"
                        maximumTrackTintColor="#d3d3d3"
                        thumbTintColor="#1a9274"
                    />

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginLeft: 10,
                        width: "95%",
                    }}>
                        {SERVINGS_POINTS.map((point, index) => (
                        <View key={index} style={{
                            flexDirection: "column",
                            alignItems: "center",
                            
                        }}>
                            <View style={{
                                width: 2,
                                height: 8,
                                borderRadius: 0,
                                backgroundColor: '#555',
                                marginBottom: 2,
                            }} />
                            <Text>{point}</Text>
                        </View>
                        ))}
                    </View>

                </View>

                <View style={styles.sliderContainer}>
                    <Text>Cooking Time</Text>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={15}
                        maximumValue={60}
                        step={15} // Snap to checkpoints
                        value={servingTime}
                        onValueChange={setServingTime}
                        minimumTrackTintColor="#1fb28a"
                        maximumTrackTintColor="#d3d3d3"
                        thumbTintColor="#1a9274"
                    />

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginLeft: 10,
                        width: "95%",
                    }}>
                        {SERVINGTIME_POINTS.map((point, index) => (
                        <View key={index} style={{
                            flexDirection: "column",
                            alignItems: "center",
                            
                        }}>
                            <View style={{
                                width: 2,
                                height: 8,
                                borderRadius: 0,
                                backgroundColor: '#555',
                                marginBottom: 2,
                            }} />
                            <Text>{point}</Text>
                        </View>
                        ))}
                    </View>

                </View>
            </View>
            {/* Generate Recipe */}

            <TouchableOpacity
                style={[
                    styles.continueButton,
                    ingredients.length === 0 && styles.disabledButton
                ]}
                onPress={generateRecipe}
                disabled={ingredients.length === 0}
            >
                {isLoading ? 
                <ActivityIndicator size="small" color="#FFFFFF" /> : 
                <View>
                    <Text style={styles.continueButtonText}>Generate Recipes</Text>
                </View>
                }
                
            </TouchableOpacity>

            <AddIngredientModal 
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onAdd={handleAddIngredient}
            />
        </ScrollView>
        
    )
}

export default CreateRecipeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F8F9FA', // Lighter background color
    },
    headerContainer: {
        marginBottom: 24,
        marginTop: 40,
    },
    header: {
        fontSize: 32, // Larger font size for emphasis
        fontWeight: 'bold', // Bolder for better hierarchy
        color: '#212529', // Darker text color
        marginBottom: 8,
    },
    subHeader: {
        fontSize: 18, // Slightly larger for readability
        color: '#6C757D', // Softer color for secondary text
    },
    imageControlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        height: 120, // Increased height for a better look
    },
    placeholderContainer: {
        width: '32%', // Adjusted width
        height: '100%',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E9ECEF', // Softer border color
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    placeholderText: {
        marginTop: 8,
        fontSize: 14,
        color: '#ADB5BD',
    },
    imageContainer: {
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        width: '32%', // Adjusted width
        height: '100%',
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    removeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlButton: {
        width: "32%", // Adjusted width
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    galleryButton: {
        backgroundColor: "#6A82FB", // New color
    },
    cameraButton: {
        backgroundColor: "#17A2B8", // New color
    },
    identifyButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
        borderRadius: 16,
        marginBottom: 24,
        backgroundColor: "#FF6B6B", // New color
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonIcon: {
        marginRight: 10,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold", // Bolder text
    },
    errorText: {
        color: "#D9534F", // More standard error color
        marginBottom: 16,
        fontSize: 14,
        textAlign: 'center',
    },
    ingredientsContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20, // More rounded corners
        padding: 20,
        marginBottom: 24,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: '#343A40',
    },
    addIngredientButton: {
        backgroundColor: '#6A82FB',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ingredientsList: {
        flex: 1,
    },
    userSectionContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 3,
    },
    optionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12, // More consistent gap
    },
    optionButton: {
        paddingVertical: 10, // More vertical padding
        paddingHorizontal: 16, // More horizontal padding
        borderWidth: 1,
        borderColor: '#CED4DA',
        borderRadius: 20, // More rounded
        backgroundColor: '#FFFFFF',
    },
    optionButtonSelected: {
        backgroundColor: '#343A40',
        borderColor: '#343A40',
    },
    optionButtonText: {
        color: '#495057',
        fontWeight: '500', // Medium weight for better readability
    },
    optionButtonTextSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    sliderContainer: {
        marginBottom: 16,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        marginTop: 16,
        fontSize: 16,
        color: '#ADB5BD',
        textAlign: 'center',
        lineHeight: 24, // Improved line height
    },
    continueButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
        borderRadius: 16,
        backgroundColor: "#28A745", // Success color
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20, // Add some bottom margin
    },
    disabledButton: {
        backgroundColor: "#CED4DA",
    },
    continueButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
});