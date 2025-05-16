
import { StyleSheet, Text, View, Alert, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from "expo-image-picker"
import { MaterialIcons, Ionicons } from '@expo/vector-icons'

const ImageChooser = () => {
        const [image, setImage] = useState(null);
        const [error, setError] = useState(null);
    
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
                    console.log(image)
                    setError(null)
                }
            }
        }
    
  return (
    <TouchableOpacity 
        style={[styles.button, styles.galleryButton]}
        onPress={pickImage}>
        <Ionicons name="images-outline" size={22} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Gallery</Text>
    </TouchableOpacity>
    
  )
}

export default ImageChooser
const styles = StyleSheet.create({
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
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
})