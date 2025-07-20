import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import DriverDetails from "../components/DriverDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DriverDataContext } from "../contexts/DriverContext";
import { SocketContext } from "../contexts/SocketContext";
import axios from "axios";
import LiveLocationMap from "../components/LiveTracking";

const DriverHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);
  const [driverStats, setDriverStats] = useState({});

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

  const { socket } = useContext(SocketContext);
  const { driver } = useContext(DriverDataContext);

  const backEndUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchDriverStats = async () => {
    try {
      console.log("Fetching driver stats for:", driver._id);
      const res = await axios.get(backEndUrl + `/api/driver/driverdetails`, {
        params: { driverId: driver._id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setDriverStats(res.data.message);
    } catch (err) {
      console.log(err);
      setDriverStats({ totalRides: 0, totalEarnings: 0, totalTime: 0, totalDistance: 0 });
    }
  };

  useEffect(() => {
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit("update-location-driver", {
            userId: driver._id,
            location: {
              type: "Point",
              coordinates: [
                position.coords.longitude,
                position.coords.latitude,
              ],
            },
          });
        });
      }
    };
    updateLocation();
  }, []);

  useEffect(() => {
    fetchDriverStats();
  }, [driver._id]);

  socket.on("new-ride", (data) => {
    setRide(data);
    setRidePopupPanel(true);
  });

  async function confirmRide() {
    const response = await axios.post(
      backEndUrl + "/api/ride/confirm",
      {
        rideId: ride._id,
        driverId: driver._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setRidePopupPanel(false);
    setConfirmRidePopupPanel(true);
  }

  useGSAP(
    function () {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(ridePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [ridePopupPanel]
  );

  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePopupPanel]
  );

  return (
    <div className="h-screen">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <div className="text-black text-3xl font-bold prata-regular absolute top-5 left-4 bg-white/50 md:text-4xl">
          Rydo
        </div>
      </div>
      <div className="h-3/5">
        <LiveLocationMap />
      </div>

      <div className="h-2/5 p-6 z-10 bg-white">
        <DriverDetails driverStats={driverStats} />
      </div>

      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 md:px-6 lg:px-10"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>

      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full h-screen z-20 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 md:px-6 lg:px-10"
      >
        <ConfirmRidePopUp
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
          ride={ride}
        />
      </div>
    </div>
  );
};

export default DriverHome;
