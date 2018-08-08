import React, { Component } from 'react';
import { Dimensions, Header, View, StyleSheet } from 'react-native';
import { MapView } from 'expo';
import { Text, Button } from 'react-native-elements';

export class Lot extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.lotName,
    headerRight: <View />,
  });

  constructor(props) {
    super(props);
    this.state = { isLoading: true }
  }

  componentDidMount() {
  }

  render() {
    const { navigation } = this.props;
    const lot = navigation.getParam('lot', 'no lot');

    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
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

});

export default Lot;