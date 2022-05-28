import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button, TextInput, TouchableOpacity, Image, KeyboardAvoidingView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from './Dashboard';
import Lion from './assets/lion.png'
import Toast from 'react-native-toast-message';
import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const Welcome = ({navigation}) => {
    const [email, setEmail] = useState();
    const [name, setName] = useState();

  
  function handleFinish() {
    // simple form validation to avoid errors
      let error = false;
      if(name == "" || name == null) {
          error = true
      }
      if(email == "" || email == null) {
          error = true
      }

      if(error) {
        Toast.show({
          text1: 'Enter valid inputs for email and name',
          autohide: true,
          visibilityTime: 4000,
          type: 'error'
        });
      }
      else {
        navigation.navigate("Initialization", {userName: name, userEmail: email})
      }
  }


  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>

      <View style={{marginTop: 10}}>
      <Image
          style = {styles.logo}
          source={Lion}
      />
      </View>

      <KeyboardAvoidingView behavior = "padding" style={styles.container}>
        <Text style = {styles.title}>Welcome to {"\n"} ClubSwipe</Text>
        <Text style = {styles.defaultText}> Just a few things before we get started...</Text>

        <View style = {{borderBottomWidth: 1, width: "60%"}}>
            <TextInput
                placeholder = "Name"
                placeholderTextColor = "gray"
                returnKeyType= "next"
                style={styles.input}
                onChangeText={(text) => setName(text)}
            />
        </View>
        <View style = {{borderBottomWidth: 1, width: "60%"}}>
            <TextInput
                placeholder = "Columbia Email"
                placeholderTextColor = "gray"
                returnKeyType= "go"
                style={styles.input}
                keyboardType = "email-address"
                onChangeText={(text) => setEmail(text)}
            />
        </View>

        <TouchableOpacity
            style = {styles.buttonContainer}
            onPress={handleFinish}>

            <Text style = {styles.buttonText}>SHOW ME CLUBS</Text>

        </TouchableOpacity>

        <TouchableOpacity>
            <Text style = {styles.defaultText} onPress={() => navigation.navigate("Login")}> Actually, I already have an account </Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
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
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#022169",
    textAlign: "center",
    marginTop: 40
  },
  defaultText: {
    textAlign: "center",
    color: "#022169",
    fontSize: 16,
    padding: 20
  },
  button: {
    fontSize: 90,
  },
  buttonContainer: {
    width: "60%",
    textAlign: "center",
    backgroundColor: "#022169",
    marginTop: 40,
    height: "10%"
  },
  input: {
    textAlign: "left",
    fontSize:20,
    width: "60%",
    color: "#022169"
  },
  buttonText: {
    fontSize:20,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    marginTop: 10
  }

});
export default Welcome;