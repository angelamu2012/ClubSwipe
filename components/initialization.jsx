import React, {useState, useEffect} from 'react'
import {StyleSheet, Text, View, TouchableHighlight, Image, TextInput, SafeAreaView, ScrollView} from 'react-native'
import {Container, Button} from 'native-base'
import DropDownPicker from 'react-native-dropdown-picker';
import Lion from '../assets/lion.png'
import Feather from "react-native-vector-icons/Feather";
import Toast from 'react-native-toast-message';
import { AsyncStorage } from 'react-native';
import Slider from '@react-native-community/slider';
Feather.loadFont();

// TODOS: show if an attribute is pressed and style according to the text lyra wants

export default function Initialization({navigation, route}) {
    // for later use
    var uuid = require('react-native-uuid');

    // values for attribute selection
    const [selectedAttributes, setSelectedAttributes] = React.useState([true, true, true, true, true, 
        true, true, true, true, true, true])
    
    const [finalAttributes, setFinalAttributes] = React.useState([])

    const attributes = ["STEM", "FINANCE", "POLISCI", "ACTIVISM", "VOLUNTEERING",
        "EVENTS", "PUBLICATION", "PRE-PROFESSIONAL", "PERFORMING ARTS", "ENTREPRENEURSHIP"]
    const clubTimes = ["BIWEEKLY", "WEEKLY", "MONTHLY"]
    const [clubTimesColors, setClubTimesColors] = React.useState(['#c9c9c7', '#c9c9c7', '#c9c9c7'])
    const [selectedClubTimes, setClubTimes] = React.useState([true, true, true])
    const clubSizes = ['small', 'medium', 'large', 'giant']
    // all the data necessary for registering a user is here
    const [id, setId] = React.useState('')
    const {userName, userEmail, userID} = route.params
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [hours, setHours] = React.useState('')
    const [school, setSchool] = React.useState('')
    const [clubSize, setClubSize] = React.useState('')
    const [loading, setLoading] = React.useState(true)
    const [toastRemind, setToastRemind] = React.useState(true)
    const [frequency, setFrequency] = React.useState('')
    const [majors, setMajors] = React.useState('')
    const [majorsList, setMajorsList] = React.useState([])
    const [currentClubs, setCurrentClubs] = React.useState([])
    const [color, setBackgroundColor] = React.useState('#c9c9c7')
    const [colors, setBackgroundColors] = React.useState(['#c9c9c7', '#c9c9c7', '#c9c9c7', '#c9c9c7', '#c9c9c7', '#c9c9c7', '#c9c9c7', '#c9c9c7',
     '#c9c9c7', '#c9c9c7'])

    const [firstMajor, setFirstMajor] = React.useState('')
    const [secondMajor, setSecondMajor] = React.useState('')
    useEffect(() => {
        /*if (toastRemind)
        {
            Toast.show({
                text1: 'Please check email for account verification link',
                autohide: true,
                visibilityTime: 8000,
            });
            console.log("VERIFICATION LINK REMINDER");
            setToastRemind(false);
        }*/
        // use to update the majors for the user and send the data to the api when ready
        if(loading) {
            setLoading(false)
            // parse first and last names
            let name = userName.split(' ')
            setId(userID)
            setFirstName(name[0])
            setLastName(name[1])

        }
        else {
            console.log(userID)
            console.log(school)
            sendData()
            async function _storeData () {
                try {
                  await AsyncStorage.setItem(
                    'id',
                    userID
                  );
                  await AsyncStorage.setItem(
                      'email',
                      userEmail
                  )
                } catch (error) {
                  console.log(error)
                }
              };
              _storeData()
        }
    }, [currentClubs, majorsList, finalAttributes]
    )

    const sendData = async () => {
        let input = {
            first_name: firstName,
            last_name: lastName,
            id: userID,
            school: school,
            email: userEmail,
            majors: majorsList,
            club_category: finalAttributes,
            time_commitment: hours,
            club_size: clubSize,
            current_clubs: [],
            meeting_freq: frequency,
            misc_pref: []
        }
        try {
            let response = await fetch("https://jskznf9rxa.execute-api.us-east-2.amazonaws.com/production/accountmanagement", {
                method: "PATCH",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(input)
            })
            let json = await response.json()
            console.log(json)
            // console.log('poop')
        }
        catch (error) {
            console.log(error)
        }
    }
    // handle if an attribute is pressed
    const handlePress = (attribute)  => {
        const index = attributes.indexOf(attribute)
        const newValues = [...selectedAttributes]
        newValues[index] = !newValues[index]
        setSelectedAttributes(newValues)
        if(selectedAttributes[index]) {
            var newColors = [...colors]
            newColors[index] = '#00058f'
            setBackgroundColors(newColors)
        }
        else {
            var newColors = [...colors]
            newColors[index] = '#c9c9c7'
            setBackgroundColors(newColors)
        }
    }
     // handle if an attribute is pressed
     const handleClubTime = (attribute)  => {
        const index = clubTimes.indexOf(attribute)
        const newValues = [...selectedClubTimes]
        newValues[index] = !newValues[index]
        setClubTimes(newValues)
        if(selectedClubTimes[index]) {
            var newColors = [...clubTimesColors]
            newColors[index] = '#00058f'
            setClubTimesColors(newColors)
        }
        else {
            var newColors = [...clubTimesColors]
            newColors[index] = '#c9c9c7'
            setClubTimesColors(newColors)
        }
    }

    function handleValidation(finalAttributes, currentClubs) {
        // validate the form
        let error = false;
        if(finalAttributes.length == 0){
            error = true
            // console.log('pop')
        }
        if(hours == ''){
            error = true
            // console.log('pop1')
        }
        if(clubSize == ''){
            error = true
            // console.log('pop2')
        }
        if(selectedClubTimes == ''){
            error = true
            // console.log('pop3')
        }
        if(firstMajor == ''){
            error = true
            // console.log('pop4')
        }
        if(currentClubs.length == 0){
            error = true
            // console.log('pop5')
        }
        if(error){
            Toast.show({
                text1: 'Enter valid inputs for all the attributes',
                autohide: true,
                visibilityTime: 4000,
                type: 'error'
              });
              return true
        }
        else {
            Toast.show({
                text1: 'Please check email for account verification link',
                autohide: true,
                visibilityTime: 8000,
            });
            return false
        }
    }
    const handleFinish =  async () => {
        // handle when the component is submitted
        var finAttributes = []
        attributes.forEach(attribute => {
            if(!selectedAttributes[attributes.indexOf(attribute)]){
                finAttributes.push(attribute.toLowerCase())
            }
        })

        setFinalAttributes(finAttributes)

        // handle the major process to make it a list
        var maj = getMajors()
        var ct = getClubTimes()
        // console.log(maj)
        // setCurrentClubs(clubs)
        setFrequency(ct[0])
        setMajorsList(maj)
        // console.log(majorsList)
        //userId = userID
        console.log(school)
        let invalid = handleValidation(finAttributes, maj)
        if(!invalid) {
            console.log(majorsList)
           //  navigation.navigate('Swiping', { email: userEmail, id: userID })
           navigation.navigate('Dashboard', { email: userEmail, id: userID, reload: false})
        }
        // navigation.navigate("Dashboard", {email: userEmail, id: userID, reload: false})
    }

    function getMajors() {
        // parse the data for their majors
        var maj = [firstMajor]
        if(secondMajor != '') {
            maj.push(secondMajor)
        }
        return maj
    }

    function getClubTimes() {
        // parse the data for their current clubs
        var clubs = []
        clubTimes.forEach(clubTime => {
            if(!selectedClubTimes[clubTimes.indexOf(clubTime)]){
                clubs.push(clubTime.toLowerCase())
            }
        })
        return clubs
    }
    const greeting = `Welcome! Please answer these questions so we can give you better recommendations:`
    return(
        <Container>
            <SafeAreaView>
            <ScrollView>
            <View styles={styles.container}>
                <View>
                    <Image source={Lion} style={styles.schoolImage}/>
                </View>
                <Text style={styles.welcomeText}>{greeting}</Text>
                <Text style={styles.questionText}>Which of these club categories appeal to you?</Text>
                        <Text style={styles.subtleText} >Select any number</Text>
                        <View style={styles.attributes}>
                            {attributes.map((attribute) =>
                                <TouchableHighlight key={attribute.name} onPress={() => handlePress(attribute)} style={[styles.button, { backgroundColor: colors[attributes.indexOf(attribute)] }]} underlayColor={'#00058f'}>
                                    <Text style={styles.attributeText}>{attribute}</Text>
                                </TouchableHighlight>)}
                        </View>
                        <Text style={styles.questionText}>What undergraduate school are you in?</Text>
                        <DropDownPicker items={[
                                { label: 'CC', value: "CC" },
                                { label: 'SEAS', value: "SEAS" },
                                { label: 'GS', value: "GS" },
                                { label: 'Barnard', value: "Barnard" },
                            ]}
                                showArrow={true}
                                placeholder={'Please Select an Option'}
                                style={styles.dropdown}
                                dropDownStyle={styles.dropdownOption}
                                selectedLabelStyle={styles.activeLabel}
                                itemStyle={{
                                    justifyContent: 'flex-start',
                                    backgroundColor: 'white',
                                    color: 'white'
                                }}
                                labelStyle={styles.labels}
                                onChangeItem={item => setSchool(item.value)}
                            />
                        <Text style={styles.questionText}>Generally, how many hours are you planning to spend on each club?</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ paddingTop: 17, fontSize: 20, marginLeft: 30}}>0</Text>
                            <Slider
                                style={{ width: 200, height: 40, marginLeft: 10, marginTop: 10 }}
                                minimumValue={0}
                                maximumValue={10}
                                minimumTrackTintColor="#00058f"
                                maximumTrackTintColor="#c9c9c7"
                                onValueChange={(value) => setHours(`${value}`)}
                            />
                            <Text style={{paddingTop: 17, fontSize: 20, marginLeft: 10}}>10+</Text>
                        </View>
                <Text style={styles.questionText}>What size club are you most interested in joining?</Text>
                <DropDownPicker items={[
                    {label: 'Small', value: "small"},
                    {label: 'Medium', value: "medium"},
                    {label: 'Large', value: "large"},
                    {label: 'Giant', value: "giant"},
                ]}
                showArrow={true}
                placeholder={'Please Select an Option'}
                style={styles.dropdown}
                dropDownStyle={styles.dropdownOption}
                selectedLabelStyle={styles.activeLabel}
                itemStyle={{
                    justifyContent: 'flex-start',
                }}
                 labelStyle={styles.labels}
                 onChangeItem={item => setClubSize(item.value)}
                />
                <Text style={styles.questionText}>How frequent do you want the ideal club to meeet?</Text>
                <View style={styles.attributes}>
                {clubTimes.map((clubTime) =>
                         <TouchableHighlight key={clubTime.name} onPress={() => handleClubTime(clubTime)} style={[styles.button, {backgroundColor: clubTimesColors[clubTimes.indexOf(clubTime)]} ]} underlayColor={'#00058f'}>
                            <Text style={styles.attributeText}>{clubTime}</Text>
                    </TouchableHighlight> )}
                </View>
                <Text style={styles.questionText}>What do you plan to major in?</Text>
                <TextInput style={{ height: 45, width: 250, marginLeft: 30, marginTop: 10, fontSize: 19,  padding: 10, borderRadius: 5, borderColor: '#c9c9c7', borderWidth: 2}} placeholder="Enter your major here" placeholderTextColor='#c9c9c7' onChangeText={value => setFirstMajor(value)}/>
                <Text style={styles.questionText}>If you have a second major, enter it below</Text>
                <TextInput style={{ height: 45, width: 250, marginLeft: 30, marginTop: 10, fontSize: 19,  padding: 10, borderRadius: 5, borderColor: '#c9c9c7', borderWidth: 2}} placeholder="Enter second major here" placeholderTextColor='#c9c9c7' onChangeText={value => setSecondMajor(value)}/>
                <Button style={styles.finishedButton} onPress={handleFinish}>
                    <Text style={styles.finishedText}>I'M DONE</Text>
                </Button>
            </View>
            </ScrollView>
            </SafeAreaView>
        </Container>
    )
}


// define reusable styles for the class
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 20,
        marginRight: 50,
        marginLeft: 30,
        marginTop: 20,
        textAlign: 'left'
    },
    questionText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#00334d',
        marginLeft: 30,
        marginRight: 60,
        marginTop: 20,
    },
    subtleText: {
        fontStyle: 'italic',
        color: 'grey',
        fontWeight: '400',
        fontSize: 18,
        textAlign: 'left',
        marginLeft: 30,
        marginTop: 5,
        marginBottom: 5,
    },
    attributeText: {
        color: 'white',
        fontSize: 15
    },
    button: {
        alignItems: "center",
        padding: 10,
        marginLeft: 6,
        marginTop: 10,
        alignSelf:"flex-start",
    },
    attributes: {
        textAlign: 'left',
        marginLeft: 24,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    dropdown: {
        height: 40,
        width: 250,
        textAlign: 'left',
        marginLeft: 30,
        marginTop: 10,
        shadowColor: 'grey',
        backgroundColor: 'white',
        color: 'white',
        shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowRadius: 2,
        shadowOpacity: 0.8,
    },
    dropdownOption: {
            height: "auto",
            width: 250,
            textAlign: 'left',
            marginLeft: 30,
            marginTop: 10,
            backgroundColor: 'white',
            color: 'black',
            shadowColor: 'grey',
            shadowOffset: {
              width: 1,
              height: 1,
            },
            shadowRadius: 2,
            shadowOpacity: 0.8,
        },
    labels: {
        color: 'grey',
        backgroundColor: 'white',
        fontSize: 20
    },
    activeLabel: {
        color: '#00058f',
        borderColor: '#00058f',
        backgroundColor: 'white'
    },
    finishedText: {
        color: 'white',
        fontSize: 22,
    },
    finishedButton: {
        alignItems: "center",
        justifyContent: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#00058f',
        marginLeft: 30,
        width: 150,
        height: 60,
        marginTop: 25,
    },
    overlayLabel: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderWidth: 2,
        borderRadius: 10,
    },

    overlayLabelText: {
        fontSize: 25,
        textAlign: 'center',
    },

    schoolImage: {
        justifyContent: 'flex-end',
        width: 25,
        height:30,
        marginLeft: 30
    },

    dropdownView: {
        position: "relative",
        backgroundColor: 'white'
    }
})