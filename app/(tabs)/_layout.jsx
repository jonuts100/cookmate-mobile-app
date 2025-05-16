import React from 'react';
import { HouseLine, MagnifyingGlass, BookBookmark, User } from 'phosphor-react-native';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
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
          <Tabs.Screen 
            name="home" 
            options={{
              tabBarIcon: ({ color, size }) => (
                <HouseLine color={color} size={size} />
              ),
              unmountOnBlur: true, 
            }}
            
          />
          <Tabs.Screen 
            name="search" 
            options={{
              tabBarIcon: ({ color, size }) => (
                <MagnifyingGlass color={color} size={size} />
              ),
              unmountOnBlur: true, 
            }}
          />
          <Tabs.Screen 
            name="saved" 
            options={{
              tabBarIcon: ({ color, size }) => (
                <BookBookmark color={color} size={size} />
              ),
              unmountOnBlur: true, 
            }}
          />
          <Tabs.Screen 
            name="profile" 
            options={{
              tabBarIcon: ({ color, size }) => (
                <User color={color} size={size} />
              ),
              unmountOnBlur: true, 
            }}
          />
        </Tabs>
  );
}
