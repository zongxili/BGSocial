import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import EventTitle from '../components/CreateEventTitle';
import EventDate from '../components/CreateEventDate';
import EventGames from '../components/CreateEventGames';
import EventFriends from '../components/CreateEventFriends';
import useTimeSlot from '../hooks/useTimeSlot';
import useGameSlot from '../hooks/useGameSlot';
import useFriendSlot from '../hooks/useFriendSlot';
import MapView, { Marker } from 'react-native-maps';
import useLocation from '../hooks/useLocation';
import { API_HOST } from './../settings/app.config';
import axios from 'axios';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';


export default function createEventScreen() {
  const { timeSlots, addTimeSlot, changeTimeSlot, deleteTimeSlot } = useTimeSlot();
  const { gameSlots, changeGameSlot } = useGameSlot();
  const { friendSlots, changeFriendSlot } = useFriendSlot();
  const [eventTitle, setEventTitle] = useState('');
  const { location, latitude, longitude, setLatitude, setLongitude } = useLocation();
  const dispatchState = useNavigationParam('dispatchState');
  const { navigate } = useNavigation();
  const createEvent = () => {

    const eventDates = timeSlots.map(time => {
      return {
        "date": JSON.stringify(time["date"]),
        "is_chosen": false,
        "is_open": true,
        "location": location
      }
    });

    const eventAttendants = friendSlots.map(friend => {
      return {
        "is_confirmed": true,
        "is_not_assisting": false,
        "attendant_id": friend
      }
    });

    eventAttendants.push({
      "is_confirmed": true,
      "is_not_assisting": false,
      "attendant_id": 1
    })

    const eventGames = gameSlots.map(game => {
      return {
        "game_id": game
      }
    })


    const newEvent = {
      "owner_id": 1,
      eventDates,
      eventAttendants,
      eventGames
    };

    axios.post(`${API_HOST}/events/`, newEvent).then((res) => {
      const { data: createdEvent } = res;
      createdEvent['chosen_event_date'] = {
        date: null,
        location: null
      };
      dispatchState({ value: createdEvent, type: 'createEvent' });
      navigate('Events');
    })
  };

  return (
    <>
      <View style={styles.mapContainer}>
        {
          latitude && longitude ?
            <>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={({ nativeEvent }) => {
                  setLatitude(nativeEvent.coordinate.latitude);
                  setLongitude(nativeEvent.coordinate.longitude);
                }}
                children={
                  <Marker draggable coordinate={{ latitude, longitude }} />
                }
              />
              <EventTitle
                onChangeText={setEventTitle}
                value={eventTitle}
              />
            </>
            :
            <ActivityIndicator size='large' color="#0000ff" />
        }

      </View>
      <ScrollView >
        <EventDate
          timeSlots={timeSlots}
          addTimeSlot={addTimeSlot}
          changeTimeSlot={changeTimeSlot}
          deleteTimeSlot={deleteTimeSlot}
        />
        <EventGames
          userGames={useNavigationParam('userGames')}
          changeGameSlot={changeGameSlot}
        />
        <EventFriends
          userFriends={useNavigationParam('userFriends')}
          changeFriendSlot={changeFriendSlot}
        />
      </ScrollView>
      <Button
        title='Create Event!'
        icon={
          <Icon
            name='check-circle'
            type='font-awesome'
            color='white'
          />
        }
        onPress={createEvent}
      />
    </>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    // ...StyleSheet.absoluteFillObject,
    height: 150,
    width: 400,
    justifyContent: 'center',
    alignItems: 'center',

  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});