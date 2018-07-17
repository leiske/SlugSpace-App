import { AppRegistry } from 'react-native';
import { Home } from './views/home'
import { Lot } from './views/lot'
import App from '../App';
import { createStackNavigator } from 'react-navigation';

AppRegistry.registerComponent('asl', () => App);

const AppNavigator = createStackNavigator({
    HomeScreen: { screen: Home },
    LotScreen: { screen: Lot },
});

export default AppNavigator;