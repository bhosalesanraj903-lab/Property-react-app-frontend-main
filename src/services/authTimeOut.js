// src/services/authTimeOut.js
import { toast } from "react-hot-toast";

let logoutTimer;
let warningTimer;

export const startLogoutTimer = (navigate) => { // Accept navigate as a parameter
    // Clear any existing timers
    if (logoutTimer) clearTimeout(logoutTimer);
    if (warningTimer) clearTimeout(warningTimer);

    // 1. Set Warning at 13 minutes (2 mins before expiry)
    warningTimer = setTimeout(() => {
        toast("Your session will expire in 2 minutes!", {
            icon: "⚠️",
            duration: 5000,
            style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
    }, 13 * 60 * 1000); // 13 minutes

    // 2. Set Auto Logout at 15 minutes
    logoutTimer = setTimeout(() => {
        handleAutoLogout(navigate);
    }, 15 * 60 * 1000); // 15 minutes
};

const handleAutoLogout = (navigate) => {
    // Clear storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");

    toast.error("Session expired. Please login again.");

    if (navigate) {
        navigate("/login"); // Use navigate for routing
    } else {
        // Fallback if navigate is not available (shouldn't happen with App.js setup)
        window.location.href = "/login";
    }
};

// Optionally reset timer on user activity if you want to extend session
// This needs to be called from a component or an effect that tracks activity
export const resetTimerOnActivity = (navigate) => {
    const reset = () => startLogoutTimer(navigate); // Pass navigate here too

    window.addEventListener("mousemove", reset);
    window.addEventListener("keypress", reset);
    // Add other activity listeners as needed
};