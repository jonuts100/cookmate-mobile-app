
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const ImageChooser = (pickImage) => {
        
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