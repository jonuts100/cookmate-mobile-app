import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { HouseLine, MagnifyingGlass, BookBookmark, User } from 'phosphor-react-native';

// Screens
import HomeScreen from './index';
import SearchScreen from './search';
import SavedScreen from './saved';
import ProfileScreen from './profile';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#FF6B6B',
            tabBarInactiveTintColor: '#888',
            tabBarStyle: {
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
            headerShown: true,
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <HouseLine color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen 
            name="Search" 
            component={SearchScreen} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <MagnifyingGlass color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen 
            name="Saved" 
            component={SavedScreen} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <BookBookmark color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <User color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
    </SafeAreaProvider>
  );
}
