import { StyleSheet, Text, View, Alert, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from "expo-image-picker"
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import 'react-native-url-polyfill/auto';
import { generateImageCaption } from "../services/gemini"
import { useRouter } from "expo-router"

const CreateRecipeScreen = () => {
    const router = useRouter();

    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [ingredients, setIngredients] = useState([]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(status !== "granted") {
            Alert.alert("Permission to access media library is required", `Sorry, we need camera 
                    roll permission to upload images.`);
            setError("Permission to access media library is required");
            return;
        }
        else{
            const result = await ImagePicker.launchImageLibraryAsync();
            if(!result.canceled){
                setImage(result.assets[0].uri)
                console.log(result.assets[0].uri)
                setError(null)
                
            }
        }
    }

    const takeImage = async () => {
        const { status} = await ImagePicker.requestCameraPermissionsAsync();
        if(status !== "granted") {
            Alert.alert("Permission to access camera is required", `Sorry, we need camera 
                    roll permission to upload images.`);
            setError("Permission to access camera is required");
            return;
        }
        else{
            const result = await ImagePicker.launchCameraAsync();
            if(!result.canceled){
                setImage(result.assets[0].uri)
                console.log(image)
                setError(null)
            }
        }
    }

    
    async function identifyIngredients() {
        console.log("Image URI being sent to Gemini:", image);
        
        const caption = await generateImageCaption(image);

        if (caption) {
            console.log("Generated Caption:", caption);
            const match = caption.match(/{[\s\S]*}/);

            if (!match) {
                throw new Error("No valid JSON object found in caption.");
            }

            const ing = match[0]
            const parsedIngredients = JSON.parse(ing)

            if (parsedIngredients.ingredients) {
                setIngredients(parsedIngredients.ingredients);
            } else {
                throw new Error("Parsed JSON does not contain 'ingredients'");
            }
        } else {
            console.log("Failed to generate caption."); // error message
        }
        
    }
    
    const seeIngredients = () => {
        console.log("See Ingredients", ingredients)
        // route to ingredients-page with ingreedinets as object
        // Convert to string and encode to pass safely
        const ingredientsParam = encodeURIComponent(JSON.stringify(ingredients));

        // Navigate to another screen and pass as query param
        router.push(`/screens/ingredients-page`, { data: ingredientsParam });
    }

    
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>What are we cooking with?</Text>
                <Text style={styles.subHeader}>Upload a photo of your </Text>
            </View>

            <View style={styles.imageSection}>
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
                        <MaterialIcons name="add-photo-alternate" size={60} color="#CCCCCC" />
                        <Text style={styles.placeholderText}>No image selected</Text>
                        {error && <Text style={styles.errorText}>{error}</Text>}
                    </View>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.button, styles.galleryButton]}
                    onPress={pickImage}>
                    <Ionicons name="images-outline" size={22} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, styles.cameraButton]}
                    onPress={takeImage}>
                    <Ionicons name="camera-outline" size={22} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Camera</Text>
                </TouchableOpacity>
            </View>
                <TouchableOpacity
                style={[styles.identifyButton]}
                onPress={identifyIngredients}
                >
                    <Ionicons name="pencil-outline" size={22} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>View Ingredients</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.identifyButton]}
                onPress={seeIngredients}
                >
                    <Ionicons name="pencil-outline" size={22} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>See Ingredients</Text>
                </TouchableOpacity>
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
        marginBottom: 24,
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
    imageSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    placeholderContainer: {
        width: '100%',
        height: 300,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#DDDDDD',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
    placeholderText: {
        marginTop: 16,
        fontSize: 16,
        color: '#999999',
    },
    imageContainer: {
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        width: '100%',
        height: 300,
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
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        flex: 0.48,
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
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderRadius: 12,
        marginTop: 10,
        elevation: 0.5,
        backgroundColor: "#FF5252",
        width: "100%",
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
        marginTop: 12,
        fontSize: 14,
    },
});