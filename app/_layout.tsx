import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaView, StyleSheet,StatusBar } from 'react-native';


import { useColorScheme } from '@/hooks/useColorScheme';

//import { firebaseConfig } from '../config/config'
import {initializeApp} from '@firebase/app'
import { getAuth } from '@firebase/auth';
import { AuthenticationContext } from '@/contexts/AuthenticationContext'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  //const FBapp = initializeApp(firebaseConfig)
  //const FBauth = getAuth(FBapp)

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      
        <SafeAreaView style={Styles.container}>
          <Stack screenOptions={{headerShown: false}}/>
        </SafeAreaView>
      
    </ThemeProvider>
  );
}

const Styles = StyleSheet.create({
  container:{
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  }
})