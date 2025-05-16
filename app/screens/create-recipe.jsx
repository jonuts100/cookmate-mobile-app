import { StyleSheet, Text, View, Alert, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from "expo-image-picker"
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import 'react-native-url-polyfill/auto'
import { generateImageCaption } from "../services/gemini"
import { useRouter } from "expo-router"
import IngredientCard from '../components/ingredients-card'
import AddIngredientModal from '../components/create-recipe/AddIngredientModal'

const CreateRecipeScreen = () => {
    const router = useRouter()

    const [image, setImage] = useState(null)
    const [error, setError] = useState(null)
    const [ingredients, setIngredients] = useState([])
    const [modalVisible, setModalVisible] = useState(false)

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

    const handleSaveAndContinue = () => {
        if (ingredients.length === 0) {
            Alert.alert("No ingredients", "Please add at least one ingredient before continuing")
            return
        }
        
        // Navigate to user preferences page
        router.push("/user-preferences")
    }

    return (
        <View style={styles.container}>
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
                <View style={styles.ingredientsHeader}>
                    <Text style={styles.ingredientsTitle}>
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

            <TouchableOpacity
                style={[
                    styles.continueButton,
                    ingredients.length === 0 && styles.disabledButton
                ]}
                onPress={handleSaveAndContinue}
                disabled={ingredients.length === 0}
            >
                <Text style={styles.continueButtonText}>Save and Continue</Text>
                <Ionicons name="arrow-forward" size={22} color="#FFFFFF" style={styles.buttonIcon} />
            </TouchableOpacity>

            <AddIngredientModal 
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onAdd={handleAddIngredient}
            />
        </View>
    )
}

export default CreateRecipeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F9F9F9',
    },
    headerContainer: {
        marginBottom: 20,
        marginTop: 40,
    },
    header: {
        fontSize: 28,
        fontWeight: "700",
        color: '#333333',
        marginBottom: 8,
    },
    subHeader: {
        fontSize: 16,
        color: '#666666',
    },
    imageControlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        height: 100,
    },
    placeholderContainer: {
        width: '30%',
        height: '100%',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#DDDDDD',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
    placeholderText: {
        marginTop: 8,
        fontSize: 12,
        color: '#999999',
    },
    imageContainer: {
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        width: '30%',
        height: '100%',
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    removeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlButton: {
        width: "30%",
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    galleryButton: {
        backgroundColor: "#5E72E4",
    },
    cameraButton: {
        backgroundColor: "#11CDEF",
    },
    identifyButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        backgroundColor: "#FF5252",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    errorText: {
        color: "#FF5252",
        marginBottom: 12,
        fontSize: 14,
        textAlign: 'center',
    },
    ingredientsContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    ingredientsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    ingredientsTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: '#333333',
    },
    addIngredientButton: {
        backgroundColor: '#5E72E4',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ingredientsList: {
        flex: 1,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyStateText: {
        marginTop: 12,
        fontSize: 16,
        color: '#999999',
        textAlign: 'center',
    },
    continueButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#5E72E4",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    disabledButton: {
        backgroundColor: "#CCCCCC",
    },
    continueButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        marginRight: 8,
    },
});