import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  TextField,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import dayjs from "dayjs";

const ChatScreen = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]); // { user, message, time }
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const username = localStorage.getItem("username") || "Guest";
  const token = localStorage.getItem("access");
  const WS_URL = `ws://${window.location.hostname}:8000/ws/chat/?token=${token}`;

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => console.log("WS opened:", WS_URL);
    ws.onerror = (err) => console.error("WebSocket error:", err);

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);

        // Matches structure from your Django consumer
        if (data.message !== undefined && data.user !== undefined) {
          setMessages((prev) => [
            ...prev,
            {
              user: data.user || "Anonymous",
              message: data.message || "",
              time: data.timestamp
                ? dayjs(data.timestamp).format("HH:mm")
                : dayjs().format("HH:mm"),
            },
          ]);
        } else {
          parseAndPushString(e.data);
        }
      } catch {
        parseAndPushString(e.data);
      }
    };

    setSocket(ws);
    return () => {
      try {
        ws.close();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [WS_URL]);

  const parseAndPushString = (txt) => {
    if (!txt) return;
    const idx = txt.indexOf(":");
    if (idx > 0) {
      const user = txt.slice(0, idx).trim();
      const message = txt.slice(idx + 1).trim();
      setMessages((prev) => [
        ...prev,
        { user: user || "Anonymous", message, time: dayjs().format("HH:mm") },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { user: "Anonymous", message: txt, time: dayjs().format("HH:mm") },
      ]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const sendMessage = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    const text = input.trim();
    if (!text) return;

    // Matches expected backend format
    const payload = { message: text, user: username };
    try {
      socket.send(JSON.stringify(payload));
      setInput(""); // Clear after sending
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 560,
        mx: "auto",
        mt: 4,
        height: "82vh",
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
        bgcolor: "background.default",
      }}
    >
      {/* App Bar with username */}
      <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(to right, #0f3540ff, #1a4b5aff)' }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {username}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          bgcolor: "#020512ff",
        }}
      >
        {messages.map((m, i) => (
          <Paper
            key={i}
            elevation={0}
            sx={{
              p: 1,
              mb: 1.25,
              borderRadius: 1.2,
              border: "1px solid rgba(0,0,0,0.06)",
              bgcolor: "white",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "#075E54", fontWeight: 600 }}
            >
              {m.user ?? "Anonymous"}
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.4 }}>
              {m.message}
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: "block", textAlign: "right", color: "gray" }}
            >
              {m.time}
            </Typography>
          </Paper>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box
        component="form"
        onSubmit={sendMessage}
        sx={{
          display: "flex",
          gap: 1,
          p: 1,
          alignItems: "center",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          bgcolor: "white",
        }}
      >
        <TextField
          placeholder="Be polite..."
          size="small"
          fullWidth
          value={input}
          onChange={(e) => {
            if (e.target.value.length <= 100) setInput(e.target.value);
          }}
          inputProps={{ maxLength: 100 }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "#f6f6f6",
            },
          }}
        />

        <IconButton
          onClick={sendMessage}
          disabled={!input.trim()}
          sx={{
            bgcolor: "#128C7E",
            color: "white",
            "&:hover": { bgcolor: "#0e6f5f" },
            borderRadius: 2,
            p: 1,
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatScreen;
