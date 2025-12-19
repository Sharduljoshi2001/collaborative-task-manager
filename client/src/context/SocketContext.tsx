import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

//defining the context shape
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

//getting backend url from env or defaulting to localhost:3000
//removing /api if present because socket connects to root
const SOCKET_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '') 
  : 'http://localhost:3000';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth(); //we need user token for connection

  useEffect(() => {
    //only connect if user is logged in
    if (user) {
      const token = localStorage.getItem('token');
      
      //initializing socket connection with auth token
      console.log("Attempting socket connection to:", SOCKET_URL);
      
      const newSocket = io(SOCKET_URL, {
        auth: {
          token: `Bearer ${token}`
        },
        //transports ensure we use websockets first
        transports: ['websocket', 'polling'],
      });

      //listeners for connection status
      newSocket.on('connect', () => {
        console.log('socket connected successfully:', newSocket.id);
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('socket disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (err) => {
        console.error('socket connection error:', err.message);
      });

      setSocket(newSocket);

      //cleanup function to disconnect on unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]); //re-run if user changes (login/logout)

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

//custom hook to use socket
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};