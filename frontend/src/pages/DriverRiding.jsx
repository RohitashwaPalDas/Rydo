import React, { useRef, useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SocketContext } from "../contexts/SocketContext";

const DriverRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const [paymentSts, setPaymentSts] = useState(false);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const rideData = location.state?.ride;
  console.log(rideData)

  useEffect(() => {
  if (!rideData?._id) return;

  const storedStatus = localStorage.getItem(`paymentSts_${rideData._id}`);
  if (storedStatus === "true") {
    setPaymentSts(true);
  }
}, [rideData]);

  const { socket } = useContext(SocketContext);

  socket.on("payment-success", (data) => {
    console.log("✅ Payment notification received:", data);
    setPaymentSts(data.success);
    localStorage.setItem(`paymentSts_${data.rideId}`, "true");
  });

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [finishRidePanel]
  );

  return (
    <div className="h-screen relative flex flex-col justify-end">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <div className="text-black text-3xl font-bold prata-regular bg-white/50">
          Rydo
        </div>
        <Link
          to="/driverhome"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div
        className="h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10"
        onClick={() => {
          setFinishRidePanel(true);
        }}
      >
        <h5
          className="p-1 text-center w-[90%] absolute top-0"
          onClick={() => {}}
        >
          <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
        </h5>
        <h4 className="text-xl font-semibold">{"4 KM away"}</h4>
        <button className=" bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
          Complete Ride
        </button>
      </div>
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <FinishRide
          setFinishRidePanel={setFinishRidePanel}
          ride={rideData}
          paymentSts={paymentSts}
        />
      </div>

      <div className="h-screen fixed w-screen top-0 z-[-1]">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>
    </div>
  );
};

export default DriverRiding;
