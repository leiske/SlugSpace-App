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

export class Home extends Component {
  static navigationOptions = {
    title: 'Overview',
  }

  constructor(props) {
    super(props);
    this.state = { trackedCards: [], isLoading: true, fontLoaded: false, isRefreshing: false, errorLoading: false, token: "", trackedLotsSource: [], }
  }

  Icon = Animatable.createAnimatableComponent(Icon);

  componentWillMount() {
    this.onRefresh()
  }

  onRefresh = () => {
    this.setState({ isRefreshing: true, isLoading: true })

    AsyncAuthFetch(TrackedLotsURL)
      .then(responseJson => this.setState({ isLoading: false, errorLoading: false, trackedLotsSource: responseJson }))
      .catch(error => {
        console.log(error);
        this.setState({ errorLoading: true, });
      })

    this.setState({ isRefreshing: false, })
  }

  createTrackedLotCards() {
    this.state.trackedCards = []
    for (var i = 0; i < this.state.trackedLotsSource.length; i++) {
      this.state.trackedCards.push(<LotCard key={i} navigation={this.props.navigation} lot={this.state.trackedLotsSource[i]} />)
    }
    return this.state.trackedCards;
  }

  getTrackedLotCards() {
    return (
      <Content padder>
        { this.createTrackedLotCards() }
      </Content>
    );
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
            {this.getTrackedLotCards()}
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default Home;