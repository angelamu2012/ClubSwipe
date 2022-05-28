import React, { useState, useEffect} from 'react'
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableHighlight, ScrollView } from 'react-native'
import DPILogo from '../assets/dpiLogo.png'
import ClubSwipe from '../assets/clubSwipeLogoBlue.png'
import {Auth} from 'aws-amplify';
import { AsyncStorage } from 'react-native';
import EditStudentProfile from './editStudentProfile';

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => ++value); // update the state to force render
}

export default StudentProfile = ({navigation, route}) => {

    const { email, id, firstName, reload } = route.params
    const [student, setStudent] = useState([]);
    const [clubCategory, setClubCategory] = useState('');
    const [majors, setMajors] = useState('');
    const [loading, setLoading] = useState(true);
    const [reloadTrue, setReloadTrue] = useState(true);
    const forceUpdate = useForceUpdate()

    useEffect(() => {
        console.log("isloading: " + loading + ", reload: " + reload + ", reloadTrue: " + reloadTrue);
        if (loading) {
            getStudent();
            setLoading(false);
        }
        if (reloadTrue && reload) {
            console.log("reload");
            getStudent();
            setReloadTrue(false)
        }
    },[student, reloadTrue, loading]);

    //retrieve student info
    async function getStudent(){
        try {
            let input = {
                keyValue: {
                    id: id,
                }
            }
            let response = await fetch('https://jskznf9rxa.execute-api.us-east-2.amazonaws.com/production/accountretrieval', {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(input),
            })
            let json = await response.json();
            setStudent(json);
            setClubCategory(arrayToString(json.club_category))
            setMajors(arrayToString(json.majors))
        }
        catch (error) {
            console.log(error);
        }
    }

    //format array and display as string
    function arrayToString(array) {
        let cs = ''
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
            <ScrollView>
                <View style={{ backgroundColor: 'white', height: '100%'}}>
                    <View style={styles.myClubsHeader}>
                        <Image style={styles.logo} source={ClubSwipe} />
                        <Image style={styles.logo} source={DPILogo}  />
                        <Text style={[styles.headerText, {paddingLeft: 10, color: '#022169', fontSize: 30}]}>Clubswipe</Text>
                    </View>

                    <Image style={styles.image} source={ClubSwipe} />
                    <Text style={[styles.attribute, { fontSize: 35, marginTop: '2%', marginBottom: '2%' }]}>{student.first_name}</Text>

                    {student.majors != '' ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22, fontWeight: 'bold' }]}>Major: </Text>
                        <Text style={[styles.attribute, { fontSize: 22 }]}>{majors}</Text>
                    </View> : <View></View>}

                    {student.club_category != '' ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22, fontWeight: 'bold' }]}>Club Category: </Text>
                        <Text style={[styles.attribute, { fontSize: 22 }]}>{clubCategory}</Text>
                    </View> : <View></View>}

                    {student.club_size != '' ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22, fontWeight: 'bold' }]}>Club Size: </Text>
                        <Text style={[styles.attribute, { fontSize: 22 }]}>{student.club_size}</Text>
                    </View> : <View></View>}

                    {student.meeting_freq != '' ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22, fontWeight: 'bold' }]}>Meeting Frequency: </Text>
                        <Text style={[styles.attribute, { fontSize: 22 }]}>{student.meeting_freq}</Text>
                    </View> : <View></View>}

                    {student.time_commitment != '' ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22, fontWeight: 'bold' }]}>Time Commitment: </Text>
                        <Text style={[styles.attribute, { fontSize: 22 }]}>{parseFloat(student.time_commitment).toFixed(0)} hours</Text>
                    </View> : <View></View>}

                    {student.misc_char != '' && student.misc_char != null ? <View style={styles.rowStyle}>
                        <Text style={[styles.profileAttribute, { fontSize: 22, fontWeight: 'bold' }]}>Miscellaneous Preferences: </Text>
                        <Text style={[styles.attribute, { fontSize: 22 }]}>{student.misc_char}</Text>
                    </View> : <View></View>}

                    <TouchableHighlight style={{alignSelf: 'center', justifyContent: 'center', backgroundColor: '#022169', borderRadius: 5, width: '80%', height: '6%', marginTop: '3%', marginBottom: '3%'}} onPress={() => navigation.navigate('EditStudentProfile', { student: student})}>
                        <Text style={{color: 'white', fontSize: 25, alignSelf: 'center', textAlignVertical: 'center'}}>Edit Profile</Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>
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
        marginRight: '10%',
        flexWrap: 'wrap'
    }
})