import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import { AuthenticationContext } from '@/contexts/AuthenticationContext'
import { createUserWithEmailAndPassword } from '@firebase/auth'
import { useNavigation, Link } from 'expo-router'
import { collection, doc, setDoc } from '@firebase/firestore'
import { FireStoreContext } from '@/contexts/FireStoreContext'

export default function AuthenticationScreen() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(false)
  const [validEmail, setValidEMail] = useState(false)
  const [name, setName] = useState('')
  const fbauth = useContext(AuthenticationContext)
  const db = useContext(FireStoreContext)
  const auth = useContext(AuthenticationContext)
  const navigation = useNavigation()

  const signUpUser = () => {
    createUserWithEmailAndPassword(fbauth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
  
        
        try {
          await setDoc(doc(collection(db, 'users'), user.uid), {
            name: name,
            email: email,
          });
          console.log('User data saved successfully');
          navigation.navigate("(tabs)");
        } catch (error) {
          console.error('Error saving user data: ', error);
        }
      })
      .catch((error) => console.log(error));
  };
      
  useEffect(() => {
    if (password.length >= 6 && confirmPassword.length >= 6) {
      setPasswordMatch(password === confirmPassword);
    } else {
      setPasswordMatch(false);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (
      email.includes('@') &&
      email.includes('.') &&
      email.indexOf('@') > 0
    ) {
      setValidEMail(true)
    } else {
      setValidEMail(false)
    }
  }, [email])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput placeholder="Name"
        style={styles.field}
        value={name}
        onChangeText={(txt) => setName(txt)}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput placeholder="Email"
        style={styles.field}
        value={email}
        onChangeText={(txt) => setEmail(txt)}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput placeholder="Password"
        style={styles.field}
        secureTextEntry={true}
        value={password}
        onChangeText={(txt) => setPassword(txt)} />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput placeholder="Confirm your password"
        style={styles.field}
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(txt) => setConfirmPassword(txt)} />

      <Pressable
        style={(validEmail && passwordMatch) ? styles.button : styles.buttonDisabled}
        disabled={(validEmail && passwordMatch) ? false : true}
        onPress={() => signUpUser()}
      >
        <Text style={styles.buttonText}>SIGN UP</Text>
      </Pressable>

      <Link href={"/login"}>
        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.link}>Login</Text>
        </Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 100,
    marginBottom: 80,
  },

  label: {
    fontSize: 16,
    color: 'gray',
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginLeft: 5,
  },
  field: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    fontSize: 16,
    width: '100%',
    marginBottom: 20,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  buttonDisabled: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },

  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: 'gray',
  },
  link: {
    color: 'orange',
    fontWeight: 'bold',
  },

});
