import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { BowlFood } from 'phosphor-react-native'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../config/firebaseConfig'
import { useContext, useEffect, useState } from 'react'
import { UserDetailContext } from '../../../context/UserDetailContext'

const Content = () => {
  const { user } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false)
  const [recipeList, setRecipeList] = useState([])

  useEffect(() => {
    user && GetUserRecipes();
  }, [user])

  const GetUserRecipes = async () => {
    setLoading(true);
    try {

      const q = query(collection(db, "recipes"), where("createdBy", "==",  user?.email));
      const querySnapshot = await getDocs(q);
  
      const recipes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecipeList(recipes);
    }
    catch (error) {
      console.error("Error fetching user recipes: ", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <View>
      <Text>Content</Text>
    </View>
  )
}

export default Content

const styles = StyleSheet.create();