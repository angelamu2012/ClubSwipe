import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, FlatList, ImageBackground, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';
import { name, email } from './Welcome';
import Lion from '../assets/lion.png'
import Swiping from './swiping'
import StudentProfile from './studentProfile'
import DPILogo from '../assets/dpiLogo.png'
import {Header, Colors} from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import ClubSwipe from '../assets/clubSwipeLogoBlue.png'
import { AsyncStorage } from 'react-native';
import {Auth} from 'aws-amplify';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { CSVLink, CSVDownload } from "react-csv";

const CARD_RADIUS = 8;

const ClubDashboard = ({navigation, route}) => {

    const [studentData, setStudentData] = useState([]);
    const [load, setLoad] = useState(true);

    //store data of matched students
    const matchedStudentJSON = [
        {
            first_name: 'Student',
            last_name: 'Name',
            id: '',
            school: 'SEAS',
            email: 'email@gmail.com',
            majors: 'Computer Science',
            club_category: ['ECONOMICS', 'POLITICAL'],
            time_commitment: 0,
            club_size: 'Large',
            current_clubs: '',
            meeting_freq: 'Weekly',
            misc_pref: [],
            matched_clubs: ['Club 1'],
            subscribed_club: []
        },
        {
            first_name: 'Student',
            last_name: 'Name',
            id: '',
            school: 'SEAS',
            email: 'email@gmail.com',
            majors: 'Computer Science',
            club_category: ['ECONOMICS', 'POLITICAL'],
            time_commitment: 0,
            club_size: 'Large',
            current_clubs: '',
            meeting_freq: 'Weekly',
            misc_pref: [],
            matched_clubs: ['Club 1'],
            subscribed_club: []
        },
        {
            first_name: 'Student',
            last_name: 'Name',
            id: '',
            school: 'SEAS',
            email: 'email@gmail.com',
            majors: 'Computer Science',
            club_category: ['ECONOMICS', 'POLITICAL'],
            time_commitment: 0,
            club_size: 'Large',
            current_clubs: '',
            meeting_freq: 'Weekly',
            misc_pref: [],
            matched_clubs: ['Club 1'],
            subscribed_club: []
        },
    ]

    const csvHeaders = [
        {label: 'First Name', key: 'first_name' },
        {label: 'Last Name', key: 'last_name' },
        {label: 'Email', key: 'email' },
        {label: 'School', key: 'school' },
        {label: 'Majors', key: 'majors' },
    ]

    const [match, setMatch] = useState ({
        first_name: 'Student',
        last_name: 'Name',
        id: '',
        school: 'SEAS',
        email: 'email@gmail.com',
        majors: 'Computer Science',
        club_category: ['ECONOMICS', 'POLITICAL'],
        time_commitment: 0,
        club_size: 'Large',
        current_clubs: '',
        meeting_freq: 'Weekly',
        misc_pref: [],
        matched_clubs: ['Club 1'],
        subscribed_club: []
    })

    //retrieve data upon page load
    useEffect (() => {
        if (load) {
            //retrieveMatches();
            setLoad(false);
        }
    })

    //retrieve matched students
    async function retrieveMatches() {
        try {
            let response = await fetch(API_ENDPOINT_CLUB, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: single_club
                })
            })
            let json = await response.json();
            matchedStudentJSON.push(json);
            setStudentData(matchedStudentJSON)
        }
        catch (err) {
            console.log(err);
        }
    }

    //render dynamic component
    const Item = ({ firstName, lastName, school, majors}) => (
        <View>
            <Text style={styles.studentName}>{firstName} {lastName} </Text>
            <Text style={styles.defaultText}>{school}, {majors} </Text>
        </View>
    );

return (
    <View style={{ backgroundColor:'#022169', flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
            <ScrollView style={{ height: "88%", backgroundColor: 'white' }}>
                <View style={styles.myClubsHeader}>
                    <View style={{flexDirection: 'row' }}>
                        <Image style={styles.logo} source={ClubSwipe} />
                        <Image style={styles.logo} source={DPILogo} />
                        <Text style={[styles.headerText, {paddingLeft: 10, color: '#022169', fontSize: 30}]}>ClubSwipe</Text>
                    </View>

                    <Text style={styles.defaultText2}>View your matched students below.</Text>
                </View>

                <Text style={[styles.defaultText, {textAlign: 'right', paddingRight: 30, paddingTop: 20}]}> Export as .CSV </Text>
                <Text style={styles.sectionTitle}> Matches </Text>

                {matchedStudentJSON.map(student =>
                    <Item firstName={student.first_name} lastName={student.last_name} school={student.school} majors={student.majors} />
                )}

            </ScrollView>
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
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  logo: {
    width: 35,
    height: 40,
    margin: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#022169",
    paddingLeft: 25,
  },
  studentName: {
    color: "#022169",
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 30,
    paddingTop: 10
  },
  defaultText: {
    color: "#022169",
    fontSize: 16,
    paddingLeft: 30,
  },
  defaultText2: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    padding: 5
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: 'center'
  },
  myClubsHeader: {
    backgroundColor: "#78b3e0",
  },
});

export default ClubDashboard;