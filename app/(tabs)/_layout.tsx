import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { icons } from '@/constants/icons'

const TabIcon = ({focused, icon, title}: { focused: any, icon: any, title: any }) => {
    if(focused){
        return (
            <>
                <View
                    className="flex flex-col size-full mt-4 justify-center items-center rounded-lg bg-primary/80 px-2 py-2"
                >
                    <Image
                        source={icon}
                        className='size-5'
                        tintColor={"#cbc7b7"}
                    />
                </View>
            </>
        )
    }
    else{
        return (
            <>
            <View className='size-full justify-center items-center mt-4'>
                <Image
                    source={icon}
                    className="size-5"
                    tintColor={"#A8B5DB"}
                />
            </View>
            </>
        )
    }
}

const _layout = () => {
  return (
    <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            
            tabBarItemStyle: {
                width:'80%',
                height:'88%',
                justifyContent:'center',
                alignItems:'center',

            },
            tabBarStyle: {
                backgroundColor: '#0f0d23',
                borderRadius: 0,
                marginHorizontal:10,
                marginBottom: 34,
                height: 52,
                position: 'absolute',
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: '#0F0D23'
            }
        }}
    >
        <Tabs.Screen
        name="index"
        options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <TabIcon focused={focused} icon={icons.home} title="Home" />
            )
        }}

        />
        <Tabs.Screen 
        name="search"
        options={{
            title: 'Search',
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <TabIcon focused={focused} icon={icons.search} title="Search" />
            )
        }}
        />
        <Tabs.Screen 
        name="create"
        options={{
            title: 'Create',
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <TabIcon focused={focused} icon={icons.logo} title="Create" />
            )
        }}
        />
        <Tabs.Screen 
        name="saved"
        options={{
            title: 'Saved',
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <TabIcon focused={focused} icon={icons.save} title="Saved" />
            )
        }}
        />
        <Tabs.Screen 
        name="profile"
        options={{
            title: 'User',
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <TabIcon focused={focused} icon={icons.person} title="Profile" />
            )
        }}
        />
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})