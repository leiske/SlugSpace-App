import React, { Component } from 'react';
import { RefreshControl } from 'react-native';
import { WarmGray1, Teal, WarmGray3, WarmGray8, DarkBlue } from '../colors';
import { Container, Content, Spinner, Grid, Col, Button, Icon, Text } from 'native-base';
import { LotCard } from '../components/lotCard';
import * as Animatable from 'react-native-animatable';

export class Home extends Component {
  static navigationOptions = {
    title: 'SlugSpace',
  }

  constructor(props) {
    super(props);
    this.state = { isLoading: true, fontLoaded: false, isRefreshing: false, errorLoading: false, }
  }

  Icon = Animatable.createAnimatableComponent(Icon);

  async fetchParkingAPI() {
    try {
      this.setState({ isLoading: true, });
      let response = await fetch(`http://dev.slugspace.xyz/v1/lot`);
      if (response.ok) {
        let responseJson = await response.json();
        this.setState({ isLoading: false, isRefreshing: false, errorLoading: false, dataSource: responseJson })
        return responseJson;
      }
    } catch (error) {
      console.log('Error requesting lot data', error);
      this.setState({ errorLoading: true, })
    }
  }

  async componentDidMount() {
    try {
      await Expo.Font.loadAsync({ "MaterialIcons": require("../../node_modules/@expo/vector-icons/fonts/MaterialIcons.ttf") });

      this.setState({ fontLoaded: true });
    } catch (error) {
      console.log('error loading icon fonts', error);
    }

    this.fetchParkingAPI();
  }

  onRefresh = () => {
    this.setState({ isRefreshing: true, })
    this.fetchParkingAPI();
    this.setState({ isRefreshing: false, })
  }

  createLotCards() {
    let cards = []
    for (var i = 0; i < this.state.dataSource.length; i++) {
      cards.push(<LotCard key={i} navigation={this.props.navigation} lot={this.state.dataSource[i]} />)
    }
    return cards;
  }

  loadingContent = () => {
    return (<Content contentContainerStyle={{ flex: 1 }} style={{ padding: 10 }}>
      <Grid style={{ alignItems: 'center' }}>
        <Col>
          <Spinner color={Teal} />
        </Col>
      </Grid>
    </Content>);
  }

  render() {
    //higher priority than loading
    if (this.state.errorLoading) {
      return (
        <Content contentContainerStyle={{ flex: 1 }} style={{ padding: 10 }}
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
        this.loadingContent()
      );
    }
    return (
      <Container style={{ backgroundColor: WarmGray1 }}>
        <Content padder refreshControl={
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