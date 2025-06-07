import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { TouchableOpacity } from 'react-native'
import { BowlFood, PlusCircle } from 'phosphor-react-native'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useRouter } from 'expo-router'

const Header = () => {
    const router=useRouter();
    const { user } = useContext(UserDetailContext);
    return (
        <>
    
        <View style={{
            paddingHorizontal: 20,
            paddingTop: 50,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
        }}>
            <View style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 4
            }}>
                <Text style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "#333",
                }}>
                    Hello {user.name || "Chef"}!
                </Text>
                <Text style={{fontSize: 14, color: "#666"}}>
                    Welcome to Cookmate
                </Text>

            </View>
            <TouchableOpacity onPress={() => {router.push("/screens/create-recipe")}}>
                <PlusCircle size={32} color="#FF6B6B" />
            </TouchableOpacity>
        </View>
        </>
    )
}

export default Header
