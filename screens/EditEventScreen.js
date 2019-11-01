import React, { useState } from 'react';
import { Button, Icon } from 'react-native-elements';
import TimeListItem from '../components/TimeListItem';
import EventDates from '../components/CreateEventDate';
import { useNavigationParam } from 'react-navigation-hooks';
import useTimeSlot from '../hooks/useTimeSlot';
import {id} from '../utils/makeNewID';

export default function EditEventScreen() {
  const event = useNavigationParam('event');
  const { event_dates, event_attendants, event_games } = event;
  const { location } = event_dates[0];
  const timeArray = event_dates.map((date) => {
    return {
      id: id(),
      date: date.date
    }
  });
  const { timeSlots, addTimeSlot, changeTimeSlot, deleteTimeSlot } = useTimeSlot(timeArray);

  const editEventAction = () => {
    console.log('timeslots:', timeSlots);
  }
  return (
    <>
      {/* {
        timeSlots.map((date, index) => (
          <TimeListItem
            key={index}
            id={index}
            preSetDate={date.date}
            title={date.date}
            changeTimeSlot={changeTimeSlot}
          />
        ))
      } */}
      <EventDates
        timeSlots={timeSlots}
        addTimeSlot={addTimeSlot}
        changeTimeSlot={changeTimeSlot}
        deleteTimeSlot={deleteTimeSlot}
      />
      <Button
        title='Edit Event!'
        icon={
          <Icon
            name='check-circle'
            type='font-awesome'
            color='white'
          />
        }
        onPress={editEventAction}
      />
    </>

  )
}