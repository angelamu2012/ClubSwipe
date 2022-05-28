import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, FlatList, ImageBackground, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';
import { name, email } from './Welcome';
import Lion from '../assets/lion.png'
import Swiping from './swiping'
import StudentProfile from './studentProfile'
import DPILogo from '../assets/dpiLogo.png'
import { Header, Colors } from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import ClubSwipe from '../assets/clubSwipeLogoBlue.png'
import { AsyncStorage } from 'react-native';
import {Auth} from 'aws-amplify';
import { TouchableHighlight } from 'react-native-gesture-handler';

const API_ENDPOINT = 'https://jskznf9rxa.execute-api.us-east-2.amazonaws.com/production/accountretrieval';
const API_ENDPOINT_CLUB = 'https://agnv7bqfra.execute-api.us-east-2.amazonaws.com/production/accountretrieval';
const API_ENDPOINT_QUERY = 'https://0ijbsiqauc.execute-api.us-east-2.amazonaws.com/production/basicsearch';
const API_ENDPOINT_IMAGE = 'https://agnv7bqfra.execute-api.us-east-2.amazonaws.com/production/imagemanagement';
const CARD_RADIUS = 8;

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => ++value); // update the state to force render
}

const Dashboard = ({ navigation, route }) => {
    const { userEmail, userID, first_name, reload, clubIds, bypassed } = route.params
    const [isLoading, setIsLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [loading, setLoading] = useState(true)
    const [finished, setFinished] = useState(false)
    const [isDataReturned, setIsDataReturned] = useState(false);
    const [query, setQuery] = React.useState("");
    const [clubImages, setClubImages] = useState([]);
    const [fullClubData, setFullClubData] = useState([]); //if query is empty, set clubData to fullClubData
    const [clubData, setClubData] = useState([]);
    var clubDataJSON = [] //store info for all clubs student is in
    const forceUpdate = useForceUpdate()
    const onChangeSearch = query => setQuery(query);
    let newClubs = []

    const Item = ({ clubName, clubDescription, item, itemID, category, freq, time, size, image}) => (
        <TouchableOpacity onPress={() => navigation.navigate("Club", { club: item, email: userEmail, id: userID, clubID: itemID, clubCategory: category, clubFreq: freq, clubTime: time, clubSize: size, clubImage: image })} >
        <View style={styles.cardWrapper}>
            <View style={styles.cardImageWrapper}>
                <Image source={{uri: image}} style={styles.cardImage} />
            </View>
            <View style={styles.cardTextWrapper}>
                <Text style={styles.headerText}> {clubName} </Text>
                <Text style={styles.clubDescriptionText}> {clubDescription} </Text>
            </View>
        </View>
        </TouchableOpacity>
    );

    useEffect(() => {
        const didAddClub = navigation.addListener('focus', e => {
            if (reload == true && bypassed != true) {
                reloadTrue()
            }
        })
        if (bypassed != true) {
            _retrieveData()
            setLoading(false)
            /*if (imageLoading) {
              handleReload();
              setImageLoading(false)
            }*/
            return didAddClub
        }
        else {
            setLoading(false)
        }
    }, [clubData, fullClubData, clubDataJSON, isDataReturned, clubImages, query, loading, imageLoading]);

    async function findClub() {
        newClubs = [...clubData]
        try {
            let response = await fetch(API_ENDPOINT_CLUB, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: clubId
                })
            })
            let json = await response.json();
            newClubs.push(json) //add newly swiped on clubs to newclubs
            setFullClubData(newClubs)
            setClubData(newClubs)
            setFinished(true)
            navigation.navigate("Swiping", { email: userEmail, id: userID })
            navigation.navigate("Dashboard", {userEmail: userEmail, userId: userID, reload: true, clubIds: []})
        }
        catch(error) {
          console.log(error)
        }
    }

    async function reloadTrue() {
        for await (const clubId of clubIds) {
            findClub()
        }
    }

    async function retrieveImages(userClubs) {
        // retrieve club image
        setLoading(true);
        setImageLoading(true);
        var userClubsIcon = [];
        for(var i = 0; i < userClubs.length; i++){
            userClubsIcon[i] = userClubs[i] + "/logo";
        }
        //userClubsIcon.reverse();
        let input = {
            object_name: userClubsIcon
        }
        await fetch(API_ENDPOINT_IMAGE, {
            method: 'POST',
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
            },
            body: JSON.stringify(input),
        }).then(response => response.json())
        .then(async (response) => {
            setClubImages(response.item);
            for (var i = 0; i < clubDataJSON.length; i++) {
                for (var j = 0; j < response.item.length; j++) {
                    if (clubDataJSON[i].id == userClubs[j])
                        clubDataJSON[i].image = response.item[j]  //add club images to userClubs
                }
            }
            handleReload();
        })
        .catch(err => {
            console.log(err);
        });
    }

    async function _retrieveData() {
        // retrieve the data for a user
        try {
            const asyncEmail = await AsyncStorage.getItem('email')
            fetchUserClubs(userID, asyncEmail)
        }
        catch (error) {
          // Error retrieving data
            console.log(error)
        }
    }

    const retrieveClubData = async (single_club, query) => {
        // retrieve the data for a specific club
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
            clubDataJSON.push(json);
            if (!query) {
                setFullClubData(clubDataJSON);
            }
        }
        catch (err) {
          console.log(err);
        }
    };

    async function fetchUserClubs(asyncId, asyncEmail) {
        // fetch all of the clubs a user is in
        let input = {
            keyValue: {
                id: asyncId,
            }
        }
        if (!isDataReturned) {
            setLoading(true);
            await fetch(API_ENDPOINT, {
            method: 'PUT',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(input),
            }).then(response => response.json())
            .then(async (response) => {
                clubDataJSON = [];
                for (var i = 0; i < response.current_clubs.length; i++) {
                    retrieveClubData(response.current_clubs[i], false); //retrieve information for each club
                }
                retrieveImages(response.current_clubs); //retrieve club images
                setClubData(clubDataJSON); //store club data into clubDataJSON
            })
            .catch(err => {
                console.log(err);
            });
            setIsDataReturned(true);
        }
    }

    const handleSearch = async (text) => {
        // handle the search query
        setQuery(text);
        if (text == "" || !text.replace(/\s/g, '').length) { //if no query input text, display all of the student's clubs
            setClubData(fullClubData);
        }
        else {
            try {
                const formattedQuery = text.toLowerCase(); //set query input text to lowercase letters
                setLoading(true);
                let response = await fetch(API_ENDPOINT_QUERY + "?query=" + text, {
                    method: 'GET',
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                })
                let json = await response.json();
                let queryIds = []
                for (var i = 0; i < json.results.length; i++) {
                    queryIds[i] = json.results[i].id; //retrieve ids for clubs that match query input
                }
                clubDataJSON = json.results;
                retrieveImages(queryIds); //retrieve images for queried clubs
                setClubData(clubDataJSON); //display only clubs that match query input
            }
            catch (err) {
                console.log(err);
            }
        }
    };

    async function signOut() {
        try {
            await Auth.signOut();
            //remove user info from local storage
            AsyncStorage.removeItem('passwordToken');
            AsyncStorage.removeItem('emailToken');
            AsyncStorage.removeItem('id');
            AsyncStorage.removeItem('isClub')

            navigation.navigate("Start");
        }
        catch (error) {
            console.log('error signing out: ', error);
        }
    }

    const handleReload = () => {
        navigation.navigate("Swiping", { email: userEmail, id: userID })
        navigation.navigate("Dashboard", {userEmail: userEmail, userId: userID, reload: true, clubIds: []})
    }

    return (
    <>
        <StatusBar barStyle="dark-content" />
        <View style={{ backgroundColor: !bypassed? '#022169': 'white', flex: 1 }}>
        <SafeAreaView>
            <ScrollView style={{ height: "88%", backgroundColor: 'white' }}>
            <View style={styles.myClubsHeader}>
                <View style={{flexDirection: 'row' }}>
                    <Image style={styles.logo} source={ClubSwipe} />
                    <Image style={styles.logo} source={DPILogo} />
                    <Text style={[styles.headerText, {paddingLeft: 10, color: '#022169', fontSize: 30}]}>ClubSwipe</Text>
                </View>

                <Text style={styles.defaultText2}>Get swiping or review your clubs below</Text>

                <View  style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
                  <TouchableOpacity style = {styles.buttonContainer} onPress = {signOut}>
                      <Text style = {styles.buttonText2}> Sign out </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style = {styles.buttonContainer} onPress={() => navigation.navigate('StudentProfile', { email: userEmail, id: userID, firstName: first_name, reload: false})}>
                      <Text style = {styles.buttonText2}> My Profile </Text>
                  </TouchableOpacity>
                </View>
            </View>
            <View style={{ flexDirection: 'row', paddingTop: "3%", marginLeft: "2%", marginRight: "2%" }}>
                <Text style={[styles.headerText, { textAlign: 'left', color: '#022169', fontSize: 30, paddingTop: "2%" }]}> My Clubs </Text>
                <Icon name='retweet' size={25} style={{paddingTop: '4%', paddingLeft: '2%', color: 'black'}} onPress={handleReload}/>

                <View style={{ marginLeft: "3%", width: "50%" }}>
                    <SearchBar
                        placeholder="Search all clubs"
                        onChangeText={queryText => handleSearch(queryText)}
                        value={query}
                        autoCapitalize="none"
                        containerStyle={{ padding: 0, margin: 0 }}
                        icon={{ type: 'font-awesome', name: 'search' }}
                        leftIconContainerStyle={{ padding: 0, margin: 0 }}
                        rightIconContainerStyle={{ padding: 0, margin: 0 }}
                        lightTheme={true}
                    />
                </View>

            </View>

            {(clubData.length == 0 && !loading)?
                <View style = {{alignItems: "center"}}>
                    <Text style = {styles.label}> Tap Start Swiping below to add clubs to your dashboard!</Text>
                </View>
                :
                <Text></Text>
            }

            {!loading? clubData.map(club =>
              <Item clubName={club.name} clubDescription={club.blurb} item={club} itemID={club.id} category={club.category} freq={club.meeting_freq} time={club.time_commitment} size={club.club_size} image={club.image}/>
            ): <ActivityIndicator size="large" color='blue' alignSelf='center'/>}

            </ScrollView>

            {bypassed != true? <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('Swiping', { email: userEmail, id: userID })}>
            <Text style={styles.buttonText}> Start Swiping </Text>
            </TouchableOpacity>: <Text></Text>}

        </SafeAreaView>
        </View>
    </>
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
    title: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#022169",
        textAlign: "center",
        marginTop: 40
    },
    defaultText: {
        textAlign: "center",
        color: "#022169",
        fontSize: 16,
        padding: 20
    },
    defaultText2: {
        textAlign: "center",
        color: "white",
        fontSize: 20,
        padding: 5
    },
    myClubsContainer: {
        padding: 10,
        width: "100%",
        borderColor: "#B3B9BC",
        borderWidth: 5,
        alignItems: "center",
        margin: 10
    },
    startSwipeFooter: {
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: 'center'
    },
    navText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: 'center'
    },
    myClubsPhoto: {
        width: 100,
        height: 150
    },
    myClubsHeader: {
        backgroundColor: "#78b3e0",
    },
    cardWrapper: {
        height: 150,
        margin: 10,
        overflow: 'scroll',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: CARD_RADIUS,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 2,
        backgroundColor: '#fff',
    },
    cardImageWrapper: {
        flex: 1,
        overflow: 'visible',
        borderTopLeftRadius: CARD_RADIUS,
        borderBottomLeftRadius: CARD_RADIUS,
    },
    cardImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        height: 150,
        width: 110,
        overflow: "hidden"
    },
    cardTextWrapper: {
        flex: 2.5,
        marginLeft: 5,
        marginRight: 5,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'scroll'
    },
    clubDescriptionText: {
        textAlign: "center",
        alignItems: 'flex-start',
        overflow: 'scroll'
    },
    footer: {
        width: "100%",
        textAlign: "center",
        backgroundColor: "#78b3e0",
        height: "12%",
        justifyContent: 'center',
        flexDirection: "column-reverse",
    },
    buttonText: {
        fontSize: 25,
        textAlign: "center",
        fontWeight: "bold",
        color: "#022169",
        alignSelf: 'center'
    },
    buttonText2: {
        fontSize: 18,
        textAlign: "center",
        color: "white",
        alignSelf: 'center',
        fontWeight: "bold",
    },
    label: {
        fontSize: 18,
        textAlign: "center",
        color: "#022169",
        alignSelf: "center",
        paddingTop: "20%",
        margin: 30
    },
    buttonContainer: {
        width: "30%",
        textAlign: "center",
        backgroundColor: "#022169",
        margin: 10,
        padding: 10,
        alignItems: "center",
        borderRadius:10
    },
});

export default Dashboard;
