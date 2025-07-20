import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DriverLogout = () => {
  const token = localStorage.getItem("token");
  const backEndUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  console.log(token);

  axios.post(backEndUrl + "/api/driver/logout", {},  {
    headers: { Authorization: `Bearer ${token}` },
  }).then((response)=>{
    if(response.data.success){
        localStorage.removeItem('token');
        navigate('/driverlogin')
    }
  })

  return <div>Logging you out....</div>;
};

export default DriverLogout;
