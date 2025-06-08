"use client"

import { useState } from "react"
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ToastAndroid,
} from "react-native"
import { Feather, MaterialIcons } from "@expo/vector-icons"
import AntDesign from '@expo/vector-icons/AntDesign';
import { createUserWithEmailAndPassword} from "firebase/auth"
import { auth, db } from "@/config/firebaseConfig"
import { doc, setDoc } from "firebase/firestore"
import { useContext } from "react"
import { UserDetailContext } from "@/context/UserDetailContext"
import { useRouter } from "expo-router"
import * as ImagePicker from "expo-image-picker"
import { Alert } from "react-native"
import { Image } from "react-native"


const SignUpPage = () => {
  const [fullName, setFullName] = useState("")
  const [image, setImage] = useState(null)
  const [error, setError] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true)
  const [termsAccepted, setTermsAccepted] = useState(false)
  
  const [nameFocused, setNameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false)

  
  const router = useRouter();
  const {setUser} = useContext(UserDetailContext)

  const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if(status !== "granted") {
            Alert.alert("Permission to access media library is required", 
                "Sorry, we need camera roll permission to upload images.")
            setError("Permission to access media library is required")
            return
        }
        else{
            const result = await ImagePicker.launchImageLibraryAsync()
            console.log(result)
            if(!result.canceled){
                console.log(result)
                setImage(result.assets[0].uri)
                setError(null)
            }
        }
    }

    const pickImageAgain = () => {
      setImage(null)
      pickImage()
    }
  // creating new user
  const CreateNewUser = () => {
      createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        // store in db

        await SaveUserToDb(user);
        ToastAndroid.show("User created", ToastAndroid.BOTTOM)
      })
      .catch(e =>{
        console.log(e);
        ToastAndroid.show("Failed to create user", ToastAndroid.BOTTOM)
      })
  }

  const SaveUserToDb = async (user) => {

    const data = {
      name: fullName,
      email: email,
      password: password,
      member: false,
      uid: user?.uid
    };

    await setDoc(doc(db, "users", email), data);

    setUser(data)
    router.replace("/(tabs)/home")
  }
  // Animation values
  const buttonScale = new Animated.Value(1)

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start()
    CreateNewUser();
  }

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry)
  }

  const toggleSecureConfirmEntry = () => {
    setSecureConfirmTextEntry(!secureConfirmTextEntry)
  }

  const toggleTermsAccepted = () => {
    setTermsAccepted(!termsAccepted)
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style ={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",

        }}>
            <Text style={styles.inputLabel}>Profile</Text>
           {image ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                  <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => setImage(null)}>
                  </TouchableOpacity>
              </View>
            ) : (
                <View style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    backgroundColor: "#f2ede0",
                    width: 100,
                    height: 100,
                    borderWidth: 1,
                    padding: 10,
                    marginBottom: 15,
                    borderRadius: 50,
                    borderColor: "#e0e0e0",
                    

                }}>
                  <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={pickImage}
                    >
                    <AntDesign name="user" size={40} color="#666" />
                  </TouchableOpacity>
                </View>
            )}

          </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={[styles.inputWrapper, nameFocused && styles.inputWrapperFocused]}>
              <Feather name="user" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
              <Feather name="mail" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>

          

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
              <Feather name="lock" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureTextEntry}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity onPress={toggleSecureEntry} style={styles.eyeIcon}>
                <Feather name={secureTextEntry ? "eye" : "eye-off"} size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={[styles.inputWrapper, confirmPasswordFocused && styles.inputWrapperFocused]}>
              <Feather name="lock" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={secureConfirmTextEntry}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
              />
              <TouchableOpacity onPress={toggleSecureConfirmEntry} style={styles.eyeIcon}>
                <Feather name={secureConfirmTextEntry ? "eye" : "eye-off"} size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.termsContainer}>
            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={toggleTermsAccepted}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                {termsAccepted && <Feather name="check" size={14} color="#fff" />}
              </View>
            </TouchableOpacity>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>


          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.signUpButton}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.8}
            >
              <Text style={styles.signUpButtonText}>Create Account</Text>
            </TouchableOpacity>
          </Animated.View>
          
        </View>

        
        
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9f0",
    
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 50,
    overflow: 'hidden',
    width: 100, // Adjusted width
    height: 100,
    borderWidth: 1,
    borderColor: "#f2ede0",
    marginBottom: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
      resizeMode: 'cover',
      width: '100%',
      height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 40,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f2ede0",
    borderRadius: 12,
    backgroundColor: "#f2ede0",
    paddingHorizontal: 16,
    height: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputWrapperFocused: {
    borderColor: "#cc3300",
    borderWidth: 1.5,
    shadowOpacity: 0.1,
  },
  inputIcon: {
    marginRight: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#cc3300",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#cc3300",
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
  },
  termsLink: {
    color: "#cc3300",
    fontWeight: "600",
  },
  signUpButton: {
    backgroundColor: "#cc3300",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#cc3300",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  signInText: {
    
    fontSize: 14,
    fontWeight: "bold",
    color: "#cc3300",
  },
})

export default SignUpPage
