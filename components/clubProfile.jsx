import React, { useState, useEffect} from 'react'
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableHighlight, ScrollView } from 'react-native'
import DPILogo from '../assets/dpiLogo.png'
import ClubSwipe from '../assets/clubSwipeLogoBlue.png'
import {Auth} from 'aws-amplify';
import { AsyncStorage } from 'react-native';

export default ClubProfile = ({navigation, route}) => {

    const [club, setClub] = useState(
        {
            name: 'Clubswipe',
            id: '',
            club_category: ['ECONOMICS', 'POLITICAL'],
            time_commitment: 0,
            assoc_faculty: ['George Dragomir', 'Ivan Corwin'],
            blurb: 'A club that is cool',
            club_size: 'Large',
            meeting_freq: 'Weekly',
            misc_characteristics: []
        }
    )

    // const {id} = route.params
    const [clubString, setClubString] = useState('')
    const [associatedFaculty, setAssociatedFaculty] = useState('')
    const [miscCharacteristics, setMiscCharacteristics] = useState('')
    useEffect(() => {

        async function getClub(){
            fetch('https://agnv7bqfra.execute-api.us-east-2.amazonaws.com/production/accountretrieval', {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                id: id,
                attributeValue: 'name'
            })
        }

        // set all the arrays in the club db to a readable string
        setClubString(arrayToString(club.club_category))
        setAssociatedFaculty(arrayToString(club.assoc_faculty))
        setMiscCharacteristics(arrayToString(club.misc_characteristics))



        console.log('running')    
    })

    function arrayToString(array) {
        cs = ''
        array.forEach(index => {
            index = index.toLowerCase()
            index = index.substring(0,1).toUpperCase() + index.substring(1)
            cs += index
            cs += ', '
        })
        cs = cs.substring(0, cs.length - 2)
        return cs
    }

    async function signOut() {
          try {
              await Auth.signOut();
              AsyncStorage.removeItem('passwordToken');
              AsyncStorage.removeItem('emailToken');
              AsyncStorage.removeItem('id');
              AsyncStorage.removeItem('isClub')
              navigation.navigate("Start");
          } catch (error) {
              console.log('error signing out: ', error);
          }
      }
    return (
        <View style={{ backgroundColor: '#022169', flex: 1 }}>
            <SafeAreaView >
            <ScrollView>
                <View style={{ backgroundColor: 'white', height: '100%'}}>
                    <View style={styles.myClubsHeader}>
                        <Image
                            style={styles.logo}
                            source={ClubSwipe}
                        />
                        <Image
                            style={styles.logo}
                            source={DPILogo}
                        />
                        <Text style={[styles.headerText, {paddingLeft: 10, color: '#022169', fontSize: 30}]}>Clubswipe</Text>
                    </View>
                     <TouchableHighlight style={{alignSelf: 'center', justifyContent: 'center', backgroundColor: '#022169', borderRadius: 5, width: '40%', height: '6%', marginTop: '3%'}} onPress={signOut}>
                        <Text style={{color: 'white', fontSize: 20, alignSelf: 'center', textAlignVertical: 'center'}}> Sign Out </Text>
                     </TouchableHighlight>
                     <TouchableHighlight style={{alignSelf: 'center', justifyContent: 'center', backgroundColor: '#022169', borderRadius: 5, width: '40%', height: '6%', marginTop: '3%'}} onPress={() => navigation.navigate("ClubDashboard", { club: club})}>
                        <Text style={{color: 'white', fontSize: 20, alignSelf: 'center', textAlignVertical: 'center'}}> View Dashboard </Text>
                     </TouchableHighlight>
                    <Image style={styles.image} source={ClubSwipe} />
                    <Text style={[styles.attribute, { fontSize: 35, marginTop: '2%' }]}>{club.name}</Text>
                    {club.club_category.length != 0 ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22 }]}>Category: </Text>
                        <Text style={[styles.attribute, { fontSize: 22 }]}>{clubString}</Text>
                    </View> : <View></View>}
                    <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22 }]}>Time Committment: </Text>
                        <Text style={[styles.attribute, { fontSize: 22 }]}>{club.time_comittment}</Text>
                    </View>
                    {club.assoc_faculty.length > 0 ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22,}]}>Assoc Faculty: </Text>
                        <Text style={[styles.attribute, { fontSize: 22 }]}>{associatedFaculty}</Text>
                    </View> : <View></View>}
                    {club.blurb != '' ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22 }]}>Blurb: </Text>
                        <Text style={[styles.attribute, { fontSize: 22 }]}>{club.blurb}</Text>
                    </View> : <View></View>}
                    {club.club_size != '' ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22 }]}>Club Size: </Text>
                        <Text style={[styles.attribute, { fontSize: 22 }]}>{club.club_size}</Text>
                    </View> : <View></View>}
                    {club.meeting_freq != '' ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22 }]}>Meeting Frequency: </Text>
                        <Text style={[styles.attribute, { fontSize: 22 }]}>{club.meeting_freq}</Text>
                    </View> : <View></View>}
                    {club.misc_characteristics.length != 0 ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22 }]}>Blurb: </Text>
                        <Text style={[styles.attribute, { fontSize: 22 }]}>{club.blurb}</Text>
                    </View> : <View></View>}
                    <TouchableHighlight style={{alignSelf: 'center', justifyContent: 'center', backgroundColor: '#022169', borderRadius: 5, width: '80%', height: '6%', marginTop: '3%'}} onPress={() => navigation.navigate("EditClubProfile", { club: club})}>
                        <Text style={{color: 'white', fontSize: 25, alignSelf: 'center', textAlignVertical: 'center'}}>Edit Profile</Text>
                    </TouchableHighlight>
                </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    headerText: {
        color: 'black',
        fontSize: 17
    },
    myClubsHeader: {
        backgroundColor: "#78b3e0",
        flexDirection: 'row'
    },
    logo: {
        width: 35,
        height: 40,
        margin: 10,
        padding: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: 'center'
    },
    image: {
        width: 125,
        height: 125,
        borderColor:  "#78b3e0",
        borderWidth: 2,
        borderRadius: 75,
        alignSelf: 'center',
        marginTop: "15%"
    },
    attribute: {
        justifyContent: 'center',
        color: '#00334d',
        alignSelf: 'center',
        marginTop: '4%',
        marginLeft: '1%'
    },
    profileAttribute: {
        justifyContent: 'center',
        color: 'black',
        alignSelf: 'center',
        marginTop: '4%',

    },
    rowStyle: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginLeft: '10%',
        flexWrap: 'wrap'
    }
})