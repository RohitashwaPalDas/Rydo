import React from "react";
import { SocketContext } from "../contexts/SocketContext";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useContext } from "react";
import axios from "axios";

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  socket.on("ride-ended", () => {
    navigate("/home");
  });

  console.log("Ride data:", ride);

  const backEndUrl = import.meta.env.VITE_BACKEND_URL;


  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Ride Payment",
      description: "Ride Fare Payment",
      order_id: order.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backEndUrl + "/api/ride/verifyrazorpay",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (data.success) {
            alert("Payment successful");
          } else {
            alert("Payment verification failed");
          }
        } catch (error) {
          console.error(error);
          alert("Error verifying payment");
        }
      },
      theme: {
        color: "#10B981", // Tailwind green-600
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const paymentHandler = async () => {
  if (!ride) return toast.error("No ride information available");

  try {
    const res = await axios.post(
      backEndUrl + "/api/ride/razorpay",
      { rideId: ride._id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (res.data.success) {
      initPay(res.data.order);
    } else {
      alert("Failed to create payment order");
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert("Payment failed. Please try again.");
  }
};


  return (
    <div className="h-screen">
      <Link
        to="/home"
        className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>
      <div className="h-1/2">
        <img
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="h-1/2 p-4">
        <div className="flex items-center justify-between">
          <img
            className="h-12"
            src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
            alt=""
          />
          <div className="text-right">
            <h2 className="text-lg font-medium capitalize">
              {ride?.driver.fullname.firstname +
                " " +
                ride?.driver.fullname.lastname}
            </h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">
              {ride?.driver.vehicle.plate}
            </h4>
            <p className="text-sm text-gray-600">Maruti Suzuki Alto</p>
          </div>
        </div>

        <div className="flex gap-2 justify-between flex-col items-center">
          <div className="w-full mt-5">
            <div className="flex items-center gap-5 p-3 border-b-2">
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className="text-lg font-medium">Destination Address</h3>
                <p className="text-sm -mt-1 text-gray-600">
                  {ride?.destination}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-3">
              <i className="ri-currency-line"></i>
              <div>
                <h3 className="text-lg font-medium">₹{ride?.fare} </h3>
                <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
              </div>
            </div>
          </div>
        </div>
        <button
          className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg"
          onClick={paymentHandler}
        >
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
