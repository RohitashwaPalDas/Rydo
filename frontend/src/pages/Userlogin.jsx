import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../contexts/UserContext";

const Userlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const backEndUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const { user } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(email, password);
    const userData = {
      email: email,
      password: password,
    };
    const res = await axios.post(backEndUrl + "/api/user/login", userData);
    console.log(res);
    if (res.data.success) {
      navigate("/home");
      localStorage.setItem("token", res.data.token);
    }
    setEmail("");
    setPassword("");
  };

 

  

  return (
    <div>
      <div className="p-7 h-screen flex flex-col justify-between">
        <div>
          <div className="text-black text-2xl prata-regular w-16 mb-10 font-bold">
            Rydo
          </div>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <h3 className="text-lg font-medium mb-2">What's your email</h3>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
              type="email"
              placeholder="email@example.com"
            />

            <h3 className="text-lg font-medium mb-2">Enter Password</h3>

            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
              required
              type="password"
              placeholder="password"
            />

            <button className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base">
              Login
            </button>
          </form>
          <p className="text-center">
            New here?{" "}
            <Link to="/signup" className="text-blue-600">
              Create new Account
            </Link>
          </p>
        </div>
        <div>
          <Link
            to="/driverlogin"
            className="bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base"
          >
            Sign in as Cab Driver
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Userlogin;
