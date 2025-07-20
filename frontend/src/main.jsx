import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./contexts/UserContext.jsx";
import DriverContext from "./contexts/DriverContext.jsx";
import SocketProvider from "./contexts/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DriverContext>
      <UserContext>
        <SocketProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SocketProvider>
      </UserContext>
    </DriverContext>
  </StrictMode>
);
