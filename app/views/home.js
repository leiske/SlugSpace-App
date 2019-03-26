import React, { Component, View } from 'react';
import getTheme from '../../native-base-theme/components';
import homePage from '../../native-base-theme/variables/homePage';
import * as Animatable from 'react-native-animatable';
import AsyncAuthFetch from '../authentication/AsyncAuthFetch';
import { RefreshControl, AsyncStorage } from 'react-native';
import { WarmGray1, Teal, WarmGray3, WarmGray8, DarkBlue } from '../colors';
import { Container, Content, Spinner, Grid, Col, Button, Icon, Text,Tabs, Tab, StyleProvider, List, ListItem, Header } from 'native-base';
import { LotCard } from '../components/lotCard';
import { TrackedLotsURL, UntrackedLotsURL } from '../constants';
import { Loading } from '../components/loading';
import { SearchBar } from 'react-native-elements';

export class Home extends Component {
  static navigationOptions = {
    title: 'Overview',
  }

  constructor(props) {
    super(props);
    this.state = { trackedCards: [], untrackedCards: [], isLoading: true, fontLoaded: false, isRefreshing: false, errorLoading: false, token: "", trackedLotsSource: [], untrackedLotSource: [], currentTab: 0 }
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
    this.setState({ isRefreshing: true, isLoading: true, currentTab: 0 })

    AsyncAuthFetch(TrackedLotsURL)
      .then(responseJson => this.setState({ trackedLotsSource: responseJson }))
      .catch(error => {
        console.log(error);
        this.setState({ errorLoading: true, });
      })

    AsyncAuthFetch(UntrackedLotsURL)
      .then(responseJson => this.setState({ isLoading: false, errorLoading: false, untrackedLotSource: responseJson }))
      .catch(error => {
        console.log(error);
        this.setState({ errorLoading: true, });
      })

    this.setState({ isRefreshing: false, })
  }

  createTrackedLotCards = () => {
    for (var i = 0; i < this.state.trackedLotsSource.length; i++) {
      this.state.trackedCards.push(<LotCard key={i} navigation={this.props.navigation} lot={this.state.trackedLotsSource[i]} />)
    }
    return this.state.trackedCards;
  }

  createUntrackedLotCards = () => {
    for (var i = 0; i < this.state.untrackedLotSource.length; i++) {
      this.state.untrackedCards.push(
        <ListItem key={i} navigation={this.props.navigation} lot={this.state.untrackedLotSource[i]}>
          <Text>{this.state.untrackedLotSource[i].lotName}</Text>
        </ListItem>
      )
    }
    return this.state.untrackedCards;
  }

  getUntrackedLotCards = (tabIndex) => {
    if (this.state.untrackedCards.length == 0) {
      this.createUntrackedLotCards();
    }

    if (this.state.currentTab != tabIndex) {
      return
    }

    return (
      <Content>
        <List>
          {this.state.untrackedCards}
          </List>
      </Content>
    );
  }

  getTrackedLotCards = (tabIndex) => {
    if (this.state.trackedCards.length == 0) {
      this.createTrackedLotCards();
    }

    if (this.state.currentTab != tabIndex) {
      return
    }

    return (
      <Content padder>
        {this.state.trackedCards}
      </Content>
    );
  }

  //This does not get ran when the page refreshes... Added reseting of tab to onRefresh
  onChangeTab(info) {
    this.setState({currentTab: info.i});
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
                <Icon style={{ textAlign: 'center', color: WarmGray3, fontSize: 76 }} name='error' type='MaterialIcons' />
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
      <StyleProvider style={getTheme(homePage)}>
        <Container style={{ backgroundColor: WarmGray1 }}>
          <Content
            showsHorizontalScrollIndicator={true}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this.onRefresh}
                title="Loading..."
              />
            }>
            {this.getTrackedLotCards(0)}
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default Home;