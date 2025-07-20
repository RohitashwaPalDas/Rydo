import React, { useState, useEffect, useContext } from "react";
import { DriverDataContext } from "../contexts/DriverContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const DriverProtectedWrap = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { driver, setDriver } = useContext(DriverDataContext);
  const [loading, setLoading] = useState(true);
  const backEndUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!token) {
      navigate("/driverlogin");
    }
    axios
      .get(
        backEndUrl + "/api/driver/get-driver",
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        if (response.status === 200) {
          setDriver(response.data);
          setLoading(false);
        }
      }) 
      .catch(err => {
                console.log(err)
                localStorage.removeItem('token')
                navigate('/driverlogin')
            });
  }, []);

  if (loading) {
      return <div>Loading...</div>;
    }

  return <div>{children}</div>;
};

export default DriverProtectedWrap;
