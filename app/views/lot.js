import React, { Component } from 'react';
import { Image, View, StyleSheet, Text, RefreshControl } from 'react-native';
import { Container, Content, Button, Grid, Col, Spinner, Tabs, Tab, StyleProvider, Card, CardItem, Left, Right, Body } from 'native-base';
import { WarmGray1, Teal, WarmGray8, WarmGray3, UCGray, Black } from '../colors';
import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';
import * as Animatable from 'react-native-animatable';
import TimeAgo from 'react-native-timeago';
import { APIVer, TrackedLotsURL } from '../constants';
import { Loading } from '../components/loading';
import MapView from 'react-native-maps';


export class Lot extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.lot.fullName,
    headerRight: <View />,
  });

  constructor(props) {
    super(props);
    this.state = { chartData: [], isLoading: true, isRefreshing: false, errorLoading: false, lot: this.props.navigation.getParam('lot', { imageURI: 'https://via.placeholder.com/450x200' })  }
  }

  async componentDidMount() {
    try {
      this.setState({ fontLoaded: true });
    } catch (error) {
      console.log('error loading icon fonts', error);
    }
    this.setState({ isLoading: false });

    // this.fetchChartData()
  }

  async fetchChartData() {
    try {
      this.setState({ isLoading: true, });
      let response = await fetch(`https://dev.slugspace.xyz/${APIVer}/lotdataovertime/${this.state.lot.id}`);
      if (response.ok) {
        let responseJson = await response.json();
        this.setState({ isLoading: false, isRefreshing: false, errorLoading: false, chartData: responseJson})
        return responseJson;
      }
    } catch (error) {
      console.log('Error requesting lot data', error);
      this.setState({ errorLoading: true, })
    }
  }
  onRefresh = () => {
    this.setState({ isRefreshing: true, isLoading: true })
    AsyncAuthFetch(TrackedLotsURL + `/${this.state.lot.id}`)
      .then(responseJson => this.setState({ isLoading: false, errorLoading: false, lot: responseJson }))
      .catch(error => {
        console.log(error);
        this.setState({ errorLoading: true, });
      })
    this.setState({ isRefreshing: false, })
  }

  OverviewCard = () => {
    return (
      <Animatable.View animation='slideInLeft' easing='ease-out' duration={500 + ((this.state.lot.id - 1) * 50)}>
        <Card >
          <CardItem bordered>
            <Text style={styles.cardTitle}>Lot Overview</Text>
          </CardItem>
          <CardItem>
            <Left>
              <Text style={styles.cardText}>Available Spaces:</Text>
            </Left>
            <Right>
              <Text style={styles.cardFreeSpaces}>{this.state.lot.freeSpaces}</Text>
            </Right>
          </CardItem>
          <CardItem>
            <Left>
              <Text style={styles.cardText}>Total Spaces:</Text>
            </Left>
            <Right>
              <Text style={styles.cardFreeSpaces}>{this.state.lot.totalSpaces}</Text>
            </Right>
          </CardItem>
          <CardItem>
            <Left>
              <Text style={{ fontSize: 12, color: UCGray }}>Last updated </Text>
              <TimeAgo style={{ fontSize: 12, color: UCGray }} time={this.state.lot.lastUpdated} />
            </Left>
            <Right>
            </Right>
          </CardItem>
        </Card>
      </Animatable.View>
    )
  }

  MapCard = () => {
    return (
      <Animatable.View animation='slideInLeft' easing='ease-out' duration={700 + ((this.state.lot.id - 1) * 50)}>
        <Card>
          <CardItem bordered>
            <Text style={styles.cardTitle}>Map</Text>
          </CardItem>
          <CardItem cardBody>
            <MapView
              style={styles.map}
              initialRegion={{
                longitude: this.state.lot.longitude,
                latitude: this.state.lot.latitude,
                longitudeDelta: 0.0015,
                latitudeDelta: 0.0035,
              }}
              zoomEnabled={false}
              scrollEnabled={false}
            >
              <MapView.Marker
                coordinate={{
                  longitude: this.state.lot.longitude,
                  latitude: this.state.lot.latitude,
                }}
              />
            </MapView>
          </CardItem>
          <CardItem>
            <Left>
              <Text style={{ fontSize: 18, padding: 7.5, }}>Directions</Text>
            </Left>
            <Right>
              <Text style={{ fontSize: 18 }}>> </Text>{/*TODO change to actual icon at some point*/}
            </Right>
          </CardItem>
        </Card>
      </Animatable.View>
    )
  }

  render() {
    if (!this.state.fontLoaded || this.state.isLoading || this.state.isRefreshing) {
      return (
        <Loading />
      );
    }
    return (
      <StyleProvider style={getTheme(commonColor)}>
        <Container style={{ backgroundColor: WarmGray1 }}>
          <Content
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this.onRefresh}
                title="Loading..."
              />}
          >
            <Image source={{ uri: this.state.lot.imageURI }} style={styles.headerImage} />
            <Tabs>
              <Tab heading="Parking" style={{ backgroundColor: WarmGray1 }}>
                <Content padder>
                  {this.OverviewCard()}
                  {this.MapCard()}
                </Content>
              </Tab>
              <Tab heading="Predict" style={{ backgroundColor: WarmGray1 }}>
                <Content>
                  <Text>Predict here</Text>
                </Content>
              </Tab>
            </Tabs>
          </Content>
        </Container>
      </StyleProvider>
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
    fontSize: 22,
    padding: 1,
    color: Black
  },

  cardText: {
    textAlign: 'left',
    fontSize: 18,
    padding: 0,
    color: UCGray
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
  },

  headerImage: {
    width: 450,
    height: 150,
    resizeMode: "cover"
  },

  map: {
    flex: 1,
    height: 150,
  }

});

export default Lot;