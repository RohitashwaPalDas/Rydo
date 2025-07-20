import { Routes, Route } from "react-router-dom";
import Start from "./pages/Start";
import Userlogin from "./pages/Userlogin";
import Usersignup from "./pages/Usersignup";
import Driverlogin from "./pages/Driverlogin";
import Driversignup from "./pages/Driversignup";
import UserHome from "./pages/UserHome";
import UserProtectedWrap from "./pages/UserProtectedWrap";
import UserLogout from "./pages/UserLogout";
import DriverProtectedWrap from "./pages/DriverProtectedWrap";
import DriverHome from "./pages/DriverHome";
import DriverLogout from "./pages/DriverLogout";
import Riding from "./pages/Riding";
import DriverRiding from "./pages/DriverRiding";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Start />}></Route>
      <Route path="/login" element={<Userlogin />}></Route>
      <Route path="/riding" element={<Riding />}></Route>
      <Route path="/driver-riding" element={<DriverRiding />}></Route>
      <Route path="/signup" element={<Usersignup />}></Route>
      <Route path="/driverlogin" element={<Driverlogin />}></Route>
      <Route path="/driversignup" element={<Driversignup />}></Route>
      <Route
        path="/home"
        element={
          <UserProtectedWrap>
            <UserHome />
          </UserProtectedWrap>
        }
      ></Route>

      <Route
        path="/logout"
        element={
          <UserProtectedWrap>
            <UserLogout />
          </UserProtectedWrap>
        }
      ></Route>

      <Route
        path="/driverhome"
        element={
          <DriverProtectedWrap>
            <DriverHome/>
          </DriverProtectedWrap>
        }
      ></Route>

      <Route
        path="/driverlogout"
        element={
          <DriverProtectedWrap>
            <DriverLogout/>
          </DriverProtectedWrap>
        }
      ></Route>
    </Routes>
  );
};

export default App;


