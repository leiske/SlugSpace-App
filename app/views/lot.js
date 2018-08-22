import React, { Component } from 'react';
import { Image, Header, View, StyleSheet } from 'react-native';

export class Lot extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.lotName,
    headerRight: <View />,
  });

  constructor(props) {
    super(props);
    this.state = { isLoading: true , lot: this.props.navigation.getParam('lot', 'no lot')}
  }

  render() { 
    return (
      <View style={styles.container}>
        <View>
          <Image source={{uri: 'via.placeholder.com/450x250'}}  style={styles.cardImage} />
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
  cardImage: {
    height: 175,
    width: undefined,
    flex: 1,
    alignSelf: 'stretch',
},
});

/*
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
          */
export default Lot;