import { createBrowserRouter } from "react-router-dom";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminContacts from "./AdminContacts";
import AdminLayout from "./AdminLayout";
import AdminRoute from "./AdminRoute";
import AdminLogin from "./Auth/AdminLogin";
import AdminRegistration from "./Auth/AdminRegistration";
import Login from "./Auth/Login";
import Bookings from "./Bookings";
import Layout from "./Layout";
import PrivateRoute from "./PrivateRoute";
import PublicLayout from "./PublicLayout";
import Users from "./Users";
import Buy from "./pages/Buy";
import Contact from "./pages/Contact";
import Featured from "./pages/Featured";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Rent from "./pages/Rent";
import AdminProperties from "./AdminProperties";

export const MyRoutes = createBrowserRouter([


  // 🌐 PUBLIC
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "login", element: <Login /> },
      { path: "adminlogin", element: <AdminLogin /> },
      { path: "adminregister", element: <AdminRegistration /> },
    ],
  },

  // 👤 USER PROTECTED
  {
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      { path: "home", element: <Home /> },
      { path: "buy", element: <Buy /> },
      { path: "rent", element: <Rent /> },
      { path: "featured", element: <Featured /> },
      { path: "contact", element: <Contact /> },
    ],
  },

  // 🛡️ ADMIN PROTECTED (NO PrivateRoute here ❗)
  {
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { path: "admin", element: <AdminDashboard /> },
      { path: "admin/users", element: <Users /> },
      { path: "admin/bookings", element: <Bookings /> },
      { path: "admin/contacts", element: <AdminContacts /> },
      { path: "admin/properties", element: <AdminProperties /> },
    ],
  },
],
  {
    /* ✅ This is the second argument to createBrowserRouter.
       Add other flags here as they appear in warnings.
    */
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
