/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar, Button, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, FlatList, ImageBackground} from 'react-native';
import Initialization from './components/initialization'
import Swiping from './components/swiping'
import Welcome from './components/Welcome'
import Dashboard from './components/Dashboard'
import SplashScreen from './components/Dashboard'
import {NavigationContainer, StackActions} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Feather from "react-native-vector-icons/Feather";
import Toast from 'react-native-toast-message';
import ClubProfile from './components/clubProfile'
import StudentProfile from './components/studentProfile'
import EditStudentProfile from './components/editStudentProfile'
import ClubDashboard from './components/clubDashboard'


import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Login from './components/login'
import Club from './components/club'
import Start from './components/Start'
import ClubRegistration from './components/ClubRegistration'
import EditClubProfile from './components/editClubProfile'
import Amplify, {Auth} from 'aws-amplify'

Feather.loadFont();
// for navigating react native screens
const Stack = createStackNavigator()

Amplify.configure({
    Auth: {

        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: 'us-east-2_lm5oq1Oaj',

        // REQUIRED - Amazon Cognito Region
        region: 'us-east-2',
        userPoolId: 'us-east-2_lm5oq1Oaj',
        userPoolWebClientId: '1504412ipq8tf317og6s94bmg9'
    }
});

const currentConfig = Auth.configure();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} >
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Initialization" component={Initialization} />
        <Stack.Screen name="ClubRegistration" component={ClubRegistration} />
        <Stack.Screen name="Swiping" component={Swiping} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="StudentProfile" component={StudentProfile} />
        <Stack.Screen name="EditStudentProfile" component={EditStudentProfile} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Club" component={Club} />
        <Stack.Screen name="ClubProfile" component={ClubProfile} />
        <Stack.Screen name="EditClubProfile" component={EditClubProfile} />
        <Stack.Screen name="ClubDashboard" component={ClubDashboard} />
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    backgroundColor: Colors.lighter,
    padding: 20
  },
  container: {
    alignItems: "center"
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  logo: {
    width: 50,
    height: 60,
    margin: 10,
    padding: 10,
  }
});
