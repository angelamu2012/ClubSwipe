import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {AsyncStorage, SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Keyboard} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from './Dashboard';
import Toast from 'react-native-toast-message';
import { Header, Colors } from 'react-native/Libraries/NewAppScreen';
import Lion from '../assets/lion.png'
import {Auth} from 'aws-amplify';

const API_ENDPOINT = 'https://agnv7bqfra.execute-api.us-east-2.amazonaws.com/production/accountretrieval';

const Welcome = ({navigation, route}) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [clubName, setClubName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(false)
    const [error, setError] = useState(null);
    const [password, setPassword]  = useState('');
    const [rePassword, setRePassword] = useState('')
    const { student } = route.params

    /* useEffect (() => {
          // Fetch the token from storage then navigate to our appropriate place
          async function retrieveToken() {
            try {
              console.log("check for user token");
              const passwordToken = await AsyncStorage.getItem('passwordToken');
              const emailToken = await AsyncStorage.getItem('emailToken');
              emailToken1 = emailToken.replace(/"/g,"");
              passwordToken1 = passwordToken.replace(/"/g,"");
              console.log("emailToken", emailToken1);
              console.log("passwordToken", passwordToken1);
              const value = await AsyncStorage.getItem('id');
              const user = await Auth.signIn(emailToken1, passwordToken1);
              let sub = user.attributes.sub
              await AsyncStorage.setItem("id", JSON.stringify(sub));
              console.log('sub', sub)
              navigation.navigate("Dashboard", { email: emailToken1, userID: sub, reload: false})
            }
            catch (e) {
              console.log("error: " + e.message);
            }
          }
          if (load)
          {
            retrieveToken();
            setLoad(false);
          }
      })*/

    function handleFinish() {
        // simple form validation to avoid errors for student sign up input
        let error = false;
        if(name == "" || name == null || email == "" || email == null || password == "" || password == null) {
            Toast.show({
                text1: 'Email, name, and password fields cannot be left blank',
                autohide: true,
                visibilityTime: 4000,
                type: 'error'
            });
        }
        else if(email.indexOf("@") < 0 || email.indexOf(".") < 0) {
            Toast.show({
                text1: 'Please enter a valid email address',
                autohide: true,
                visibilityTime: 4000,
                type: 'error'
            });
        }
        else if (password.length < 8) {
            Toast.show({
                text1: "Password must have at least 8 characters",
                text2: "Please enter new password" ,
                autohide: true,
                visibilityTime: 4000,
                type: 'error'
            });
        }
        else if(password != rePassword) {
            Toast.show({
                text1: "Passwords entered must match",
                text2: "Please enter passwords that match" ,
                autohide: true,
                visibilityTime: 4000,
                type: 'error'
            });
        }
        else {
            signUp("student");
        }
    }

    async function clubHandleFinish() {
        // simple form validation to avoid errors for club sign up input
        let error = false;
        if(clubName == "" || clubName == null || email == "" || email == null || password == "" || password == null) {
            Toast.show({
                text1: 'Email, club name, and password fields cannot be left blank',
                autohide: true,
                visibilityTime: 4000,
                type: 'error'
            });
        }
        else if(email.indexOf("@") < 0 || email.indexOf(".") < 0) {
            Toast.show({
                text1: 'Please enter a valid email address',
                autohide: true,
                visibilityTime: 4000,
                type: 'error'
            });
        }
        else if (password.length < 8) {
            Toast.show({
                text1: "Password must have at least 8 characters",
                text2: "Please enter new password" ,
                autohide: true,
                visibilityTime: 4000,
                type: 'error'
            });
        }
        else if(password != rePassword) {
            Toast.show({
                text1: "Passwords entered must match",
                text2: "Please enter passwords that match" ,
                autohide: true,
                visibilityTime: 4000,
                type: 'error'
            });
        }
        else {
            signUp("club");
        }
    }

    //after form validation, go through sign up process
    async function signUp(userType) {
        let username = email
        let club = JSON.stringify(!student)
        try {
            const { user, userConfirmed, userSub } = await Auth.signUp({
                username,
                password,
                attributes: {
                    email,
                    'custom:club': club
                }
            });
            if (userType == "club")
                navigation.navigate("ClubRegistration", {clubName: clubName, clubEmail: email, clubID: userSub})
            else if (userType == "student")
                navigation.navigate("Initialization", {userName: name, userEmail: email, userID: userSub})
        }
        catch (error) {
            console.log("error signing up: ", error);
            if (error.message == "An account with the given email already exists.") {
                Toast.show({
                    text1: "An account with the given email already exists",
                    autohide: true,
                    visibilityTime: 4000,
                    type: 'error'
                });
          }
            else if (error.message == "Invalid email address format.") {
                Toast.show({
                    text1: "Invalid email address format",
                    autohide: true,
                    visibilityTime: 4000,
                    type: 'error'
                });
            }
            else {
                Toast.show({
                    text1: "Error signing up. Please try again.",
                    autohide: true,
                    visibilityTime: 4000,
                    type: 'error'
                });
            }
        }
    }

    return (
        <View style={{backgroundColor: '#78b3e0', height: '100%'}}>
        <StatusBar barStyle="dark-content" />
        <ScrollView>
            <View style={{marginTop: 10}}>
                <Image style = {styles.logo} source={Lion} />
            </View>

            <KeyboardAvoidingView behavior = "padding" style={styles.container}>
                <Text style = {styles.title}>Welcome to {"\n"} ClubSwipe</Text>
                <Text style = {styles.defaultText}> Just a few things before we get started...</Text>

                <View style = {{borderBottomWidth: 1, width: "60%", borderColor: '#022169'}}>
                    {student == true?
                        <TextInput
                            placeholder = "First and Last Name"
                            placeholderTextColor = "#022169"
                            autoCapitalize="none"
                            returnKeyType= "next"
                            style={styles.input}
                            onChangeText={(text) => setName(text)}
                        />
                        :
                        <TextInput
                            placeholder = "Club Name"
                            placeholderTextColor = "#022169"
                            autoCapitalize="none"
                            returnKeyType= "next"
                            style={styles.input}
                            onChangeText={(text) => setClubName(text)}
                        />
                    }
                </View>
                <View style = {{borderBottomWidth: 1, marginTop: "3%", width: "60%" , borderColor: '#022169'}}>
                    {student == true?
                        <TextInput
                            placeholder = "Columbia Email"
                            placeholderTextColor = "#022169"
                            autoCapitalize="none"
                            returnKeyType= "go"
                            style={styles.input}
                            keyboardType = "email-address"
                            onChangeText={(text) => setEmail(text)}
                        />
                        :
                        <TextInput
                            placeholder = "Club Email"
                            placeholderTextColor = "#022169"
                            autoCapitalize="none"
                            returnKeyType= "go"
                            style={styles.input}
                            keyboardType = "email-address"
                            onChangeText={(text) => setEmail(text)}
                        />
                    }
                </View>
                <View style = {{borderBottomWidth: 1, marginTop: "3%", width: "60%" , borderColor: '#022169'}}>
                    <TextInput
                        placeholder = "Password"
                        placeholderTextColor = "#022169"
                        autoCapitalize="none"
                        style={styles.input}
                        secureTextEntry={true}
                        onSubmitEditing={()=> Keyboard.dismiss()}
                        textContentType={'oneTimeCode'}
                        onChangeText={(text) => setPassword(text)}
                    />
                </View>
                <View style = {{borderBottomWidth: 1, marginTop: "3%", width: "60%" , borderColor: '#022169'}}>
                    <TextInput
                        placeholder = "Re-enter Password"
                        placeholderTextColor = "#022169"
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        secureTextEntry={secureTextEntry}
                        onFocus={() => setSecureTextEntry(true)}
                        textContentType={'oneTimeCode'}
                        onSubmitEditing={()=> Keyboard.dismiss()}
                        style={styles.input}
                        onChangeText={(text) => setRePassword(text)}
                    />
                </View>

                {student == true?
                    <TouchableOpacity
                        style = {styles.buttonContainer}
                        onPress={handleFinish}>
                         <Text style = {styles.buttonText}>SHOW ME CLUBS</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style = {styles.buttonContainer}
                        onPress={clubHandleFinish}>
                         <Text style = {styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                }

                <TouchableOpacity>
                    <Text style = {styles.defaultText} onPress={() => student == true? navigation.navigate("Login", {isClub: false}) : navigation.navigate("Login", {isClub: true})}> Actually, I already have an account </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style = {[styles.defaultText,{ marginBottom: 3}]} onPress={() => navigation.navigate("Dashboard", { bypassed: true, reload: false, email: 'alv2145@columbia.edu', id: 'none', })}> Bypass Login</Text>
                </TouchableOpacity>
                {/*<TouchableOpacity>
                    <Text style = {styles.defaultText} onPress={() => navigation.navigate("ClubRegistration")}> Register as a club </Text>
                </TouchableOpacity>*/}

            </KeyboardAvoidingView>
        </ScrollView>
        </View>
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
        width: "100%",
        color: "#022169"
    },
    buttonText: {
        fontSize:20,
        textAlign: "center",
        fontWeight: "bold",
        color: "white",
        marginTop: 15
    }
});

export default Welcome;
