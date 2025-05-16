
import { StyleSheet, Text, View, Alert, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from "expo-image-picker"
import { MaterialIcons, Ionicons } from '@expo/vector-icons'

const ImageCamera = () => {
        const [image, setImage] = useState(null);
        const [error, setError] = useState(null);

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
    
  return (
    <TouchableOpacity 
        style={[styles.button, styles.cameraButton]}
        onPress={takeImage}>
        <Ionicons name="camera-outline" size={22} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Camera</Text>
    </TouchableOpacity>
    
  )
}

export default ImageCamera
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
    
    cameraButton: {
        backgroundColor: "#11CDEF",
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