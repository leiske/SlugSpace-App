import React, { Component } from 'react';
import { Image, View, StyleSheet, Text, RefreshControl } from 'react-native';
import { Container, Content, Button, Grid, Col, Spinner, Tabs, Tab, StyleProvider, Card, CardItem, Left, Right, Body } from 'native-base';
import { WarmGray1, Teal, WarmGray8, WarmGray3, UCGray, Black } from '../colors';
import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';
import * as Animatable from 'react-native-animatable';
import TimeAgo from 'react-native-timeago';
import { LineChart, Grid as ChartGrid, Path, YAxis, XAxis } from 'react-native-svg-charts';
import { APIVer, TrackedLotsURL } from '../constants';
import { Loading } from '../components/loading';
import * as shape from 'd3-shape';
import MapView from 'react-native-maps';


export class Lot extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.lot.fullName,
    headerRight: <View />,
  });

  constructor(props) {
    super(props);
    this.state = { chartData: [], isLoading: true, isRefreshing: false, errorLoading: false, lot: this.props.navigation.getParam('lot', { imageURI: 'https://via.placeholder.com/450x200' }) }
  }

  async componentDidMount() {
    try {
      //await Expo.Font.loadAsync({ "MaterialIcons": require("../../node_modules/@expo/vector-icons/fonts/MaterialIcons.ttf") });

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
        this.setState({ isLoading: false, isRefreshing: false, errorLoading: false, chartData: responseJson })
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

  Shadow = ({ line }) => (
    <Path
      key={'shadow'}
      y={2}
      d={line}
      fill={'none'}
      strokeWidth={4}
      stroke={'rgba(255, 181, 17, 0.2)'}
    />
  )

  lineChart = () => {
    Array.prototype.hasMin = function (attrib) {
      return this.reduce(function (prev, curr) {
        return prev[attrib] < curr[attrib] ? prev : curr;
      });
    }

    if (this.state.isLoading) {
      return (
        <Loading />
      );
    }
    return (
      <Animatable.View animation='slideInLeft' easing='ease-out' duration={500 + ((this.state.lot.id - 1) * 50)}>
        <Card>
          <CardItem bordered>
            <Text style={styles.cardTitle}>Free Spaces Over Time</Text>
          </CardItem>
          <CardItem>
            <YAxis
              yAccessor={({ item }) => item.freeSpaces}
              xAccessor={({ index }) => index}
              data={this.state.chartData}
              svg={{ fontSize: 16, fill: 'grey', }}
              numberOfTicks={5}
              contentInset={{ top: 10, }}
            />
            <View style={{ flex: 1 }}>
              <LineChart
                yAccessor={({ item }) => item.freeSpaces}
                xAccessor={({ index }) => index}
                yMax={this.state.lot.totalSpaces}
                xMin={0}
                xMax={(20 - 8) * (60 / 5)} //temporary
                style={{ height: 150, }}
                data={this.state.chartData}
                svg={{ strokeLineCap: 'round', strokeLinejoin: 'miter', strokeWidth: 6, stroke: 'rgb(0, 163, 173)' }}
                contentInset={{ top: 10, bottom: 10, left: 5, }}
                curve={shape.curveBasis}
              >
                <ChartGrid />
                {/* <this.Shadow /> */}
              </LineChart>
            </View>
          </CardItem>
        </Card>
      </Animatable.View>
    );
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
    height: 200,
    resizeMode: "stretch"
  },

  map: {
    flex: 1,
    height: 150,
  }

});

export default Lot;