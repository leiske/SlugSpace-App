import { AppRegistry, AsyncStorage } from 'react-native';
import { Home } from './views/home'
import { Lot } from './views/lot'
import App from '../App';
import { createStackNavigator } from 'react-navigation';
import { DarkBlue } from './colors';
import { RegisterURL } from './constants';
import { YellowBox } from 'react-native';

const uniqueId = require("react-native-unique-id");

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

async function registerJWT(jsonData) {
    try {
        let response = await fetch(RegisterURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: jsonData
        });
        if (response.ok) {
            let responseJson = await response.json();
            console.log("Registered app instance successfully. Logging into API now.")
            AsyncStorage.setItem("SlugSpace:JWT", responseJson.token)
            console.log(responseJson.token)
            return responseJson;
        } else {
            console.log("Recieved " + response.status + " " + response.statusText)
        }
    } catch (error) {
        console.log('Error requesting lot data', error);
        this.setState({ errorLoading: true, })
    }
}

function getJWT() {
    hasJWT = false;
    forceNewToken = false; //TODO make sure to remove this on production builds
    AsyncStorage.getItem("SlugSpace:JWT")
        .then((jwtItem) => {
            if (!jwtItem || forceNewToken) {
                console.log("Registering JWT to API");
                uniqueId()
                    .then(id => {
                        var data = {
                            jti: id,
                        };
                        registerJWT(JSON.stringify(data));
                    })
                    .catch(error => console.error(error));
            }
        })
        .catch((error) => console.log(error))
}

//Immediately check if this has a JWT. If not, we will go through the process of generating it by sending off the correct information to the 
getJWT();

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

AppRegistry.registerComponent('asl', () => App);
export default AppNavigator;