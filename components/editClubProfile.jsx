import React, { useState, useEffect} from 'react'
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableHighlight, TextInput, ScrollView } from 'react-native'
import DPILogo from '../assets/dpiLogo.png'
import ClubSwipe from '../assets/clubSwipeLogoBlue.png'
export default EditClubProfile = ({navigation, route}) => {

    const {club} = route.params
    const [clubString, setClubString] = useState('')
    const [associatedFaculty, setAssociatedFaculty] = useState('')
    const [miscCharacteristics, setMiscCharacteristics] = useState('')

    const [name, setName] = useState(`${club.name}`)
    const [blurb, setBlurb] = useState(`${club.blurb}`)
    const [timeCommitment, setTimeCommitment] = useState(`${club.time_commitment}`)
    const [clubSize, setClubSize] = useState(`${club.club_size}`)
    const [meetingFrequency, setMeetingFrequency] = useState(`${club.meeting_freq}`)
    const[loading, setLoading] = useState(true)
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

        if (loading) {
            // set all the arrays in the club db to a readable string
            setClubString(arrayToString(club.club_category))
            setAssociatedFaculty(arrayToString(club.assoc_faculty))
            setMiscCharacteristics(arrayToString(club.misc_characteristics))
            setLoading(false)
        }


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
    return (
        <View style={{ backgroundColor: '#022169', flex: 1 }}>
            <SafeAreaView >
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
                    <ScrollView>
                    <Image style={styles.image} source={ClubSwipe} />
                    <Text style={[styles.attribute, { fontSize: 35, marginTop: '2%' }]}>{club.name}</Text>
                    {club.club_category.length != 0 ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22 }]}>Category: </Text>
                        <TextInput style={styles.textInputStyle}  value={clubString} placeholderTextColor='#c9c9c7' onChange={(value) => setClubString(value)} />
                    </View> : <View></View>}
                    <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22 }]}>Time Committment: </Text>
                        <TextInput style={styles.textInputStyle} value={timeCommitment} placeholder="Enter your major here" placeholderTextColor='#c9c9c7' onChange={(value) => setTimeCommitment(value)} />
                    </View>
                    {club.assoc_faculty.length > 0 ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22,}]}>Assoc Faculty: </Text>
                        <TextInput style={styles.textInputStyle} value={associatedFaculty} placeholder="Enter your major here" placeholderTextColor='#c9c9c7' onChange={(value) => setAssociatedFaculty(value)} />
                    </View> : <View></View>}
                    {club.blurb != '' ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22 }]}>Blurb: </Text>
                        <TextInput style={styles.textInputStyle} value={blurb} placeholder="Enter your major here" placeholderTextColor='#c9c9c7' onChange={(value) => setBlurb(value)}/>
                    </View> : <View></View>}
                    {club.club_size != '' ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22 }]}>Club Size: </Text>
                        <TextInput style={styles.textInputStyle} value={clubSize}  placeholder="Enter your major here" placeholderTextColor='#c9c9c7'  onChange={(value) => setClubSize(value)}/>
                    </View> : <View></View>}
                    {club.meeting_freq != '' ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22 }]}>Meeting Frequency: </Text>
                        <TextInput style={styles.textInputStyle} value={meetingFrequency} placeholder="Enter your major here" placeholderTextColor='#c9c9c7' onChange={(value) => setMeetingFrequency(value)}/>
                    </View> : <View></View>}
                    {club.misc_characteristics.length != 0 ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22 }]}>Misc: </Text>
                        <TextInput style={styles.textInputStyle} value={miscCharacteristics} placeholder="Enter your major here" placeholderTextColor='#c9c9c7' onChange={(value) => setMiscCharacteristics(value)}/>
                    </View> : <View></View>}
                    <TouchableHighlight style={{alignSelf: 'center', justifyContent: 'center', backgroundColor: '#022169', borderRadius: 5, width: '80%', height: '6%', marginTop: '3%'}} onPress={() => navigation.navigate("ClubProfile")}>
                        <Text style={{color: 'white', fontSize: 25, alignSelf: 'center', textAlignVertical: 'center'}}>Save Profile</Text>
                    </TouchableHighlight>
                    </ScrollView>
                </View>
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
        marginTop: "5%"
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
        width: '50%'
    },
    rowStyle: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginLeft: '5%',
        flexWrap: 'wrap'
    },
    textInputStyle: {
        height: 40,
        width: '90%',
        fontSize: 19,
        paddingLeft: 10,
        borderRadius: 5,
        borderColor: '#c9c9c7',
        borderWidth: 2,
        color: '#022169'
    }
})