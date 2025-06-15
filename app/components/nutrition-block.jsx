import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CircularProgress from 'react-native-circular-progress-indicator';

// name amount unit percentageDailyNeeded
// for simplicity, we will show only calories, protein, fat and carbs

// for each block, make it take up 45-50% of the width
//    shadowOpacity: 0.25, borderRadius: 12,
//    inside the block, center the text vertically and horizontally
//    show the name, amount, unit and a circular progress bar showing the percentage of daily needed
const NutritionInfoBlock = ({name, amount, unit, percentage}) => {
    return (
        <View style={{
            width: '50%',
            maxHeight: 100,
            display: 'flex',
            padding: 10,
            backgroundColor: '#f2ede3',
            borderRadius: 4,
            shadowColor: '#666',
            shadowOffset: { width: 0, height: 2 },
            elevation: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            gap: 3,
        }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 3 }}>{name === "Carbohydrates" ? 'Carbs' : name}</Text>
            <Text style={{ fontSize: 10, color: '#666' }}>{amount} {unit}</Text>
            <CircularProgress
                value={percentage}
                valueSuffix='%'
                maxValue={100}
                radius={20}
                activeStrokeColor="#cc3300"
                inActiveStrokeColor="#e0aeae"
                inActiveStrokeOpacity={0.3}
                progressValueStyle={{ color: '#333', fontSize: 11 }}
                showProgressValue={true}
                duration={800}
            />
        </View>
    )
    
}

export default NutritionInfoBlock

const styles = StyleSheet.create({})