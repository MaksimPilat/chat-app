import './App.css';
import React from 'react';
import { JoinForm } from './components/JoinForm';
import { Room } from './components/Room';
import socket from './socket';
import axios from 'axios';
import { reducer } from './reducer';

function App() {

  const [state, dispatch] = React.useReducer(reducer, {
    isJoined: false,
    roomId: "",
    userName: "",
    users: [],
    messages: []
  });

  const onEnterRoom = async (data) => {
    const { messages } = (await axios.get(`/rooms/${data.roomId}`)).data;
    dispatch({
      type: "JOIN_ROOM",
      payload: {
        isJoined: true,
        roomId: data.roomId,
        userName: data.userName,
        messages: messages
      }
    });
    socket.emit('ROOM:JOIN', data);
  };
  
  React.useEffect(() => {
    socket.on('ROOM:SET_USERS', users => dispatch({
      type: "SET_USERS",
      payload: users
    }));
    socket.on('ROOM:NEW_MESSAGE', message => dispatch({
      type: "ADD_MESSAGE",
      payload: message
    }));
  }, []);

  return (
    <div className="App flex flex-col justify-center items-center text-center">
      <div className="max-w-1200px mx-auto w-full">
        {state.isJoined
          ? <Room
            id={state.roomId}
            userName={state.userName}
            users={state.users}
            messages={state.messages} 
          />
        : <JoinForm onEnter={onEnterRoom} />}
      </div>
    </div>
  );
}

export default App;
