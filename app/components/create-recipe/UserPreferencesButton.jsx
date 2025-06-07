import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const UserPreferencesButton = (options, setOptions, toggleItem, availableOptions) => {
  return (
    <View style={styles.userSectionContainer}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
                Cuisine {options.length > 0 ? `(${options.length})` : ''}
            </Text>
        </View>
        <View style={styles.optionContainer}>
        {availableOptions.map((option, index) => {
            const isSelected = options.includes(option);

            return (
                <Pressable
                    key={index}
                    style={[
                        styles.optionButton,
                        isSelected && styles.optionButtonSelected, // Apply selected style if chosen
                    ]}
                    onPress={() => toggleItem(option, options, setOptions)}
                >
                    <Text
                        style={[
                            styles.optionButtonText,
                            isSelected && styles.optionButtonTextSelected,
                        ]}
                    >
                        {option}
                    </Text>
                </Pressable>
            );
        })}
        </View>
    </View>
  )
}

export default UserPreferencesButton

const styles = StyleSheet.create({
    
    userSectionContainer: {
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
    optionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gapHorizontal: 8,
    },
    optionButton: {
        padding: 6,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        margin: 5,
        backgroundColor: '#fff',
    },

    optionButtonSelected: {
        backgroundColor: '#000', // Green for selected
        borderColor: '#000',
    },

    optionButtonText: {
        color: '#000',
    },

    optionButtonTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
})