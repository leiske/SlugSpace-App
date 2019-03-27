import React, { Component } from 'react';
import { Slider, View, StyleSheet, Text, RefreshControl } from 'react-native';
import { Container, Content, Button, Grid, Col, Spinner, Tabs, Tab, StyleProvider, Card, CardItem, Left, Right, Body, Icon } from 'native-base';
import { WarmGray1, Teal, WarmGray8, WarmGray3, UCGray, Black, UCBlue, LightTeal, LightBlue, UCGold, LightGold, DarkGold } from '../colors';
import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';
import * as Animatable from 'react-native-animatable';
import TimeAgo from 'react-native-timeago';
import { APIVer, TrackedLotsURL, TrackedLotFullInfoURL } from '../constants';
import { Loading } from '../components/loading';
import MapView from 'react-native-maps';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { ParkingInformationCard } from '../components/PermitInformationCard';
import { format } from 'date-fns';

export class Lot extends Component {

  sliderStep = .25; //Move in steps of half an hour, so .5
  sliderOffset = 8; //we start the slider at 8AM = 0

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.lot.name,
    headerRight: <View />,
  });

  constructor(props) {
    super(props);
    this.state = {isLoading: false, isRefreshing: false, errorLoading: false, lot: this.props.navigation.getParam('lot', { id: -1 }), sliderValue: 0, isSliderCurrentTime: true  }
  }

  componentWillMount() {
    this.onRefresh() //this will cause the app to grab the full lots information from the API... Definitely not great because of the call everytime, but we can figure this out later
  }

  roundMinutesToStep(minute) {
    return Math.round((minute / 60) / this.sliderStep) * this.sliderStep //will round to whatever the step we want. In this case, step is .25 so we only want increments of .25.
  }

  setSliderToCurrentTime() {
    this.changeSliderValue(this.convertCurrentTimeToSliderValue())
  }

  convertCurrentTimeToSliderValue() {
    datetime = new Date();
    return (datetime.getHours() - this.sliderOffset) + this.roundMinutesToStep(datetime.getMinutes())
  }

  convertSliderValueToTime(sliderValue) {
    hourOffset = Math.floor(sliderValue)
    minuteDecimal = sliderValue - hourOffset;

    realHour = hourOffset + this.sliderOffset;
    realMinute = 60*(minuteDecimal * 100) / 100;

    return format(new Date(0,0,0,realHour,realMinute),"h:mm a");
  }

  onRefresh = () => {
    this.setState({ isRefreshing: true, isLoading: true })
    this.setSliderToCurrentTime()
    AsyncAuthFetch(TrackedLotFullInfoURL + `/${this.state.lot.id}`)
      .then(responseJson => this.setState({ isLoading: false, errorLoading: false, lot: responseJson }))
      .catch(error => {
        console.log(error);
        this.setState({ errorLoading: true, });
      })
    this.setState({ isRefreshing: false})
  }

  changeSliderValue(value) { 
    clearTimeout(this.sliderTimeoutId)
    this.sliderTimeoutId = setTimeout(() => {
      newSliderVal = parseFloat(value)
      this.setState({
          sliderValue: newSliderVal,
          isSliderCurrentTime: (this.convertCurrentTimeToSliderValue() === newSliderVal)
      })  
    },40)
  }

  handleIconPress = () => {
    this.setSliderToCurrentTime()
  }

  OverviewCard = () => {
    return (
      <Animatable.View animation='slideInLeft' easing='ease-out' duration={500}>
        <Card style={{padding: 0,}}>
          <CardItem bordered>
            <Left><Text style={styles.cardTitle}>Lot Overview</Text></Left>
            <Right>{!this.state.isSliderCurrentTime ? <Icon style={{color: WarmGray8, marginRight: 10}}name={"undo"} onPress={this.handleIconPress}/> : null}</Right>
          </CardItem>
          <CardItem>
            <Body style={{flexDirection:"row", justifyContent: "center"}}>
              <AnimatedCircularProgress
                size={150}
                width={12}
                fill={(this.state.lot.freeSpaces/this.state.lot.totalSpaces) * 100}
                arcSweepAngle={300}
                lineCap={"round"}
                rotation={-150}
                tintColor={Teal}
                backgroundColor={WarmGray3}>
                {
                  (fill) => (
                    <View style={{alignItems:'center'}}>
                      <Text style={styles.progressText}>
                        { this.state.lot.freeSpaces }
                      </Text>

                      <Text style={{fontSize: 14}}>
                        Available Spaces
                      </Text>

                      <Text style={{fontSize: 12}}>
                        ~ {this.convertSliderValueToTime(this.state.sliderValue)}
                      </Text>
                    </View>
                  )
                }
              </AnimatedCircularProgress>
            </Body>
          </CardItem>
          <CardItem>
            <Content style={{flexDirection:'column'}} contentContainerStyle={{flex: 1,alignItems:'stretch',}}>
              <Slider 
              minimumValue={0} 
              maximumValue={14} 
              value={this.state.sliderValue}
              step={this.sliderStep} 
              style={{flex: 1}} 
              minimumTrackTintColor={UCGray} 
              maximumTrackTintColor={UCGray}
              onValueChange={this.changeSliderValue.bind(this)}
              />
              <View style={{ flexDirection: 'row', alignItems:'stretch', justifyContent:'space-evenly', flexWrap:'nowrap'}}>
                <Text style={styles.sliderTime}> 8am</Text>
                <Text style={styles.sliderTime}>10am</Text>
                <Text style={styles.sliderTime}>12pm</Text>
                <Text style={styles.sliderTime}> 2pm</Text>
                <Text style={styles.sliderTime}> 4pm</Text>
                <Text style={styles.sliderTime}> 6pm</Text>
                <Text style={styles.sliderTime}> 8pm</Text>          
                <Text style={styles.sliderTime}>10pm</Text>          
              </View>
            </Content>
          </CardItem>
          <CardItem footer>
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
              <Text style={{ fontSize: 14, padding: 5.5, color: Black }}>Directions</Text>
            </Left>
            <Right>
              <Text style={{ fontSize: 18 , color: Black}}>> </Text>{/*TODO change to actual icon at some point*/}
            </Right>
          </CardItem>
        </Card>
      </Animatable.View>
    )
  }

  render() {
    if (this.state.isLoading || this.state.isRefreshing) {
      return (
        <Loading />
      );
    }

    return (
      <StyleProvider style={getTheme(commonColor)}>
        <Container style={styles.container}>
          <Content
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this.onRefresh}
                title="Loading..."
              />}
              padder
          >
          {this.OverviewCard()}
          <ParkingInformationCard lot={this.state.lot} animDuration={600} />
          {this.MapCard()}
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection:'row',
    backgroundColor: WarmGray1 
  },

  contentPermitInformation:{
    paddingTop:10,
    backgroundColor: '#ffffff' 
  },

  cardStyle: {
    flex: 0,
  },

  permitHeader: {
    textAlign: 'left',
    fontSize: 16,
    padding: 1,
    color: Black
  },

  cardText: {
    textAlign: 'left',
    fontSize: 16,
    color: Black
  },

  cardFreeSpaces: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingRight: 15,
    marginLeft: 15,
  },

  cardTitle: {
    textAlign: 'left',
    fontSize: 20,
    fontWeight: '400',

    color: Black
  },

  headerImage: {
    width: 450,
    height: 150,
    resizeMode: "cover"
  },

  map: {
    flex: 1,
    height: 150,
  },

  progressText: {
    fontSize: 36,
    color: Black
  },

  sliderTime: {
    fontSize: 12,
    color: WarmGray3,
    flex: .15
  }

});

export default Lot;