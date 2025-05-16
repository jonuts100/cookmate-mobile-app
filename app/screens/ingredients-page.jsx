import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';

const IngredientsPage = () => {
    const params = useSearchParams();
    const data = params.data

    let ingredients = [];

    try {
      ingredients = JSON.parse(decodeURIComponent(data));
    } catch (e) {
      console.error("Failed to parse ingredients:", e);
    }

   return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Ingredients List</Text>
      {ingredients.map((item, index) => (
        <View key={index} style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 16 }}>
            • {item.name} — {item.quantity} {item.unit}
          </Text>
          {item.preparation && <Text>Prep: {item.preparation}</Text>}
          {item.location && <Text>Location: {item.location}</Text>}
        </View>
      ))}
    </ScrollView>
  );
}

export default IngredientsPage

const styles = StyleSheet.create({})