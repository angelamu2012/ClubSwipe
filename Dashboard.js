/*
import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, FlatList, ImageBackground} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';


const LIST_DATA = new Array(4).fill('');
const CARD_RADIUS = 8;

const Dashboard = ({navigation, route}) => {
  // get params
  const {email, id} = route.params
const Card = ({clubName, clubDescription}) => (
  <View style={styles.cardWrapper}>
    <View style={styles.cardImageWrapper}>
      <ImageBackground
        source={require('./images/columbiaLion.png')}
        style={styles.cardImage}
      />
    </View>
    <View style={styles.cardTextWrapper}>
      <Text style = {styles.headerText}> Club Name {clubName} </Text>
    </View>
  </View>
);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>



        <View style={styles.myClubsHeader}>

            <View style={{marginTop: 10}}>
                <Image
                  style = {styles.logo}
                  source={require('./images/columbiaLion.png')}
                />
            </View>
            <Text style={styles.headerText}>Hi!</Text>
            <Text onPress={() => navigation.navigate("Initialization")}>Return to Init</Text>
            <Text style={styles.defaultText2} onPress={() => navigation.navigate("Swiping", {email: email, id: id})}>Get swiping or review your clubs below</Text>
        </View>

         <FlatList
            data={LIST_DATA}
            renderItem={() => <Card />}
            keyExtractor={(_, index) => index.toString()}
          />
        {*/
/*<View style={styles.container}>
            <MyClubModule clubName = "ADI" clubDescription = " Description..."> </MyClubModule>
            <MyClubModule clubName = "ADI" clubDescription = " Description..."> </MyClubModule>
        </View>*//*
}


      </SafeAreaView>
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
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  logo: {
    width: 50,
    height: 60,
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
      color: "#022169",
      fontSize: 20,
      padding: 20
  },
  myClubsContainer: {
    padding: 10,
    width: "70%",
    borderColor: "#B3B9BC",
    borderWidth: 5,
    alignItems: "center",
    margin: 10
  },
  startSwipeFooter: {
  },
  headerText: {
    fontSize:20,
    fontWeight: "bold",
    textAlign: "center"
  },
  myClubsPhoto: {
    width: 100,
    height: 150
  },
  myClubsHeader: {
    backgroundColor: "#B3B9BC"
  },
    cardWrapper: {
      height: 150,
      margin: 10,
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
      elevation: 11,
      backgroundColor: '#fff',
    },
    cardImageWrapper: {
      flex: 1,
      overflow: 'hidden',
      borderTopLeftRadius: CARD_RADIUS,
      borderBottomLeftRadius: CARD_RADIUS,
    },
    cardImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      height: 150,
    },
    cardTextWrapper: {
      flex: 1,
      paddingLeft: 10,
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },

});

export default Dashboard;
*/
