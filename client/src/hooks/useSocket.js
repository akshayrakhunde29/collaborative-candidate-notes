import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "../utils/constants";

export const useSocket = (candidateId) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(
      import.meta.env.VITE_SERVER_URL || "http://localhost:5000",
      {
        auth: { token },
      }
    );

    newSocket.on("connect", () => {
      setConnected(true);
      if (candidateId) {
        newSocket.emit(SOCKET_EVENTS.CLIENT_TO_SERVER.JOIN_ROOM, candidateId);
      }
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
    });

    newSocket.on(SOCKET_EVENTS.SERVER_TO_CLIENT.MESSAGE_RECEIVED, (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on(
      SOCKET_EVENTS.SERVER_TO_CLIENT.USER_TYPING,
      ({ userId, userName, isTyping }) => {
        setTypingUsers((prev) => {
          if (isTyping) {
            return prev.includes(userName) ? prev : [...prev, userName];
          } else {
            return prev.filter((name) => name !== userName);
          }
        });
      }
    );

    setSocket(newSocket);

    return () => {
      if (candidateId) {
        newSocket.emit(SOCKET_EVENTS.CLIENT_TO_SERVER.LEAVE_ROOM, candidateId);
      }
      newSocket.close();
    };
  }, [candidateId]);

  const sendMessage = useCallback(
    (content, taggedUsers = []) => {
      if (socket && candidateId) {
        socket.emit(SOCKET_EVENTS.CLIENT_TO_SERVER.SEND_MESSAGE, {
          candidateId,
          content,
          taggedUsers,
        });
      }
    },
    [socket, candidateId]
  );

  const sendTyping = useCallback(
    (isTyping) => {
      if (socket && candidateId) {
        socket.emit(SOCKET_EVENTS.CLIENT_TO_SERVER.TYPING, {
          candidateId,
          isTyping,
        });
      }
    },
    [socket, candidateId]
  );

  return {
    socket,
    messages,
    setMessages,
    typingUsers,
    connected,
    sendMessage,
    sendTyping,
  };
};
