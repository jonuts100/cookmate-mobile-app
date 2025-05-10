import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const TabIcon = ({focused, icon, title}: { focused: any, icon: any, title: any }) => {
    if(focused){
        return (
            <>
                <View
                    className="flex flex-col w-50 h-16 mt-4 justify-center items-center rounded-lg "
                >
                    <Image
                        source={icon}
                        className='size-5'
                        tintColor={"#151312"}
                    />
                </View>
            </>
        )
    }
    else{
        return (
            <>
            </>
        )
    }
}

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen
        name="index"
        options={{
            title: 'Home',
            headerShown: false,

        }}
        >

        </Tabs.Screen>
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})