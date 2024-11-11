import { Image, StyleSheet, View, Text, Pressable, Modal, TextInput } from 'react-native';
import { AuthenticationContext } from '@/contexts/AuthenticationContext';
import { useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from '@firebase/auth';
import { useNavigation, router } from 'expo-router';
import { doc, getDoc } from '@firebase/firestore';
import { FireStoreContext } from '@/contexts/FireStoreContext';

export default function ProfileScreen() {
    const [currentUser, setCurrentUser] = useState<any | null>();
    const fbauth = useContext(AuthenticationContext);
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const auth = useContext(AuthenticationContext);
    const db = useContext(FireStoreContext);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [newName, setNewName] = useState<string | undefined>();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fbauth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
                console.log("Signed out");
              
                setTimeout(() => router.replace("../"), 0);
            }
        });

        return () => unsubscribe();
    }, [fbauth]);

    const signOutUser = () => {
        signOut(fbauth)
            .then(() => console.log("User signed out"))
            .catch((error) => console.log("Sign-out error:", error));
    };

    useEffect(() => {
        const fetchUserName = async () => {
            if (auth.currentUser) {
                try {
                    const userDocRef = doc(db, 'users', auth.currentUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserName(userData.name || ''); 
                    }
                } catch (error) {
                    console.error("Error fetching user data: ", error);
                }
            }
        };
        fetchUserName();
    }, [auth.currentUser]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.userName}>{userName}</Text>

            <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Change Name</Text>
            </Pressable>

            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Change Email</Text>
            </Pressable>

            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Previous Goals (not working yet)</Text>
            </Pressable>

            <Pressable style={[styles.button, styles.button]} onPress={signOutUser}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </Pressable>

            <Modal visible={modalVisible} transparent>
                <View>
                    <Text>New Name</Text>
                    <TextInput value={newName} onChangeText={(val) => setNewName(val)} />
                    <Pressable onPress={() => setModalVisible(false)}>
                        <Text>Save</Text>
                    </Pressable>
                    <Pressable onPress={() => setModalVisible(false)}>
                        <Text>Cancel</Text>
                    </Pressable>
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
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    cancelButton: {
        backgroundColor: '#FF5C5C',
        paddingVertical: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
});
