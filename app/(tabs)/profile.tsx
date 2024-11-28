import { Image, StyleSheet, View, Text, Pressable, Modal, TextInput } from 'react-native'
import { AuthenticationContext } from '@/contexts/AuthenticationContext'
import { useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from '@firebase/auth'
import { useNavigation, router } from 'expo-router'
import { doc, getDoc, updateDoc } from '@firebase/firestore'
import { FireStoreContext } from '@/contexts/FireStoreContext'

export default function ProfileScreen() {
    const [currentUser, setCurrentUser] = useState<any | null>()
    const fbauth = useContext(AuthenticationContext)
    const navigation = useNavigation()
    const [userName, setUserName] = useState('')
    const [email, setNewEmail] = useState('')
    const auth = useContext(AuthenticationContext)
    const db = useContext(FireStoreContext)
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [modalType, setModalType] = useState<'name' | 'email' | null>(null)
    const [newInput, setNewInput] = useState<string | undefined>()

    // Monitor auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fbauth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
                console.log("Signed out")
                router.replace("/login")
            }
        })
        
        return () => unsubscribe();
    }, [fbauth]);

    // Sign out the user
    const signOutUser = () => {
        signOut(fbauth)
            .then(() => console.log("User signed out"))
            .catch((error) => console.log("Sign-out error:", error))
    };

    // Update user's name in Firebase
    const updateName = async () => {
        if (auth.currentUser && newInput) {
            try {
                const userDocRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userDocRef, {
                    name: newInput
                })
                setUserName(newInput)
                setModalVisible(false)
            } catch (error) {
                console.error("Could not update name", error)
            }
        }
    }

    // Update user's email in Firebase
    const updateEmail = async () => {
        if (auth.currentUser && newInput) {
            try {
                const userDocRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userDocRef, {
                    email: newInput
                })
                setNewEmail(newInput)
            } catch (error) {
                console.log("Could not update email")
            }
        }
    }

    // Determine which modal view to open
    const saveinput = () => {
        if (modalType === 'name') {
            updateName()
        } else if (modalType === 'email') {
            updateEmail()
        }
        setModalVisible(false)
    }

    // Fetch the user's name from Firebase
    useEffect(() => {
        const fetchUserName = async () => {
            if (auth.currentUser) {
                try {
                    const userDocRef = doc(db, 'users', auth.currentUser.uid)
                    const userDoc = await getDoc(userDocRef)
                    if (userDoc.exists()) {
                        const userData = userDoc.data()
                        setUserName(userData.name || '')
                    }
                } catch (error) {
                    console.error("Error fetching user data: ", error)
                }
            }
        };
        fetchUserName();
    }, [auth.currentUser]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.userName}>{userName}</Text>

            <Pressable style={styles.button} onPress={() => {
                setModalType('name');
                setModalVisible(true);
                setNewInput(userName);
            }}>
                <Text style={styles.buttonText}>Change Name</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={() => {
                setModalType('email');
                setModalVisible(true);
                setNewInput(email);
            }}>
                <Text style={styles.buttonText}>Change Email</Text>
            </Pressable>

           
            <Pressable style={styles.button} onPress={() => router.push("/previousGoals")}>
                <Text style={styles.buttonText}>Previous Goals</Text>
            </Pressable>

            <Pressable style={[styles.button, styles.button]} onPress={signOutUser}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </Pressable>

            <Modal visible={modalVisible} transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>
                            {modalType === 'name' ? 'Change Name' : 'Change Email'}
                        </Text>
                        <TextInput
                            style={styles.input}
                            value={newInput}
                            onChangeText={(val) => setNewInput(val)}
                        />
                        <Pressable style={styles.modalButton} onPress={saveinput}>
                            <Text style={styles.buttonText}>Save</Text>
                        </Pressable>
                        <Pressable style={styles.modalButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        backgroundColor: '#FFFFFF',
        paddingTop: 60,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#E0E0E0',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 20,
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 24,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        padding: 10,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
    },
    modalButton: {
        backgroundColor: '#E0E0E0',
        paddingVertical: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
});
