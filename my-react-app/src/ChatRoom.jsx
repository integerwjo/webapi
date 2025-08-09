import React, { useState, useEffect, useRef } from 'react';

const ChatRoom = ({ roomName = 'lobby' }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);

  // Get username from localStorage (adjust if you use context or props)
  const username = localStorage.getItem('username') || 'Guest';

  useEffect(() => {
    const socket = new WebSocket(`ws://10.66.137.15:8000/ws/chat/${roomName}/`);
    socketRef.current = socket;

    socket.onmessage = e => {
      const data = JSON.parse(e.data);
      setMessages(prev => [...prev, data.message]);
    };

    socket.onclose = () => console.log('Socket closed');

    return () => socket.close();
  }, [roomName]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socketRef.current.send(JSON.stringify({ message: input, user: username }));
    setInput('');
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: 'auto',
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          marginBottom: 12,
          fontWeight: '600',
          fontSize: '1.25rem',
          color: '#2c3e50',
          textAlign: 'center',
        }}
      >
        Welcome, {username}
      </div>

      <div
        style={{
          border: '1px solid #ccc',
          height: 200,
          overflowY: 'auto',
          padding: 12,
          backgroundColor: '#fff',
          borderRadius: 6,
          marginBottom: 12,
          fontSize: '0.9rem',
          color: '#34495e',
        }}
      >
        {messages.length === 0 && (
          <div style={{ color: '#aaa', fontStyle: 'italic', textAlign: 'center' }}>
            No messages yet
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            {msg}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flexGrow: 1,
            padding: '8px 12px',
            borderRadius: 4,
            border: '1px solid #ccc',
            fontSize: '1rem',
          }}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2c3e50',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
