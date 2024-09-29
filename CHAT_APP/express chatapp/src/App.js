import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io.connect('http://192.168.226.144:5000'); // Backend IP

function App() {
  const [message, setMessage] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  // Function to join a room
  const joinRoom = () => {
    if (roomCode !== '') {
      socket.emit('join_room', roomCode);
      setJoined(true);
    }
  };

  // Function to send a message
  const sendMessage = () => {
    if (message !== '') {
      const messageData = {
        roomCode: roomCode,
        message: message,
        sender: 'User',
        time: new Date().toLocaleTimeString(),
      };
  
      // Emit the message to the server
      socket.emit('send_message', messageData);
  
      // Clear the message input
      setMessage(''); // Clear the message input
    }
  };
  
  

  // Receive messages from the server
  useEffect(() => {
    const handleReceiveMessage = (messageData) => {
      setChatMessages((prevMessages) => [...prevMessages, messageData]);
    };
  
    socket.on('receive_message', handleReceiveMessage);
  
    // Cleanup function to remove the listener
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);
  
  

  return (
    <div className="App">
      <div className="chat-container">
        {!joined ? (
          <div className="room-container">
            <input
              type="text"
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <button onClick={joinRoom}>Join Room</button>
          </div>
        ) : (
          <div className="chat-room">
            <div className="messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className="message">
                  <span>{msg.sender}: </span>
                  <span>{msg.message}</span>
                  <span className="time">{msg.time}</span>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
