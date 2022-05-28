import 'react-native-gesture-handler' 
/**
 * @format
 */
import Feather from "react-native-vector-icons/Feather";
Feather.loadFont();

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
