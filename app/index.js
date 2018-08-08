import { AppRegistry } from 'react-native';
import { Home } from './views/home'
import { Lot } from './views/lot'
import App from '../App';
import { createStackNavigator } from 'react-navigation';
import { DarkBlue } from './colors';

AppRegistry.registerComponent('asl', () => App);

const AppNavigator = createStackNavigator(
    {
        HomeScreen: { screen: Home },
        LotScreen: { screen: Lot },
    },
    {
        navigationOptions: {
            headerStyle: {
                backgroundColor: DarkBlue,
            },
            headerTitleStyle: {
                color: 'white',
                fontSize: 26,
                fontWeight: '600',
                textAlign: 'center',
                alignSelf: 'center',
                flex: 1,
            },
            headerBackTitleStyle: {
                color: 'white',
            },
            headerTintColor: 'white',
        },
    }
);

export default AppNavigator;