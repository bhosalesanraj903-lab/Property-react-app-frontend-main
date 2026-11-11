import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './components/LandingPage'; // Your new landing page
import AdminLogin from './components/AdminLogin'; // Admin Login
import Login from './components/Login'; // User Login
import { startLogoutTimer } from './services/authTimeOut'; // Your logout service

// Placeholder for protected route (e.g., dashboard)
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    return token ? children : null;
};

// Main App Component
function App() {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken"); // Check for any token

    useEffect(() => {
        if (token) {
            // If user is already logged in, start the countdown
            startLogoutTimer(navigate);
        }
    }, [token, navigate]);

    return (
        <>
            <Toaster position="bottom-right" reverseOrder={false} />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} /> {/* Direct login route */}
                <Route path="/adminlogin" element={<AdminLogin />} />
                {/* Example Protected Route for a user dashboard */}
                <Route path="/home" element={
                    <ProtectedRoute>
                        {/* A simple placeholder for now */}
                        <div className="min-h-screen flex items-center justify-center bg-green-100 text-green-800 text-2xl">
                            Welcome to your Dashboard!
                            <button onClick={() => {
                                localStorage.removeItem('accessToken');
                                localStorage.removeItem('refreshToken');
                                localStorage.removeItem('role');
                                navigate('/');
                            }} className="ml-4 p-2 bg-green-600 text-white rounded">Logout</button>
                        </div>
                    </ProtectedRoute>
                } />
                {/* Example Admin Protected Route */}
                <Route path="/admin" element={
                    <ProtectedRoute> {/* You might want a separate AdminProtectedRoute */}
                        <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-800 text-2xl">
                            Welcome to the Admin Dashboard!
                            <button onClick={() => {
                                localStorage.removeItem('accessToken');
                                localStorage.removeItem('refreshToken');
                                localStorage.removeItem('role');
                                navigate('/adminlogin');
                            }} className="ml-4 p-2 bg-red-600 text-white rounded">Admin Logout</button>
                        </div>
                    </ProtectedRoute>
                } />
            </Routes>
        </>
    );
}

// Wrapper for BrowserRouter
function Root() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default Root;