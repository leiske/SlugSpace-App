import { Card, CardItem, Left, Right, View, Button, ListItem, Content, List } from 'native-base';
import { Image, StyleSheet, Text } from 'react-native';
import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import { Black, UCGray } from '../colors';
import { Accordion } from './Accordian';

const AnimatableCard = Animatable.createAnimatableComponent(Card);

const parkingInfo = [
    { title: <Text>Permits</Text>, content: <Text>Unavailable</Text> },
    { title: <Text>Pay Stations</Text>, content: <Text>Unavailable</Text> },
    { title: <Text>Free Parking</Text>, content: <Text>Unavailable</Text> }
  ];

export class ParkingInformationCard extends Component {
    constructor(props) {
        super(props);

        Animatable.initializeRegistryWithDefinitions({
        slideInLeft: {
            from: {
                'translateX': -500,
              },
              to: {
                'translateX': 0,
              },
        }
      });

      Animatable.initializeRegistryWithDefinitions({
        slideOutLeft: {
            from: {
                'translateX': 0,
              },
              to: {
                'translateX': -500,
              },
        }
      });

        if (this.props.lot.permits != null) {
            permits = []
            for (var i = 0; i < this.props.lot.permits.length; i++) {
                    permits.push(
                    <ListItem key={i}>
                    <View><Text>{this.props.lot.permits[i].permitName}</Text></View>
                    </ListItem>
            )}

            parkingInfo[0].content = <List>{permits}</List>
        }

        if (this.props.lot.payStations != null) {
            payStations = []
            for (var i = 0; i < this.props.lot.payStations.length; i++) {
                payStations.push(
                    <ListItem key={i}>
                    <View><Text>{this.props.lot.payStations[i].payStationName}</Text></View>
                    </ListItem>
            )}

            parkingInfo[1].content = <List>{payStations}</List>
        }

        if (this.props.lot.lotAvailability != null) {
            parkingInfo[2].content = <Text>{this.props.lot.lotAvailability.lotAvailabilityName}</Text>
        }

        this.state = {animDuration: this.props.animDuration}
    }

    render() {
        return (
            <Animatable.View animation='slideInLeft' easing='ease-out' duration={this.state.animDuration}> 
            <Card style={styles.cardStyle} >
                <CardItem bordered>
                    <Text style={styles.cardTitle}>Parking Information</Text>
                </CardItem>
                <CardItem>
                    <Accordion dataArray={parkingInfo} headerStyle={{backgroundColor: "#ffffff"}}/>
                </CardItem>
            </Card>
            </Animatable.View>
        );
    }
}

const styles = StyleSheet.create({
    cardStyle: {
        flex: 1,
    },

    cardTitle: {
        textAlign: 'left',
        fontSize: 20,
        fontWeight: '400',
        color: Black
    },

    cardDescription: {
        textAlign: 'left',
        fontSize: 10,
        color: UCGray
    },
});

export default ParkingInformationCard