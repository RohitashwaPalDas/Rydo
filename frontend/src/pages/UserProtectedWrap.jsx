import React, { useState, useEffect, useContext } from "react";
import { UserDataContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const UserProtectedWrap = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { user, setUser } = useContext(UserDataContext);
  const [loading, setLoading] = useState(true);
  const backEndUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    axios
      .get(
        backEndUrl + "/api/user/get-user",
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
          setLoading(false);
        }
      }) 
      .catch(err => {
                console.log(err)
                localStorage.removeItem('token')
                navigate('/login')
            });
  }, []);

  if (loading) {
      return <div>Loading...</div>;
    }

  return <div>{children}</div>;
};

export default UserProtectedWrap;
