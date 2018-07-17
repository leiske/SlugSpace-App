import React, { Component } from 'react';
import { Dimensions, Header, View, StyleSheet } from 'react-native';
import { MapView } from 'expo';
import { Text, Button } from 'react-native-elements';

export class Lot extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.lotName,
    headerTitleStyle: {
      fontSize: 26,
      fontWeight: '600',
      textAlign: 'center',
      alignSelf: 'center',
      flex: 1,
    },
    headerRight: <View />
  });

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: .55 }}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 36.995558,
              longitude: -122.058885,
              latitudeDelta: 0.01072,
              longitudeDelta: 0.00171,
            }}
          >
            <MapView.Marker
              coordinate={{
                latitude: 36.999116,
                longitude: -122.063698,
              }}
              title={this.props.navigation.state.params.lotName}
              description={this.props.navigation.state.params.lotDesc}
            />
          </MapView>
        </View>

        <View style={styles.menu}>
          <View style={styles.menuButtonsContainer}>
            <View style={styles.menuButtons}>
              <Button
                raised
                icon={{ name: 'home', size: 32 }}
                title={`Core West`}
                textStyle={{ textAlign: 'center' }}
              />
              <Button
                raised
                icon={{ name: 'home', size: 32 }}
                title={`Core West`}
                textStyle={{ textAlign: 'center' }}
              />
            </View>
            <View style={styles.menuButtons}>
              <Button
                raised
                icon={{ name: 'home', size: 32 }}
                title={`Core West`}
                textStyle={{ textAlign: 'center' }}
              />
              <Button
                raised
                icon={{ name: 'home', size: 32 }}
                title={`Core West`}
                textStyle={{ textAlign: 'center' }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menu: {
    flex: .45,
  },
  menuButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  menuButtons: {
    //flex: 1,
    justifyContent: 'space-around',
    width: Dimensions.get('window').width/2,  
    height: Dimensions.get('window').height/2,
  }
});

export default Lot;