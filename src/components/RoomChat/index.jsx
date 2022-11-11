import { Box, Button, Chip, TextField, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import React, { useRef, useState } from "react";
import "./style.css";

RoomChat.propTypes = {};
// let ws = {};
function RoomChat(props) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [listMessage, setListMessage] = useState([]);
  const [message, setMessage] = useState("");
  const [nameRoom, setNameRoom] = useState("");
  const [isHide, setIsHide] = useState(false);
  const [isConnectSw, setIsConnectSw] = useState(false);
  const ws = useRef(null);

  const setWebSocketConnection = () => {
    const socketConnection = new WebSocket(
      `ws://localhost:8080/ws?name=${username}`
    );

    socketConnection.onopen = () => {
      console.log("socket opened");
    };

    socketConnection.onclose = () => {
      console.log("socket closed");
    };

    socketConnection.onmessage = (event) => {
      const msgFromServer = JSON.parse(event.data);
      console.log("message", msgFromServer);
      listMessage.push(msgFromServer);

      let temp = [...listMessage];
      setListMessage(temp);
    };

    ws.current = socketConnection;
  };

  const handleSendMessage = () => {
    ws.current.send(
      JSON.stringify({
        action: "send-message",
        message: message,
      })
    );
    setMessage("");

    console.log("222222", listMessage);
  };

  const handleConnectSW = () => {
    if (email && username) {
      setIsHide(!isHide);
    }

    setWebSocketConnection();
  };

  const handleJoinRoomChat = () => {
    if (nameRoom) {
      setIsConnectSw(!isConnectSw);

      ws.current.send(
        JSON.stringify({ action: "join-room", message: message })
      );
    }
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h5">Simple Chat {nameRoom}</Typography>
        </Toolbar>
      </AppBar>
      <Box>
        <Box>
          <Box>
            <Box>
              <Box id="chat-messages">
                {listMessage.map((msg) => {
                  return <Box>{msg.message}</Box>;
                })}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* join */}
        {!isConnectSw && isHide && (
          <Box sx={{ display: "flex" }}>
            <Box sx={{ width: "90%" }}>
              <TextField
                sx={{ width: "100%", marginLeft: "20px" }}
                label="Room"
                variant="outlined"
                value={nameRoom}
                onChange={(e) => setNameRoom(e.target.value)}
              />
            </Box>
            <Box sx={{ marginLeft: "30px" }}>
              <Button
                sx={{ padding: "10px 50px" }}
                variant="contained"
                onClick={handleJoinRoomChat}
              >
                Join
              </Button>
            </Box>
          </Box>
        )}

        {/* send */}
        {isHide && isConnectSw && (
          <Box sx={{ display: "flex" }}>
            <Box sx={{ width: "90%" }}>
              <TextField
                sx={{ width: "100%", marginLeft: "20px" }}
                label="Message"
                variant="outlined"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Box>
            <Box sx={{ marginLeft: "30px" }}>
              <Button
                sx={{ padding: "10px 50px" }}
                variant="contained"
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </Box>
          </Box>
        )}

        {/* connect */}
        {!isHide && !isConnectSw && (
          <Box sx={{ display: "flex", marginLeft: "20px" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "90%",
                marginRight: "20px",
              }}
            >
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                sx={{ marginTop: "20px" }}
                id="outlined-basic"
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Box>
            <Box>
              <Button
                sx={{ padding: "10px 50px" }}
                variant="contained"
                onClick={handleConnectSW}
              >
                Connect
              </Button>
            </Box>
          </Box>
        )}

        {}
      </Box>
      <footer></footer>
    </>
  );
}

export default RoomChat;
