import React, { useState, useEffect} from 'react'
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableHighlight, TextInput, ScrollView } from 'react-native'
import DPILogo from '../assets/dpiLogo.png'
import ClubSwipe from '../assets/clubSwipeLogoBlue.png'
export default EditStudentProfile = ({navigation, route}) => {

    const {student} = route.params
    const [studentMajor, setStudentMajor] = useState(`${student.majors}`)
    const [clubCategory, setClubCategory] = useState(`${student.club_category}`)
    const [miscCharacteristics, setMiscCharacteristics] = useState(`${student.misc_pref}`)
    const [timeCommitment, setTimeCommitment] = useState(`${student.time_commitment}`)
    const [clubSize, setClubSize] = useState(`${student.club_size}`)
    const [clubFreq, setClubFreq] = useState(`${student.meeting_freq}`)
    const [misc_char, setMisc_char] = useState(`${student.misc_char}`)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (loading) {
            console.log("EDIT");
            console.log(student);
            setLoading(false);
        }
    })
    async function updateStudent(input) {
        try {
            console.log("input: ", input);
            let str = JSON.stringify(input)
            console.log("str: ",str);
            let response = await fetch('https://jskznf9rxa.execute-api.us-east-2.amazonaws.com/production/accountmanagement', {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(input)
                })
                let json = await response.json()
                console.log("RESPONSE", json)
        }
        catch (error) {
            console.log(error);
        }
    }

    async function prepareUpdate() {
    /*try {
        var misc_char = miscCharacteristics.split(",");
        if (miscCharacteristics == '')
            misc_char = [];
        var clubCat = clubCategory.split(",");
        var majorsCat = studentMajor.split(",");
    }
    catch(error) {
        console.log(error)
    }*/
    var attName;
    var attVal;
        for (var i = 0; i < 5; i++) {
            if (i == 0) {
                attName = "club_category";
                attVal = clubCategory;
            }
            else if (i == 1) {
                attName = "majors";
                attVal = studentMajor;
            }
            else if (i == 2) {
                attName = "time_commitment";
                attVal = timeCommitment;
            }
            else if (i == 3) {
                attName = "meeting_freq";
                attVal = clubFreq;
            }
            else {
                attName = "misc_pref";
                attVal = misc_char;
            }
            let input = {
                keyValue: {
                    id: student.id
                },
                attributeName: attName,
                attributeValue: attVal
            }
            updateStudent(input);
        }
    }

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
                        <Image style={styles.logo} source={ClubSwipe} />
                        <Image style={styles.logo} source={DPILogo} />
                        <Text style={[styles.headerText, {paddingLeft: 10, color: '#022169', fontSize: 30}]}>Clubswipe</Text>
                    </View>
                    <ScrollView>
                    <Image style={styles.image} source={ClubSwipe} />

                    <Text style={[styles.attribute, { fontSize: 35, marginTop: '2%', marginBottom: '2%' }]}>{student.first_name}</Text>

                    {student.majors != '' ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22, fontWeight: 'bold' }]}>Major: </Text>
                        <TextInput style={styles.textInputStyle}  value={studentMajor} placeholderTextColor='#c9c9c7' onChangeText={(value) => setStudentMajor(value)} />
                    </View> : <View></View>}

                    {student.club_category != '' ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22, fontWeight: 'bold' }]}>Club Category: </Text>
                        <TextInput style={styles.textInputStyle}  value={clubCategory} placeholderTextColor='#c9c9c7' onChangeText={(value) => setClubCategory(value)} />
                    </View> : <View></View>}

                    {student.club_size != '' ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22, fontWeight: 'bold' }]}>Club Size: </Text>
                        <TextInput style={styles.textInputStyle}  value={clubSize} placeholderTextColor='#c9c9c7' onChangeText={(value) => setClubSize(value)} />
                    </View> : <View></View>}

                    {student.meeting_freq != '' ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22, fontWeight: 'bold' }]}>Meeting Frequency: </Text>
                        <TextInput style={styles.textInputStyle}  value={clubFreq} placeholderTextColor='#c9c9c7' onChangeText={(value) => setClubFreq(value)} />
                    </View> : <View></View>}

                    {student.time_commitment != '' ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22, fontWeight: 'bold' }]}>Time Commitment (hrs): </Text>
                        <TextInput style={styles.textInputStyle}  value={timeCommitment} placeholderTextColor='#c9c9c7' onChangeText={(value) => setTimeCommitment(value)} />
                    </View> : <View></View>}

                    {student.misc_pref != '' && student.misc_pref != null && student.misc_pref != 'undefined' ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22, fontWeight: 'bold' }]}>Miscellaneous Preferences: </Text>
                        <TextInput style={styles.textInputStyle}  value={miscCharacteristics} placeholderTextColor='#c9c9c7' onChangeText={(value) => setMiscCharacteristics(value)} />
                    </View>
                    :
                    <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22, fontWeight: 'bold' }]}>Miscellaneous Preferences: </Text>
                        <TextInput style={styles.textInputStyle} value={""} placeholderTextColor='#c9c9c7' onChangeText={(value) => setMiscCharacteristics(value)} />
                    </View>
                    }

                    <View style={{ flexDirection:"row", alignSelf: 'center' }}>
                        <TouchableHighlight style={{ backgroundColor: '#022169', borderRadius: 5, width: '40%', margin: '3%'}} onPress={prepareUpdate}>
                            <Text style={{color: 'white', fontSize: 25, textAlign: 'center'}}>Save Profile</Text>
                        </TouchableHighlight>

                        <TouchableHighlight style={{backgroundColor: '#022169', borderRadius: 5, width: '40%', margin: '3%'}} onPress={() => navigation.navigate('StudentProfile', { email: student.email, id: student.id, firstName: student.first_name, reload: true})}>
                            <Text style={{color: 'white', fontSize: 25, textAlign: 'center'}}>Back</Text>
                        </TouchableHighlight>
                    </View>
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