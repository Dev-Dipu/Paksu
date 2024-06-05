// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://paksu-backend.onrender.com/');

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const joinChat = () => {
    setJoined(true);
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('message', { name, text: message });
      setMessage('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      {!joined ? (
        <div className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded"
          />
          <button onClick={joinChat} className="p-2 bg-blue-500 text-white rounded">
            Join Chat
          </button>
        </div>
      ) : (
        <div>
          <div className="chat-window border p-4 h-96 overflow-y-scroll">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <strong>{msg.name}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <div className="flex mt-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-l"
            />
            <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-r">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
