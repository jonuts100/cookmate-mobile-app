import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { useRouter } from 'expo-router'
import { UserDetailContext } from '@/context/UserDetailContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';


const Index = () => {
    const router = useRouter()
    const {user,  setUser } = useContext(UserDetailContext)
    onAuthStateChanged(auth, async () => {
        if(user){
            const res = await getDoc(doc(db, "users", user?.email));

            if(res.exists()){
                setUser(res.data())
            }
        }
    })

  return (
    <>
        <ImageBackground   
        source={require('@/assets/images/landingCover.jpg')}
        style={styles.background}
        resizeMode="contain"
        >
            
        </ImageBackground>
        <View 
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            height: "55%",
            zIndex: 1,
            backgroundColor: "#f8f9f0",
            borderRadius: 14,
            paddingHorizontal: 25,
            paddingVertical: 20,
        }}
        >
        <Text style={styles.titleText}>
            Turn your ingredients into delicious meals — powered by AI and inspired by real home cooks.
        </Text>
        <Text style={styles.headerText}>
            1. Snap your ingredients.
         </Text>
        <Text style={styles.headerText}>
            2. Find recipes from AI & community.
        </Text> 
        <Text style={styles.headerText}>
            3. Save your favorites.
        </Text>

        <TouchableOpacity
        style={{
                marginTop: 30,
                width: "100%",
                display: "flex",
                
            }}
        onPress={() => {
            router.push("/auth/sign-up")
        }}
        >
            <View style={{
                borderRadius: 8,
                borderWidth: 0.5,
                borderColor: "#cc3300",
                paddingVertical: 16,
                backgroundColor: "#cc3300"
                
            }}>
                <Text style={{color: "#f8f9f0", textAlign: "center", fontWeight: "bold", fontSize: 16}}>
                    Sign up
                </Text>
            </View>
        </TouchableOpacity>

        <TouchableOpacity
        style={{
                marginTop: 10,
                width: "100%",
                display: "flex",
                
            }}
        onPress={() => {
            router.push("/auth/sign-in")
        }}
        >
            <View style={{
                borderRadius: 8,
                borderWidth: 0.5,
                borderColor: "#666",
                paddingVertical: 16,
                
            }}>
                <Text style={{color: "#666", textAlign: "center", fontWeight: "bold", fontSize: 16}}>
                    Sign in
                </Text>
            </View>
        </TouchableOpacity>
        </View>

        
    </>
  )
}

export default Index

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#f8f9f0",
    width: "100%",
    position: "relative",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#666",
    textAlign: "left"
  },
  headerText: {
    fontSize: 16,
    fontWeight: "light",
    marginTop: 5,
    color: "#666",
    textAlign: "left"
  }
});