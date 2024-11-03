import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native';
import {useState, useEffect} from 'react'

export default function AuthenticationScreen() {

    const [email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMatch, setPasswordMatch] = useState(false);

    useEffect(() => {
        if (password && confirmPassword) {
            setPasswordMatch(password === confirmPassword);
            console.log('great job')
            setPasswordMatch(true);
        } else {
            setPasswordMatch(false);
            console.log('passwords not matching')
        }
    }, [password, confirmPassword]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      
      
      <Text style={styles.label}>Email</Text>
      <TextInput placeholder="Email" 
      style={styles.field} 
      value ={email}
      onChangeText={(txt)=> setEmail(txt)}  
      />
      
      <Text style={styles.label}>Password</Text>
      <TextInput placeholder="Password"
       style={styles.field}
        secureTextEntry={true}
         value ={password}
         onChangeText={(txt)=> setPassword(txt)}/>
      
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput placeholder="Confirm your password"
       style={styles.field}
        secureTextEntry={true}
         value ={confirmPassword}
         onChangeText={(txt)=> setConfirmPassword(txt)}/>
      
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>SIGN UP</Text>
      </Pressable>
      
      <Text style={styles.footerText}>
        Already have an account? <Text style={styles.link}>Login</Text>
      </Text>
      
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
