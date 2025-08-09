import React, { useEffect, useState } from 'react';

const ChatScreen = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('access');
    const ws = new WebSocket(`ws://10.66.137.15:8000/ws/chat/?token=${token}`);

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, `${data.user}: ${data.message}`]);
    };
    setSocket(ws);
    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (socket && input.trim()) {
      socket.send(JSON.stringify({ message: input, user: "You" }));
      setInput('');
    }
  };

  return (
    <div>
      <h3>Global Chat</h3>
      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
        {messages.map((msg, i) => <div key={i}>{msg}</div>)}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatScreen;
