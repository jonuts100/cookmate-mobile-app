import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const GenerateButton = (ingredients, generateRecipe) => {
  return (
    <TouchableOpacity
        style={[
            styles.continueButton,
            ingredients.length === 0 && styles.disabledButton
        ]}
        onPress={generateRecipe}
        disabled={ingredients.length === 0}
    >
        <Text style={styles.continueButtonText}>Save and Continue</Text>
        <Ionicons name="arrow-forward" size={22} color="#FFFFFF" style={styles.buttonIcon} />
    </TouchableOpacity>
  )
}

export default GenerateButton

const styles = StyleSheet.create({
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
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    }
})