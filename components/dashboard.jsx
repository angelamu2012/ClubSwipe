import React from 'react'
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native'
import {Container, Button} from 'native-base'
import Lion from '../assets/lion.png'


export default function Dashboard({navigation}) {
    return(
        <Container>
            <Text>Temporary Dashboard Screen</Text>
            <Button onPress={() => navigation.navigate('Swiping')} style={{marginTop:300}}><Text>Go to Swiping Screen</Text></Button>
            <Button onPress={() => navigation.navigate('Initialization')} style={{marginTop:30}}><Text>Go to Initialization Screen</Text></Button>
        </Container>
    )
}