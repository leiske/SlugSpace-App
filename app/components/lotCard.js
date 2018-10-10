import { Card, CardItem, Left, Right, View, Button } from 'native-base';
import { Icon } from 'react-native-elements';
import { Image, StyleSheet, Text } from 'react-native';
import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';

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
                            <Text>{this.props.lot.description}</Text>
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
        flex: 0,
    },

    cardTitle: {
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: 20,
    },

    cardFreeSpaces: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        paddingRight: 15,
        marginLeft: 15,
    },

    cardImage: {
        height: 175,
        width: undefined,
        flex: 1,
        alignSelf: 'stretch',
    }
});

export default LotCard