import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
    const token = localStorage.getItem("adminToken")||localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    console.log("ADMIN TOKEN:", token);
    console.log("ROLE:", role);

    if (!token) {
        return <Navigate to="/adminlogin" replace />;
    }

    if (role !== "ADMIN") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}