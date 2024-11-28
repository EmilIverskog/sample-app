import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native';
import { useContext, useState } from 'react';
import { AuthenticationContext } from '@/contexts/AuthenticationContext';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { useNavigation, Link } from 'expo-router';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigation = useNavigation();
  const fbauth = useContext(AuthenticationContext);

  // signing in the user 
  const signInUser = () => {
    setErrorMessage(''); 
    signInWithEmailAndPassword(fbauth, email, password)
      .then((user) => {
        navigation.navigate("(tabs)");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage('Username or password is incorrect.'); 
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      {errorMessage ? ( 
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Email"
        style={styles.field}
        value={email}
        onChangeText={(txt) => setEmail(txt)}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Password"
        style={styles.field}
        secureTextEntry={true}
        value={password}
        onChangeText={(txt) => setPassword(txt)}
      />

      <Pressable
        style={styles.button}
        onPress={() => signInUser()}>

        <Text style={styles.buttonText}>SIGN IN</Text>
      </Pressable>

      <Link href="/">
        <Text style={styles.footerText}>
          Don’t have an account?{' '}
          <Text style={styles.link}>
            Sign Up
          </Text>
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
    marginBottom: 40,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
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
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: 'gray',
  },
  link: {
    color: 'orange',
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
});
