import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

export class Home extends Component {
  static navigationOptions = {
    title: 'SlugSpace',
    headerTitleStyle: {
      fontSize: 26,
      fontWeight: '600',
      textAlign: 'center',
      flex: 1,
    }
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.homeText}> Home Page </Text>
        <Button
          raised
          title={`Core West`}
          textStyle={{ textAlign: 'center' }}
          onPress={() => this.props.navigation.navigate('LotScreen', { lotID: 1, lotName: "Core West Parking", lotDesc:"Faculty Only" })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  homeText: {
    fontSize: 50,
    textAlign: 'center',
  },
});

export default Home;