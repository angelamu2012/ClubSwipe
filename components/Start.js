import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {AsyncStorage, SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button, TextInput, TouchableOpacity, Image, KeyboardAvoidingView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from './Dashboard';
import ClubProfile from './clubProfile';
import Toast from 'react-native-toast-message';
import { Header, Colors, } from 'react-native/Libraries/NewAppScreen';
import Lion from '../assets/lion.png'
import ClubSwipeLogo from '../assets/clubSwipeLogoBlue.png'
import {Auth} from 'aws-amplify';

const Start = ({navigation}) => {
    const [load, setLoad] = useState(true);

    useEffect (() => {
          // Fetch the token from local storage then navigate to our appropriate place
        async function retrieveToken() {
            try {
                console.log("check for user token");
                const passwordToken = await AsyncStorage.getItem('passwordToken');
                const emailToken = await AsyncStorage.getItem('emailToken');
                emailToken1 = emailToken.replace(/"/g,"");
                passwordToken1 = passwordToken.replace(/"/g,"");
                const value = await AsyncStorage.getItem('id');
                const user = await Auth.signIn(emailToken1, passwordToken1);
                const isClub = await AsyncStorage.getItem("isClub");
                isClub1 = isClub.replace(/"/g,"");
                let sub = user.attributes.sub
                await AsyncStorage.setItem("id", JSON.stringify(sub));

                //navigate to clubProfile if user is a club, else navigate to student dashboard
                if (isClub1 == "true")
                    navigation.navigate("ClubProfile", { email: emailToken1, userID: sub, reload: false})
                else if (isClub1 == "false")
                    navigation.navigate("Dashboard", { email: emailToken1, userID: sub, reload: false})
            }
            catch (e) {
              console.log("error: " + e.message);
            }
        }
        if (load) {
            retrieveToken();
            setLoad(false);
        }
    })

    return (
        <View style={{backgroundColor: '#78b3e0', height: '100%'}}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
            <View style = {{alignItems: "center", marginTop: "10%"}}>
                <Image style = {styles.logo} source={ClubSwipeLogo} />

                <TouchableOpacity style = {styles.buttonContainer} onPress = {() => navigation.navigate('Welcome', {student: true})}>
                    <Text style = {styles.buttonText}> I am a student </Text>
                </TouchableOpacity>

                <TouchableOpacity style = {styles.buttonContainer} onPress = {() => navigation.navigate('Welcome', {student: false})}>
                    <Text style = {styles.buttonText}> I am a club </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
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
    logo: {
        width: 150,
        height: 150,
    },
    buttonContainer: {
          width: "60%",
          textAlign: "center",
          backgroundColor: "#022169",
          marginTop: 40,
          height: "16%",
          alignItems: "center"
    },
    buttonText: {
        fontSize:20,
        textAlign: "center",
        fontWeight: "bold",
        color: "white",
        marginTop: 15
    }
});

export default Start;
