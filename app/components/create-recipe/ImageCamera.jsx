
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const ImageCamera = (takeImage) => {
    
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