import React, {useState, useEffect} from 'react'
import {ScrollView, SafeAreaView, TextInput, StyleSheet, Text, Image, Keyboard} from 'react-native'
import {Container, Button} from 'native-base'
import Lion from '../assets/lion.png'
import Toast from 'react-native-toast-message';
import { AsyncStorage } from 'react-native';
import {Auth} from 'aws-amplify';

Login = ({navigation, route}) => {
    // email value
    const {isClub} = route.params
    const [email, setEmail] = React.useState('')
    const [id, setId] = React.useState('')
    const [password, setPassword] = React.useState('')
    useEffect (() => {
        async function getId() {
            const newId = await AsyncStorage.getItem(STORAGE_KEY)
            console.log(newId)
        }
        getId()
    }, [id])
    function handleLogin() {
        // for handling login
        if (email != '') {
            if(email=="tester@tester.com"){
                navigation.navigate("Dashboard", { email: email, id: '0', reload: false})
            }
            else {
                _retrieveData = async () => {
                    try {
                        const value = await AsyncStorage.getItem('id');
                        if (value !== null) {
                            // We have data!!
                            // setId(value)
                            if(!isClub){
                                navigation.navigate("Dashboard", { email: email, id: value, reload: false})
                            }
                            else {
                                navigation.navigate('ClubProfile', { email: email, id: id, reload: false})
                            }
                        }
                    } catch (error) {
                        // Error retrieving data
                    }
                };
                _retrieveData()
            }
       }
       else {
        Toast.show({
            text1: 'Enter a valid email input' ,
            autoHide: true,
            visibilityTime: 4000,
            type: 'error'
          });
       }
    }

    async function storeToken(email, password, id, userTypeClub){
        try {
            await AsyncStorage.setItem("emailToken", JSON.stringify(email));
            await AsyncStorage.setItem("passwordToken", JSON.stringify(password));
            await AsyncStorage.setItem("id", JSON.stringify(id));
            await AsyncStorage.setItem("isClub", JSON.stringify(userTypeClub));
            console.log("storing email and password tokens");
            /*emailToken = await AsyncStorage.getItem('emailToken');
            console.log("Email Token: " + emailToken);
            passwordToken = await AsyncStorage.getItem('passwordToken');
            console.log("Password Token: " + passwordToken);*/
            console.log("storing is club", userTypeClub);
        }
        catch (err) {
            console.log(err);
        }
    }

   /* async function getEmailToken() {
        try {
            let userEmail = await AsyncStorage.getItem("emailToken");
            let emailToken = JSON.parse(userEmail);
            console.log("emailToken", emailToken);
            return emailToken
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }*/

   /* async function getPasswordToken() {
            try {
                let userPassword = await AsyncStorage.getItem("passwordToken");
                let passwordToken = JSON.parse(userPassword);
                console.log("passwordToken: ", passwordToken);
                return passwordToken
            } catch (error) {
                console.log("Something went wrong", error);
            }
        }*/

    async function signIn() {
        if (email == '' || password == '' || email == null || password == null) {
            Toast.show({
                text1: "Email and password fields cannot be left blank" ,
                autoHide: true,
                visibilityTime: 4000,
                type: 'error'
            });
        }
        else if(email.indexOf("@") < 0 || email.indexOf(".") < 0) {
            Toast.show({
                text1: 'Please enter a valid email address',
                autoHide: true,
                visibilityTime: 4000,
                type: 'error'
            });
         }
        else {
             try {
                 const user = await Auth.signIn(email, password);
                 let sub = user.attributes.sub
                 let userTypeClub = user.attributes['custom:club'];
                 storeToken(email, password, sub, userTypeClub);
                 const value = await AsyncStorage.getItem('id');
                 console.log("user:", user);
                 console.log('sub', sub);
                 console.log('userTypeClub', userTypeClub);
                 if (userTypeClub == "true")
                    navigation.navigate("ClubProfile", { email: email, userID: sub, reload: false})
                 else
                    navigation.navigate("Dashboard", { email: email, userID: sub, reload: false})
             } catch (error) {
                 console.log('error signing in', error);
                 if (error.message == "User is not confirmed.") {
                     Toast.show({
                       text1: "User account not verified",
                       text2: "Please check email for a verification link" ,
                       autoHide: true,
                       visibilityTime: 4000,
                       type: 'error'
                     });
                 }
                 else {
                     Toast.show({
                       text1: "Error logging in ",
                       text2: "Please try again" ,
                       autoHide: true,
                       visibilityTime: 4000,
                       type: 'error'
                     });
                 }
             }
        }
    }

    return (
        <SafeAreaView>
            <ScrollView scrollEnabled={false}>
                <Container style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                    <Image source={Lion} style={styles.schoolImage}/>
                    <Text style={styles.title}>ClubSwipe Login</Text>
                    <TextInput style={styles.textInput} placeholder="Email Address" onChangeText={(value) => setEmail(value)} autoCapitalize="none"/>
                    <TextInput clearTextOnFocus={true} textContentType='newPassword'onSubmitEditing={() => Keyboard.dismiss()} style={styles.textInput}                 blurOnSubmit={false}
                textContentType={'oneTimeCode'}
                secureTextEntry={true}
                onSubmitEditing={()=> Keyboard.dismiss()}onChangeText={(value) => setPassword(value)} autoCapitalize="none" placeholder='Password'/>
                    <Button style={[styles.button, {backgroundColor: '#00058f', marginBottom: 10}]} onPress={signIn}>
                        <Text style={{color: 'white', fontSize: 17,paddingLeft: 140,}}>Login</Text>
                    </Button>
                    {isClub == false?
                        <Button style={[styles.button, {backgroundColor: 'grey', marginBottom: 160}]} onPress={() => navigation.navigate("Dashboard", { email: email, id: value, reload: false})}>
                            <Text style={{color: 'white', fontSize: 17,paddingLeft: 135}}>Return</Text>
                        </Button>
                        :
                        <Button style={[styles.button, {backgroundColor: 'grey', marginBottom: 160}]} onPress={() => navigation.navigate('ClubProfile', { email: email, id: id, reload: false})}>
                            <Text style={{color: 'white', fontSize: 17,paddingLeft: 135}}>Return</Text>
                        </Button>
                    }
                </Container>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#022169",
        textAlign: "center",
        marginBottom: 10
      },
      textInput: {
        height: 50,
        width: 325,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'left',
        padding: 10,
        marginBottom: 20
    },
    button: {
        width: 325,
        height: 50,
        alignSelf: 'center',
        textAlign: 'center'
    },
    schoolImage: {
        justifyContent: 'flex-end',
        width: 115,
        height:120,
    },
})
export default Login