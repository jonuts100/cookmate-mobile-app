import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const IngredientCard = ({ ingredient, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.ingredientName}>{ingredient.name}</Text>
        <Text style={styles.ingredientQuantity}>
          {ingredient.quantity} {ingredient.unit}
        </Text>
        {ingredient.preparation && (
          <Text style={styles.ingredientPrep}>Prep: {ingredient.preparation}</Text>
        )}
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Ionicons name="close-circle-outline" size={22} color="#FF5252" />
      </TouchableOpacity>
    </View>
  )
}

export default IngredientCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  ingredientQuantity: {
    fontSize: 14,
    color: '#666666',
  },
  ingredientPrep: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 4,
  }
})