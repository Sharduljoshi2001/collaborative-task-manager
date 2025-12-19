import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast'; //importing toaster
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
function App() {
  return (
    //providing user data to the whole app
    <AuthProvider>
      {/*socket provider needs auth context so it comes inside*/}
      <SocketProvider>
        <BrowserRouter>
          {/*placing toaster at the top level*/}
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          <Routes>
            {/*public routes*/}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/*protected routes*/}
            <Route element={<ProtectedRoute />}>
               <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/*redirects*/}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;