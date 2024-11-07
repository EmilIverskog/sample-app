import { Image, StyleSheet, Platform,View,Text, Pressable } from 'react-native'
import { AuthenticationContext } from '@/contexts/AuthenticationContext'
import { useContext, useState } from 'react'
import {onAuthStateChanged, signOut} from '@firebase/auth'
import { useNavigation, router } from 'expo-router'

export default function ProfileScreen(){
    const [currentUser, setCurrentUser] = useState<any | null>()

    const fbauth = useContext(AuthenticationContext)
    const navigation = useNavigation()

    onAuthStateChanged(fbauth, (user: any | null) =>{
        if(user){
            setCurrentUser(user)
        } else{
            setCurrentUser(null)
            console.log("Signed out")
            router.replace("../")
        }
    })

    const signOutUser = () => {
        signOut(fbauth)
        .then(() =>{

        })
        .catch( () => {

        })
    }

    return(
        <View>
            <Text>Profile</Text>
            <Pressable onPress={ () => signOutUser()}>
                <Text>Sign out</Text>
            </Pressable>
        </View>
    )
}