import React, {useEffect, useState} from 'react'
import {Image, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Linking} from 'react-native'
import email from 'react-native-email'
import ADI from '../assets/adi.jpg'
import CURC from '../assets/curc.jpg'
import DPI from '../assets/dpi.jpg'
import {Container} from 'native-base'
import Icon  from 'react-native-vector-icons/dist/FontAwesome'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Lion from '../assets/lion.png'
import Toast from 'react-native-toast-message';
import DPILogo from '../assets/dpiLogo.png'
import ClubSwipeLogo from '../assets/clubSwipeLogoBlue.png'
import { AsyncStorage, Platform } from 'react-native';
// for club and icon rendering 
const Club = ({navigation, route}) => {
    const images = [DPI, ADI, CURC]
    const [currentClubs, setCurrentClubs] = React.useState('')
    const { club, clubID, clubCategory, clubFreq, clubTime, clubSize, clubImage } = route.params
    const [targeted_club, setTargetedClub] = React.useState(club)
    const [id, setId] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [loading, setLoading] = React.useState(true)
    useEffect(() => {
        _retrieveData = async () => {
            if (loading) {
                //console.log(club.club_category);
                console.log(clubCategory);
                console.log("Club name: " + club.name);
                try {
                    const asyncId = await AsyncStorage.getItem('id');
                    const asyncEmail = await AsyncStorage.getItem('email')
                    if (asyncId !== null || asyncEmail != null) {
                        // We have data!!
                        setId(asyncId)
                        setEmail(asyncEmail)
                    }
                } catch (error) {
                    // Error retrieving data
                    console.log(error)
                }
                setLoading(false)
            }
        };
        _retrieveData()
    }, [currentClubs, id, email])
    async function handleYes() {
        const newClub = `${club.id}`
        let clubs = newClub
        try {
            let response = await fetch('https://jskznf9rxa.execute-api.us-east-2.amazonaws.com/production/accountretrieval', {
                method: 'PUT',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    keyValue: {
                        id: id,
                    },
                })
            })
            let json = await response.json()
            let current_clubs = json.current_clubs
            current_clubs.forEach(club => {
                clubs = club + ',' + clubs
            })
        }
        catch(error) {
            console.log(error)
        }
        try {
            await fetch('https://jskznf9rxa.execute-api.us-east-2.amazonaws.com/production/accountmanagement', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                keyValue: {
                    id: id,
                    email: email
                },
                attributeName: "current_clubs",
                attributeValue: clubs
            })
        }).then((res) => {
            console.log(res.json())
            navigation.navigate("Dashboard", {id: id, email: email, reload: true, clubIds: [targeted_club.id]})
        })
        }
        catch(error) {
            console.log(error)
        }
    }

    async function sendEmail() {
        console.log(club)
        const email = club.email
        const subjectText = "Interested in Joining " + club.name
        const bodyText = "I'm interested in joining your club!"

        if (Platform.OS === 'android')
            url = "mailto:" + email + "?cc=&" + "subject=" + subjectText + "&body=" + bodyText;
        else
            url = "mailto:" + email + "?subject=" + subjectText + "&body=" + bodyText;
        // check if we can use this link
      //  const canOpen = await Linking.canOpenURL(url);
/*
        if (!canOpen) {
            throw new Error('Provided URL can not be handled');
            console.log('Provided URL can not be handled');
        }*/
        Linking.canOpenURL(url).then((supported) => {
            if(supported) {
                return Linking.openURL().catch(() => {
                    Toast.show({
                        text1: 'Not able to contact club right now',
                        autohide: true,
                        visibilityTime: 4000,
                        type: 'error'
                    }); 
                })
            }   
            else {
                Toast.show({
                    text1: 'Not able to contact club right now',
                    autohide: true,
                    visibilityTime: 4000,
                    type: 'error'
                }); 
            } 
        })

    }

     const RenderClubLabel = () => (
          club.club_category.map((singleLabel) => {
              return (
                  <View style = {styles.clubLabel}>
                    <Text style = {[styles.buttonText, {fontSize: 16}]}>{singleLabel.toUpperCase()}</Text>
                  </View>
              )
          })
     );

    return (
        <Container style={{backgroundColor: '#F7F9FB'}}>
            <SafeAreaView>
            <ScrollView>
                <View style={styles.navbar}>
                    <Icon name='chevron-left' size={25} style={styles.goBack} onPress={() => navigation.navigate("Dashboard", {id: id, email: email})}/>
                    <Text style={styles.navText} onPress={() => navigation.navigate("Dashboard", {id: id, email: email})}>Return To Dashboard</Text>
                    <Image source={ClubSwipeLogo} style={styles.schoolImage} />
                    <Image source={Lion} style={styles.schoolImage} />
                </View>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.clubText}>{club.name}</Text>
                        <View style = {styles.clubPhoto}>
                            <Image source={{uri: clubImage}} style={styles.clubImage} />
                        </View>
                        <View style = {styles.clubLabelView}>
                            <RenderClubLabel></RenderClubLabel>
                        </View>

                        <View style = {styles.textContent}>
                            <Text style = {styles.clubWebsite} onPress = {() => Linking.openURL(club.website)}> Website </Text>
                            <Text style={styles.clubAbout}>{club.blurb}</Text>
                            <Text style={[styles.clubCharacteristics, {fontWeight: "bold"}]}>
                                Meeting Frequency:
                                <Text style={[styles.clubCharacteristics, {fontWeight: "normal"}]}> {clubFreq}, meets {clubTime} hours per week</Text>
                            </Text>
                            <Text style={[styles.clubCharacteristics, {fontWeight: "bold"}]}>
                                Club Size:
                                <Text style={[styles.clubCharacteristics, {fontWeight: "normal"}]}> {clubSize}</Text>
                            </Text>
                            <View style={styles.container}>
                            <TouchableOpacity style = {styles.buttonContainer} onPress = {sendEmail}>
                                <Text style = {styles.buttonText}> Contact Club Representative </Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            </SafeAreaView>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowRadius: 6,
        shadowOpacity: 0.3,
        elevation: 2,
        marginTop: 20,
        marginBottom: 120,
        width: '90%',
        flexDirection: 'column'
    },
    content: {
        marginTop: 20,
        marginBottom: 120,
        width: '90%',
        flexDirection: 'column'
    },
    clubText: {
        color: '#00334d',
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 30,
        paddingLeft: 25,
        paddingRight: 25
    },
    clubImage: {
        height: 350,
        width: 300,
        marginTop: 20,
    },
    clubAbout: {
        fontSize: 20,
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 5,
        textAlign: "left",
        color: '#00334d'
    },
    clubCharacteristics: {
        textTransform: 'capitalize',
        fontSize: 20,
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 10,
        textAlign: "left",
        color: '#00334d'
    },
    iconHolder: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
    },
    checkButton: {
        color: '#8db891',
        borderWidth: 0,
        marginTop: 0
    },
    yesButton: {
        backgroundColor: '#558059',
        width: 120,
        height: 120,
        marginRight: 80,
        borderRadius: 10,
    },
    no: {
        color: '#eb7a7a',
        borderWidth: 0,
        marginRight: 30,
        alignSelf: 'center',
        alignContent: 'center',
        justifyContent: 'center'
    },
    navbar: {
        backgroundColor: '#E7E8EA',
        flexDirection: 'row',
        paddingTop: 10
    },
    navText: {
        fontSize: 25,
        marginBottom: 10,
        marginRight: 40,
        marginLeft: 15,
        textAlign: 'left',
        color: '#00334d',
        fontWeight: 'bold'
    },
    schoolImage: {
        justifyContent: 'flex-end',
        width: 20,
        height: 25,
        marginRight: 10,
        marginTop: 5
    },
    goBack: {
        marginBottom: 10,
        marginLeft: 30,
        color: '#00334d',
        marginTop: 5
    },
    buttonText: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
        color: "white",
        padding: 5
    },
    buttonContainer: {
        width: "80%",
        textAlign: "center",
        backgroundColor: "#022169",
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20
    },
    clubPhoto: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    center: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clubLabel: {
        textAlign: "center",
        borderRadius: 10,
        padding: 3,
        marginLeft: 2,
        marginRight: 2,
        marginTop: 5,
        backgroundColor: "#022169",
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    clubLabelView: {
        marginLeft: 30,
        marginRight: 30,
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: "3%",
        flex: 0.005,
    },
    textContent: {
        flex: 5,
    },
    clubWebsite: {
        fontSize: 20,
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 20,
        textAlign: "left",
        color: '#B1B3B8',
        fontWeight: 'bold',
    }
})
export default Club