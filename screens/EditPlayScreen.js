import React, { useState } from 'react';
import { Button, Icon } from 'react-native-elements';
import { useNavigationParam } from 'react-navigation-hooks';
import RecordPlayer from '../components/RecordPlayer';
import RecordGame from '../components/RecordGame';
import RecordTime from '../components/RecordTime';
import RecordDuration from '../components/RecordDuration';
import { formatDuration } from '../utils/formatDuration';
import { deformatDuration } from '../utils/deformatDuration';
import { parsePresetDuration } from '../utils/parsePresetDuration';
import useDuration from '../hooks/useDuration';
import { getUserInfo } from './../hooks/sessionContext';
import useFriendSlot from '../hooks/useFriendSlot';
import useScore from '../hooks/useScore';
import { ScrollView } from 'react-native';


export default function EditPlayScreen() {
  const users = useNavigationParam('users');
  const play = useNavigationParam('play');
  const game = useNavigationParam('game');
  const userGames = useNavigationParam('userGames');
  const userFriends = useNavigationParam('userFriends');
  const { date: presetDate, duration, game_id, id: playID, playsUsers } = play;
  const { hour: presetHour, minute: presetMinute, second: presetSecond } = deformatDuration(duration);
  const { userData } = getUserInfo();
  const { avatar, id, name } = userData;

  //states
  const [date, setDate] = useState(new Date(presetDate));
  const { hour, minute, second, changeHour, changeMinute, changeSecond }
    = useDuration(
      parsePresetDuration(presetHour),
      parsePresetDuration(presetMinute),
      parsePresetDuration(presetSecond)
    );
  const [gameRecord, setGameRecord] = useState([game.id]);
  const { friendSlots, changeFriendSlot } = useFriendSlot();
  const { scoreList, addScoreList, updateScoreList, deleteScoreList, isWinner, getWinners } = useScore(id);

  const editScoreAction = () => {
    console.log('date:', date);
    console.log('hour:', hour);
    console.log('minute:', minute);
    console.log('second:', second);
    console.log('gameRecord:', gameRecord);
  }

  return (
    <>
      <ScrollView>
        <RecordTime
          date={date}
          setDate={setDate}
        />
        <RecordDuration
          hour={hour}
          minute={minute}
          second={second}
          changeHour={changeHour}
          changeMinute={changeMinute}
          changeSecond={changeSecond}
        />
        <RecordGame
          userGames={userGames}
          setGameRecord={setGameRecord}
          presetGame={game.id}
        />
        <RecordPlayer
          userFriends={userFriends}
          friendSlots={friendSlots}
          changeFriendSlot={changeFriendSlot}
          creator={{ avatar, id, name }}
          addScoreList={addScoreList}
          updateScoreList={updateScoreList}
          deleteScoreList={deleteScoreList}
          isWinner={isWinner}
        />
      </ScrollView>
      <Button
        title={'Edit Score!'}
        icon={
          <Icon
            name='check-circle'
            type='font-awesome'
            color='white'
          />
        }
        onPress={editScoreAction}
      />
    </>
  )
}