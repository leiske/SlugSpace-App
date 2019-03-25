import { Card, CardItem, Left, Right, View, Button } from 'native-base';
import { Icon } from 'react-native-elements';
import { Image, StyleSheet, Text } from 'react-native';
import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import { Black, UCGray } from '../colors';

const AnimatableCard = Animatable.createAnimatableComponent(Card);

export class LotCard extends Component {
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
    }

    handlePress = () => {
        this.props.navigation.navigate('LotScreen', {lot: this.props.lot})
    }

    render() {
        return (
            <Animatable.View animation='slideInLeft' easing='ease-out' duration={500 + ((this.props.lot.id-1) * 50)}> 
            <Card style={styles.cardStyle} >
                <CardItem cardBody>
                    <Image source={{ uri: this.props.lot.imageURI }} style={styles.cardImage} />
                </CardItem>
                <CardItem>
                    <Left>
                        <View>
                            <Text style={styles.cardTitle}>{this.props.lot.fullName}</Text>
                            <Text style={styles.cardDescription}>{this.props.lot.description}</Text>
                        </View>
                    </Left>
                    <Right>
                        <Button transparent onPress={this.handlePress}>
                            <Text style={styles.cardFreeSpaces}>{this.props.lot.freeSpaces}</Text>
                            <Icon name='chevron-right'/>
                        </Button>
                    </Right>
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
        fontWeight: 'bold',
        fontSize: 16,
        color: Black
    },
    cardDescription: {
        textAlign: 'left',
        fontSize: 10,
        color: UCGray
    },
    cardFreeSpaces: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
        paddingRight: 15,
        marginLeft: 15,
        color: Black
    },

    cardImage: {
        height: 175,
        width: undefined,
        flex: 1,
        alignSelf: 'stretch',
    }
});

export default LotCard