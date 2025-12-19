import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  authService,
  type LoginCredentials,
  type RegisterCredentials,
} from "../services/auth";
import type { User } from "../types";

// defining what data and functions this context will provide
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

// creating the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// main provider component that wraps the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // checking if user is already logged in when app starts
  useEffect(() => {
    const initAuth = () => {
      try {
        // getting user from local storage via service
        const savedUser = authService.getCurrentUser();
        if (savedUser) {
          setUser(savedUser);
        }
      } catch (error) {
        console.error("Auth restoration failed", error);
      } finally {
        // loading finished whether user found or not
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // login functionality
  const login = async (credentials: LoginCredentials) => {
    try {
      // calling the login service
      console.log("USER LOGGING INNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN");
      const response = await authService.login(credentials);
      console.log("2. Backend Response:", response);
      // if response has data
      if (response.token && response.data) {
        console.log("3. Data Found, Saving User...");
        const { token, data:user } = response;
        // saving to browser storage so data persists on refresh
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        // updating global user state
        setUser(user);
      }
    } catch (error) {
      // passing error to component to show invalid credentials
      throw error;
    }
  };

  // register functionality
  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await authService.register(credentials);

      if (response.token&&response.data) {
        const { token, data:user } = response;
        // saving user and token
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      }
    } catch (error) {
      throw error;
    }
  };

  // logout functionality
  const logout = () => {
    // cleaning storage
    authService.logout();
    // setting user state to null
    setUser(null);
    // redirecting to login page
    window.location.href = "/login";
  };

  // values exposed to the app
  const value = {
    user,
    isAuthenticated: !!user, // true if user exists, false otherwise
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* rendering children only after initial loading is done */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// custom hook to easily use auth context in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
