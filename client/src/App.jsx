import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ToastProvider } from "./context/ToastContext";
import { Toaster } from "./components/ui/toaster";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <SocketProvider>
                      <Dashboard />
                    </SocketProvider>
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
