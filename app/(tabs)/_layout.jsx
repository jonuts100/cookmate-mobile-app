import React from 'react';
import { HouseLine, MagnifyingGlass, BookBookmark, User } from 'phosphor-react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#FF6B6B',
            tabBarInactiveTintColor: '#888',
            tabBarStyle: {
              paddingBottom: insets.bottom + 10,
              paddingTop: 5,
              height: 60 + insets.bottom,
            }
          }}
          
        >
          <Tabs.Screen 
          
            name="home" 
            options={{
              tabBarIcon: ({ color, size }) => (
                <HouseLine color={color} size={20} />
              ),
              unmountOnBlur: true, 
              headerShown: false,
            }}
            
            
          />
          <Tabs.Screen 
         
            name="search" 
            options={{
              tabBarIcon: ({ color, size }) => (
                <MagnifyingGlass color={color} size={20} />
              ),
              unmountOnBlur: true, 
              headerShown: false,
            }}
          />
          <Tabs.Screen 
            name="saved" 
            options={{
              tabBarIcon: ({ color, size }) => (
                <BookBookmark color={color} size={20} />
              ),
              unmountOnBlur: true, 
              headerShown: false,
            }}
          />
          <Tabs.Screen 
            name="profile" 
            options={{
              tabBarIcon: ({ color, size }) => (
                <User color={color} size={20} />
              ),
              unmountOnBlur: true, 
              headerShown: false,
            }}

          />
        </Tabs>
  );
}
