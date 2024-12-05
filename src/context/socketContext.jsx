import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { token, id } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (token) {
      // Initialize socket connection with auth token
      const newSocket = io(import.meta.env.VITE_BACKEND_SOCKET, {
        auth: { token },
        query: { id },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      });

      // Connection events
      newSocket.on('connect', () => {
        // console.log('Socket connected');
        toast.success('Real-time connection established');
        newSocket.emit('authenticate', id );

      });
      newSocket.on('notification', (data) => {
        toast(data.message, {
          description: data.description,
          type: data.type || 'info',
        });
      });

      newSocket.on('connect_error', (error) => {
        // console.error('Socket connection error:', error);
        toast.error('Real-time connection failed');
      });

      newSocket.on('disconnect', (reason) => {
        if (reason === 'io server disconnect') {
          newSocket.connect();
        }
      });

      // Handle notifications
      newSocket.on('notification', (data) => {
        // console.log(data);
        toast(data.message, {
          description: data.description,
          type: data.type || 'info',
        });
      });

      setSocket(newSocket);
      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    }
  }, [token, id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => { 
  const socket = useContext(SocketContext);
  if (!socket) {
    toast.error('useSocket must be used within a SocketProvider');
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return socket;
};