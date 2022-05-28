import React, { Component, useRef, useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Button, SafeAreaView, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
// import {MaterialCommunityIcon} from 'react-native-vector-icons'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
// import { Icon } from 'react-native-elements'
import { Container } from 'native-base'
import Swiper from 'react-native-deck-swiper'
// import Swiper from 'react-native-swiper'
import Lion from '../assets/lion.png'
import ADI from '../assets/adi.jpg'
import CURC from '../assets/curc.jpg'
import DPI from '../assets/dpi.jpg'
import DPILogo from '../assets/dpiLogo.png'
import Toast from 'react-native-toast-message';
import { AsyncStorage } from 'react-native';
// import Swipeable from 'react-native-gesture-handler/swipeable'
//import {GestureHandler} from 'expo'
// const { Swipeable } = GestureHandler

Icon.loadFont();
MaterialCommunityIcons.loadFont();
Swiping = ({ navigation, route }) => {

    // loading values
    const [loading, setLoading] = React.useState(true)
    // swiper functions
    const [id, setId] = React.useState('')
    const [email, setEmail] = React.useState('')
    const useSwiper = useRef(null).current
    const handleOnSwipeLeft = () => {
       //var newClubs = [...clubs]
      // newClubs.shift()
       // setClubs(newClubs)
        // useSwiper.swipeLeft()
    }
    const handleOnSwipeRight = (cardIndex) => {
        //handle the right gesture
        //var newClubs = [...clubs]
       // newClubs.shift()
      // setClubs(newClubs)
        var selected = selectedClubs
        selected.push(clubs[cardIndex].id)
        setSelectedClubs(selected)
        console.log(selected)
        // useSwiper.swipeRight()
    }

    const leftSwipe = () => {
        var newClubs = [...clubs]
        newClubs.shift()
        setClubs(newClubs)
         // useSwiper.swipeLeft()
     }
    const rightSwipe = () => {
        // handle the right gesture
        var newClubs = [...clubs]
        newClubs.shift()
       setClubs(newClubs)
        var selected = selectedClubs
        selected.push(clubs[0].id)
        setSelectedClubs(selected)
        console.log(clubs[0].id)
        // useSwiper.swipeRight()
    }

    useEffect(() => {
        // getData()
        console.log("running")
        if (loading) {
            if (clubs.length <= 2 || clubs == null) {
                Toast.show({
                    text1: 'No clubs to display',
                    autohide: true,
                    visibilityTime: 4000,
                    type: 'error'
                });
                navigation.navigate("Dashboard", {userEmail: email, userId: id, reload: true, clubIds: selectedClubs})
            }
            _retrieveData = async () => {
                try {
                    const asyncId = await AsyncStorage.getItem('id');
                    const asyncEmail = await AsyncStorage.getItem('email')
                    console.log('ID ' + asyncId)
                    if (asyncId !== null || asyncEmail != null) {
                        // We have data!!
                        setId(asyncId)
                        setEmail(asyncEmail)
                        const variables = [asyncId, asyncEmail]
                        getData(asyncId)
                        console.log(asyncId + 'id')
                    }
                } catch (error) {
                    // Error retrieving data
                    console.log(error)
                }
            };
            _retrieveData()
        }
        else {

        }
    }, []
    )

    const getData = async (asyncId) => {
        // get the data for the clubswiping 
        try {
            let response = await fetch('https://s6tev3m93k.execute-api.us-east-2.amazonaws.com/production/basicvectormatching',
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        keyValue: {
                            id: asyncId,
                        }
                    })
                })
            let json = await response.json()
            // console.log("club ids returned: " + json)
            let newClubs = []
            for await (const clubId of json){
                try {
                    let response = await fetch('https://agnv7bqfra.execute-api.us-east-2.amazonaws.com/production/accountretrieval', {
                      method: "PUT",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        id: clubId
                      })
                    })
                    let club = await response.json()
                    newClubs.push(club)
                    // console.log(newClubs)
                    setClubs(newClubs)
                  }
                  catch(error) {
                    console.log(error)
                    navigation.navigate("Dashboard", {userEmail: email, userId: id, reload: false, clubIds: selectedClubs})
                    Toast.show({
                        text1: 'No clubs to display',
                        autohide: true,
                        visibilityTime: 4000,
                        type: 'error'
                    });
                  }
            }

            newClubs = newClubs.concat(clubs)
            newClubs.pop()
            newClubs.pop()
            setClubs(newClubs)
            // console.log("club data included: " + newClubs)
            setLoading(false)
            if(newClubs.length == 0  || newClubs.length <= 2){
                navigation.navigate("Dashboard", {userEmail: email, userId: id, reload: false, clubIds: selectedClubs})
                Toast.show({
                    text1: 'No clubs to display',
                    autohide: true,
                    visibilityTime: 4000,
                    type: 'error'
                });
            }
            // console.log('poop')
        }
        catch (error) {
            console.log(error)
        }
    }
    const handleFinished = () => {
        // handle when the data is submitted
        // getData()
        // send to api here
        sendData()
        // console.log(selectedClubs.id)
        navigation.navigate("Dashboard", {userEmail: email, userId: id, reload: true, clubIds: selectedClubs, bypassed: false})
    }

    const sendData = async () => {
        try {
            // get the current clubs
            let response = await fetch('https://jskznf9rxa.execute-api.us-east-2.amazonaws.com/production/accountretrieval', {
                method: "PUT",
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
            let updatedClubs = selectedClubs.concat(json.current_clubs)
            updateClubs(updatedClubs)
        }
        catch (error) {
            console.log(error)
        }
    }

    async function updateClubs(updatedClubs) {
        // add the selected clubs to the current clubs

        // parse current clubs to send them to the database
        let newClubs = updatedClubs[0]
        let index = 0
        // updatedClubs.shift()
        // console.log(updatedClubs)
        updatedClubs.forEach((club) => {
            if (club != undefined && index != 0) {
                newClubs = club + "," + newClubs
            }
            else {
                index += 1
            }
        })
        console.log("NEW CLUBS " + newClubs)
        try {
            let res = await fetch('https://jskznf9rxa.execute-api.us-east-2.amazonaws.com/production/accountmanagement', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    keyValue: {
                        id: id,
                    },
                    attributeName: "current_clubs",
                    attributeValue: newClubs
                })
            })
            let json = res.json()
            //console.log(res)
        }
        catch (error) {
            console.log(error)
        }
    }
    // dummy data for clubs at columbia
    const [selectedClubs, setSelectedClubs] = React.useState([])
    const [clubs, setClubs] = React.useState([{}, {}, {}])
    let images = [ADI, DPI, CURC]
    return (
        <Container style={{ backgroundColor: '#B9D9EB'}}>
            <SafeAreaView>
                <View style={styles.navbar}>
                    <Icon name='chevron-left' size={25} style={styles.goBack} onPress={handleFinished} />
                    <Text onPress={handleFinished} style={styles.navText}>Return To Dashboard</Text>
                    <Image source={Lion} style={styles.schoolImage} />
                    <Image source={DPILogo} style={styles.schoolImage} />
                </View>
                {!loading ?
                    clubs.length > 2 ?

                        <View style={{
                            width: '90%',
                        }}>
                            <Swiper
                                ref={useSwiper}
                                cards={clubs.slice(0, clubs.length - 1)}
                                renderCard={club => <Club club={club} images={images} handleOnSwipeLeft={leftSwipe} handleOnSwipeRight={rightSwipe} />}
                                cardIndex={0}
                                backgroundColor="white"
                                stackSize={2}
                                showSecondCard={false}
                                animateOverlayLabelsOpacity
                                onSwipedAll={handleFinished}
                                onSwipedLeft={(cardIndex) => handleOnSwipeLeft(cardIndex)}
                                onSwipedRight={(cardIndex) => handleOnSwipeRight(cardIndex)}
                                overlayLabels={{
                                    left: {
                                        title: 'NOPE',
                                        element: <OverlayLabel label="NOPE" color="#eb7a7a" />,
                                        style: {
                                            wrapper: {
                                                ...styles.overlayWrapper,
                                                paddingRight: 25,
                                                alignItems: 'flex-end',
                                            },
                                        },
                                    },
                                    right: {
                                        title: 'LIKE',
                                        element: <OverlayLabel label="LIKE" color="#8db891" />,
                                        style: {
                                            wrapper: {
                                                ...styles.overlayWrapper,
                                                alignItems: 'flex-start',
                                                marginLeft: 35,
                                            },
                                        },
                                    },
                                }}
                            />
                        </View>

                        : handleFinished() : <ActivityIndicator size="large" color='blue' alignSelf='center'/>}
            </SafeAreaView>
        </Container>
    )
}

// for club and icon rendering 

const Club = ({ club, images, handleOnSwipeLeft, handleOnSwipeRight }) => (
    <View style={styles.card}>
        <Image source={images[Math.floor(Math.random() * images.length)]} style={styles.clubImage} />
        <Text style={styles.clubText}>{club.name}</Text>
        <Text style={styles.clubAbout}>{club.blurb}</Text>
        <View style={styles.iconHolder}>
            <TouchableOpacity onPress={handleOnSwipeLeft}>
                <MaterialCommunityIcons name='close-box' style={styles.no} size={170} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleOnSwipeRight}>
                <Icon name='check-square' style={styles.checkButton} size={150} />
            </TouchableOpacity>
        </View>
    </View>
)

// styles for overlay labels
const OverlayLabel = ({ label, color }) => (
    <View style={[styles.overlayLabel, { backgroundColor: color, borderColor: color }]}>
        <Text style={[styles.overlayLabelText, { color: 'white' }]}>{label}</Text>
    </View>
)


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navbar: {
        backgroundColor: '#B9D9EB',
        flexDirection: 'row',
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
        marginRight: 10
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'black',
        shadowColor: 'black',
        borderRadius: 5
    },

    clubText: {
        color: '#00334d',
        fontSize: 27,
        fontWeight: 'bold',
        marginTop: 30
    },
    clubImage: {
        height: 300,
        width: 300,
        marginTop: 20,
    },
    clubAbout: {
        fontSize: 17,
        marginRight: 30,
        height: 150,
        marginLeft: 30,
        marginTop: 10
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
    },
    buttonText: {
        fontSize: 50
    },
    overlayLabel: {
        marginTop: 65,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 10,
        borderWidth: 2,
        borderRadius: 10,
    },
    overlayLabelText: {
        fontSize: 25,
        textAlign: 'center',
    },
    card: {
        flex: 1,
        alignItems: 'center',
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
        marginBottom: 95,
        marginTop: -50,
        flexDirection: 'column'
    },
    iconHolder: {
        flexDirection: "row",
        position: 'absolute',
        bottom: 0,
        justifyContent: "center",
        alignItems: 'center',
    },
    goBack: {
        marginTop: 5,
        marginBottom: 10,
        marginLeft: 30,
        color: '#00334d',
    }
})

export default Swiping;