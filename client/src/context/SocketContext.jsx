import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useToast } from '../hooks/useToast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      initializeSocket();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  const initializeSocket = () => {
    const token = localStorage.getItem("token");

    const newSocket = io(
      import.meta.env.VITE_SERVER_URL || "http://localhost:5000",
      {
        auth: { token },
      }
    );

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setConnected(true);
      toast({
        title: "Connected",
        description: "Real-time features are now active",
        variant: "success",
        duration: 3000,
      });
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setConnected(false);
      toast({
        title: "Disconnected",
        description: "Connection lost. Trying to reconnect...",
        variant: "warning",
        duration: 3000,
      });
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to real-time services",
        variant: "destructive",
        duration: 5000,
      });
    });

    newSocket.on("user_tagged", (data) => {
      const { notification, candidate } = data;

      toast({
        title: "You were tagged!",
        description: `Tagged in ${candidate.name}'s notes`,
        variant: "default",
        duration: 5000,
      });

      setNotifications((prev) => [notification, ...prev]);
    });

    newSocket.on("notification_count_updated", (data) => {
      setUnreadCount(data.unreadCount);
    });

    setSocket(newSocket);
  };

  const value = {
    socket,
    connected,
    notifications,
    unreadCount,
    setNotifications,
    setUnreadCount,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
