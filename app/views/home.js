import React, { Component, View } from 'react';
import { RefreshControl, AsyncStorage } from 'react-native';
import { WarmGray1, Teal, WarmGray3, WarmGray8, DarkBlue } from '../colors';
import { Container, Content, Spinner, Grid, Col, Button, Icon, Text } from 'native-base';
import { LotCard } from '../components/lotCard';
import * as Animatable from 'react-native-animatable';
import { LotsURL } from '../constants';
import { Loading } from '../components/loading';
import AsyncAuthFetch from '../authentication/AsyncAuthFetch';

export class Home extends Component {
  static navigationOptions = {
    title: 'Overview',
  }

  constructor(props) {
    super(props);
    this.state = { cards: [], isLoading: true, fontLoaded: false, isRefreshing: false, errorLoading: false, token: "" }
  }

  Icon = Animatable.createAnimatableComponent(Icon);

  async componentDidMount() {
    try {
      await Expo.Font.loadAsync({ "MaterialIcons": require("../../node_modules/@expo/vector-icons/fonts/MaterialIcons.ttf") });
      await Expo.Font.loadAsync({ "Ionicons": require("../../node_modules/@expo/vector-icons/fonts/Ionicons.ttf") });
      this.setState({ fontLoaded: true });
    } catch (error) {
      console.log('error loading icon fonts', error);
    }
    this.onRefresh()
  }

  onRefresh = () => {
    this.setState({ isRefreshing: true, isLoading: true })
    AsyncAuthFetch(LotsURL)
      .then(responseJson => this.setState({ isLoading: false, errorLoading: false, dataSource: responseJson }))
      .catch(error => {
        console.log(error);
        this.setState({ errorLoading: true, });
      })
    this.setState({ isRefreshing: false, })
  }

  createLotCards() {
    this.state.cards = []; //clear the cards so we can get new data.... Change to eventually edit the cards already in place
    for (var i = 0; i < this.state.dataSource.length; i++) {
      this.state.cards.push(<LotCard key={i} navigation={this.props.navigation} lot={this.state.dataSource[i]} />)
    }
    return this.state.cards;
  }

  render() {
    //higher priority than loading
    if (this.state.errorLoading) {
      return (
        <Content contentContainerStyle={{ flex: 1 }} style={{ padding: 10, backgroundColor: WarmGray1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh}
              title="Loading..."
            />}
        >
          <Grid style={{ alignItems: 'center' }}>
            <Col>
              <Animatable.View animation="shake">
                {this.state.fontLoaded ? <Icon style={{ textAlign: 'center', color: WarmGray3, fontSize: 76 }} name='error' type='MaterialIcons' /> : <Text />}
              </Animatable.View>
              <Text style={{ textAlign: 'center', color: WarmGray8, fontSize: 20, }}>Error loading parking data</Text>
              <Text style={{ textAlign: 'center', color: WarmGray8, fontSize: 18, }}>Try again soon</Text>
            </Col>
          </Grid>
        </Content>
      )
    }
    if (this.state.isLoading || this.state.isRefreshing) {
      return (
        <Loading />
      );
    }
    return (
      <Container style={{ backgroundColor: WarmGray1 }}>
        <Content padder
          showsHorizontalScrollIndicator={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh}
              title="Loading..."
            />
          }>
          {this.createLotCards()}
        </Content>
      </Container>
    );
  }
}

// const styles = StyleSheet.create({});

export default Home;