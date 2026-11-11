import {  RouterProvider} from "react-router-dom";
import { MyRoutes } from "./Component/MyRoutes.jsx";

const isAuth = () => localStorage.getItem("adminToken");


// const PrivateRoute = ({ children }) => {
// return isAuth() ? children : <Navigate to="/login" />;
// };

export default function App() {
  return (
    <>
  <RouterProvider router={MyRoutes}/>
    </>
  );
}
