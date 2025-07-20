import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogout = () => {
  const token = localStorage.getItem("token");
  const backEndUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  console.log(token);

  axios.post(backEndUrl + "/api/user/logout", {},  {
    headers: { Authorization: `Bearer ${token}` },
  }).then((response)=>{
    if(response.data.success){
        localStorage.removeItem('token');
        navigate('/login')
    }
  })

  return <div>Logging you out....</div>;
};

export default UserLogout;
