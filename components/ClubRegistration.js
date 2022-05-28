import React, {useState, useEffect} from 'react'
import {StyleSheet, Text, View, TouchableHighlight, Image, TextInput, SafeAreaView, ScrollView} from 'react-native'
import {Container, Button} from 'native-base'
import DropDownPicker from 'react-native-dropdown-picker';
import Lion from '../assets/lion.png'
import Toast from 'react-native-toast-message';
import { AsyncStorage } from 'react-native';
import Slider from '@react-native-community/slider';

export default function ClubRegistration({navigation, route}) {
    // values for attribute selection
    const [selectedAttributes, setSelectedAttributes] = React.useState([true, true, true, true,
        true, true, true, true, true, true])
    const [finalAttributes, setFinalAttributes] = React.useState([])

    // all the data necessary for registering a club is here
    const attributes = ["STEM", "FINANCE", "POLISCI", "ACTIVISM", "VOLUNTEERING", "EVENTS", "PUBLICATION", "PRE-PROFESSIONAL", "PERFORMING ARTS", "ENTREPRENEURSHIP"]
    const [clubRepEmail, setClubRepEmail] = React.useState('')
    const [hours, setHours] = React.useState(0.0)
    const [faculty, setFaculty] = React.useState('')
    const [clubBlurb, setClubBlurb] = React.useState('')
    const [clubSize, setClubSize] = React.useState('')
    const clubSizes = ['small', 'medium', 'large', 'giant']
    const [frequency, setFrequency] = React.useState('')
    const clubTimes = ["BIWEEKLY", "WEEKLY", "MONTHLY"]
    const [clubCharacteristics, setClubCharacteristics] = React.useState('')
    const [clubTimesColors, setClubTimesColors] = React.useState(['#c9c9c7', '#c9c9c7', '#c9c9c7'])
    const [selectedClubTimes, setClubTimes] = React.useState([true, true, true])
    const [clubWebsite, setClubWebsite] = React.useState('')
    const [loading, setLoading] = React.useState(true)
    const [toastRemind, setToastRemind] = React.useState(true)
    const [color, setBackgroundColor] = React.useState('#c9c9c7')
    const [colors, setBackgroundColors] = React.useState(['#c9c9c7', '#c9c9c7', '#c9c9c7', '#c9c9c7', '#c9c9c7', '#c9c9c7', '#c9c9c7', '#c9c9c7',
     '#c9c9c7', '#c9c9c7'])
    const {clubName, clubEmail, clubID} = route.params

    useEffect(() => {
       if(loading) {
            setLoading(false)
        }
        else {
            sendData()
            //store user email and id locally
            async function _storeData () {
                try {
                  await AsyncStorage.setItem(
                    'id',
                    clubID
                  );
                  await AsyncStorage.setItem(
                      'email',
                      clubEmail
                  )
                } catch (error) {
                  console.log(error)
                }
              };
              _storeData()
        }
    }, [finalAttributes, clubBlurb]
    )

    //store user data in database
    const sendData = async () => {
        let facultyList = getClubFaculty()
        let characteristicsList = getCharacteristics()
        let input = {
            name: clubName,
            id: clubID,
            blurb: clubBlurb,
            club_category: finalAttributes,
            assoc_faculty: facultyList,
            club_size: clubSize,
            misc_characteristics: characteristicsList,
            time_commitment: hours,
            meeting_freq: frequency,
            //club_website: clubWebsite
            //club_email: clubEmail
            //clubRepEmail: clubRepEmail
        }
        console.log(input)
        try {
            let response = await fetch("https://agnv7bqfra.execute-api.us-east-2.amazonaws.com/production/accountmanagement", {
                method: "PATCH",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(input)
            })
            let json = await response.json()
            console.log(json)
            console.log(clubID + 'id')
        }
        catch (error) {
            console.log('error ' + error)
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
        // validate the form, error checking for user input
        let error = false;
        let invalid = false;
        if(finalAttributes.length == 0){
            error = true
        }
        if(hours == ''){
            error = true
        }
        if(clubSize == ''){
            error = true
        }
        if(selectedClubTimes == ''){
            error = true
        }
        if (clubRepEmail == '' || clubRepEmail.indexOf("@") < 0 || clubRepEmail.indexOf(".") < 0) {
            Toast.show({
                text1: 'Please enter valid email address',
                autohide: true,
                visibilityTime: 4000,
                type: 'error'
            });
            invalid = true
        }
        if (clubWebsite != '' && clubWebsite.indexOf(".") < 0) {
            Toast.show({
                text1: 'Please enter valid website URL',
                autohide: true,
                visibilityTime: 4000,
                type: 'error'
            });
            invalid = true
        }
        if (clubBlurb == '') {
            error = true
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
        if(invalid) {
            return true;
        }
        else if (!invalid){
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

        var ct = getClubTimes()
        setFrequency(ct[0])
        let invalid = handleValidation(finAttributes)
        if(!invalid) {
           navigation.navigate('ClubProfile', { email: clubEmail, id: clubID, reload: false})
        }
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

    function getClubFaculty() {
        //parse data for faculty names
        var facultyList = []
        let names = faculty.split(',')
        names.forEach(name => {
            facultyList.push(name)
        })
        return facultyList
    }

    function getCharacteristics() {
        //parse data for misc characteristics
        var charList = []
        let characteristics = clubCharacteristics.split(',')
        characteristics.forEach(char => {
            charList.push(char)
        })
        return charList
    }

    const greeting = `Welcome! Please answer these questions so we can present students with information about your club:`
    return(
        <Container>
            <SafeAreaView>
            <ScrollView>
            <View styles={styles.container}>
                <View>
                    <Image source={Lion} style={styles.schoolImage}/>
                </View>
                <Text style={styles.welcomeText}>{greeting}</Text>
                <Text style={styles.questionText}>Which categories does your club belong to?</Text>
                        <Text style={styles.subtleText} >Select any number</Text>
                        <View style={styles.attributes}>
                            {attributes.map((attribute) =>
                                <TouchableHighlight key={attribute.name} onPress={() => handlePress(attribute)} style={[styles.button, { backgroundColor: colors[attributes.indexOf(attribute)] }]} underlayColor={'#00058f'}>
                                    <Text style={styles.attributeText}>{attribute}</Text>
                                </TouchableHighlight>)}
                        </View>

                        <Text style={styles.questionText}>Generally, what is the weekly time commitment for your club in hours?</Text>
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
                <Text style={styles.questionText}>What is the club size?</Text>
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
                <Text style={styles.questionText}>How frequently does the club meet?</Text>
                <View style={styles.attributes}>
                {clubTimes.map((clubTime) =>
                         <TouchableHighlight key={clubTime.name} onPress={() => handleClubTime(clubTime)} style={[styles.button, {backgroundColor: clubTimesColors[clubTimes.indexOf(clubTime)]} ]} underlayColor={'#00058f'}>
                            <Text style={styles.attributeText}>{clubTime}</Text>
                    </TouchableHighlight> )}
                </View>
                <Text style={styles.questionText}>Please list the names of the associated faculty if there are any.
                    <Text style={{textAlign: 'left', color: '#00334d', fontSize: 16, marginLeft: 30, marginRight: 60}}> (Use commas to separate faculty names. Include first and last names.)</Text>
                </Text>
                <TextInput style={{ height: 45, width: 250, marginLeft: 30, marginTop: 10, fontSize: 19,  padding: 10, borderRadius: 5, borderColor: '#c9c9c7', borderWidth: 2}} placeholder="Enter faculty names here" placeholderTextColor='#c9c9c7' onChangeText={value => setFaculty(value)}/>
                <Text style={styles.questionText}>Please describe your club in a sentence.</Text>
                <TextInput style={{ height: 45, width: 250, marginLeft: 30, marginTop: 10, fontSize: 19,  padding: 10, borderRadius: 5, borderColor: '#c9c9c7', borderWidth: 2}} placeholder="Enter club description here" placeholderTextColor='#c9c9c7' onChangeText={value => setClubBlurb(value)}/>
                <Text style={styles.questionText}>What is the club website? </Text>
                <TextInput style={{ height: 45, width: 250, marginLeft: 30, marginTop: 10, fontSize: 19,  padding: 10, borderRadius: 5, borderColor: '#c9c9c7', borderWidth: 2}} placeholder="Enter club website here" placeholderTextColor='#c9c9c7' onChangeText={value => setClubWebsite(value)}/>
                <Text style={styles.questionText}>Who can students email to receive more information about the club?</Text>
                <TextInput style={{ height: 45, width: 250, marginLeft: 30, marginTop: 10, fontSize: 19,  padding: 10, borderRadius: 5, borderColor: '#c9c9c7', borderWidth: 2}} placeholder="Enter email contact here" placeholderTextColor='#c9c9c7' onChangeText={value => setClubRepEmail(value)}/>
                <Text style={styles.questionText}>Are there any other characteristics about your club that you would like to share?
                    <Text style={{textAlign: 'left', color: '#00334d', fontSize: 16, marginLeft: 30, marginRight: 60}}>(Separate phrases/words with commas.)</Text>
                </Text>
               <TextInput style={{ height: 45, width: 250, marginLeft: 30, marginTop: 10, fontSize: 19,  padding: 10, borderRadius: 5, borderColor: '#c9c9c7', borderWidth: 2}} placeholder="Enter characteristics here" placeholderTextColor='#c9c9c7' onChangeText={value => setClubCharacteristics(value)}/>

               <Button style={styles.finishedButton} onPress={handleFinish}>
                   <Text style={styles.finishedText}>I'M DONE</Text>
               </Button>
            </View>
            </ScrollView>
            </SafeAreaView>
        </Container>
    )
}

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