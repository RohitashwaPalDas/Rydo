import React, { useRef, useState, useEffect, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import axios from "axios";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { UserDataContext } from "../contexts/UserContext";
import { SocketContext } from "../contexts/SocketContext";
import { useNavigate } from "react-router-dom";
import LiveLocationMap from "../components/LiveTracking";

const UserHome = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const backEndUrl = import.meta.env.VITE_BACKEND_URL;
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("join", { userType: "user", userId: user._id });
  }, [user]);

  socket.on("ride-confirmed", (ride) => {
    console.log("Ride COnfirmed:", ride);
    setVehicleFound(false);
    setWaitingForDriver(true);
    setRide(ride);
  });

  socket.on("ride-started", (ride) => {
    setWaitingForDriver(false);
    navigate("/riding", { state: { ride } }); // Updated navigate to include ride data
  });

  const handlePickupChange = async (e) => {
    const query = e.target.value;
    setPickup(query);

    try {
      const response = await axios.get(
        `${backEndUrl}/api/map/get-suggestions?query=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPickupSuggestions(response.data.suggestions); 
    } catch (error) {
      console.log(error);
    }
  };

  const handleDestinationChange = async (e) => {
    const query = e.target.value;
    setDestination(query);

    try {
      const response = await axios.get(
        `${backEndUrl}/api/map/get-suggestions?query=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDestinationSuggestions(response.data.suggestions);
    } catch (error) {
      console.log(error);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  async function findTrip() {
    setVehiclePanel(true);
    setPanelOpen(false);

    try {
      const res = await axios.get(backEndUrl + "/api/ride/get-fare", {
        params: {
          pickup: pickup,
          destination: destination,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(res.data);
      setFare(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function createRide() {
    try {
      const response = await axios.post(
        backEndUrl + "/api/ride/create",
        {
          pickup,
          destination,
          vehicleType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
          duration: 0.4,
          padding: 24,
          // opacity:1
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
          duration: 0.4,
          padding: 0,
          // opacity:0
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen]
  );

  useGSAP(
    function () {
      if (vehiclePanel) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanel]
  );

  useGSAP(
    function () {
      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePanel]
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound]
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(200%)",
        });
      }
    },
    [waitingForDriver]
  );

  return (
    <div className="h-screen relative overflow-hidden">
  <div className="text-black text-3xl font-bold prata-regular absolute top-5 left-5 md:text-4xl">
    Rydo
  </div>

  <div className="h-screen w-screen">
    <LiveLocationMap />
  </div>

  <div className="h-full flex flex-col justify-end absolute top-0 w-full">
    <div className="h-[30%] p-5 bg-white relative md:h-[25%] lg:h-[20%]">
      <h5
        ref={panelCloseRef}
        onClick={() => {
          setPanelOpen(false);
        }}
        className="absolute opacity-0 right-6 top-6 text-2xl cursor-pointer"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>
      <h4 className="text-2xl font-semibold md:text-3xl">Find a trip</h4>
      <form
        className="relative py-3"
        onSubmit={(e) => {
          submitHandler(e);
        }}
      >
        <div className="line absolute h-16 w-1 top-[60%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
        <input
          onClick={() => {
            setPanelOpen(true);
            setActiveField("pickup");
          }}
          type="text"
          value={pickup}
          onChange={(e) => {
            handlePickupChange(e);
          }}
          placeholder="Add a pick-up location"
          className="bg-[#eee] px-12 py-2 text-lg rounded-lg mt-5 w-full md:text-xl"
        />
        <input
          onClick={() => {
            setPanelOpen(true);
            setActiveField("destination");
          }}
          type="text"
          value={destination}
          onChange={(e) => {
            handleDestinationChange(e);
          }}
          placeholder="Enter your destination"
          className="bg-[#eee] px-12 py-2 text-lg rounded-lg mt-3 w-full md:text-xl"
        />
      </form>
      <button
        className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full md:text-lg"
        onClick={findTrip}
      >
        Find Trip
      </button>
    </div>

    <div
      ref={panelRef}
      className="bg-white overflow-y-auto"
      style={{ height: "0%" }}
    >
      <LocationSearchPanel
        setVehiclePanel={setVehiclePanel}
        setPanelOpen={setPanelOpen}
        suggestions={
          activeField === "pickup"
            ? pickupSuggestions
            : destinationSuggestions
        }
        setPickup={setPickup}
        setDestination={setDestination}
        activeField={activeField}
      />
    </div>
  </div>

  <div
    ref={vehiclePanelRef}
    className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 md:px-6 lg:px-10"
  >
    <VehiclePanel
      setVehiclePanel={setVehiclePanel}
      setConfirmRidePanel={setConfirmRidePanel}
      fare={fare}
      selectVehicle={setVehicleType}
    />
  </div>

  <div
    ref={confirmRidePanelRef}
    className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 md:px-6 lg:px-10"
  >
    <ConfirmRide
      createRide={createRide}
      pickup={pickup}
      destination={destination}
      fare={fare}
      vehicleType={vehicleType}
      setConfirmRidePanel={setConfirmRidePanel}
      setVehicleFound={setVehicleFound}
    />
  </div>

  <div
    ref={vehicleFoundRef}
    className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 md:px-6 lg:px-10"
  >
    <LookingForDriver
      setVehicleFound={setVehicleFound}
      pickup={pickup}
      destination={destination}
      fare={fare}
      vehicleType={vehicleType}
    />
  </div>

  <div
    ref={waitingForDriverRef}
    className="fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12 md:px-6 lg:px-10"
  >
    <WaitingForDriver
      waitingForDriver={waitingForDriver}
      ride={ride}
      setVehicleFound={setVehicleFound}
      setWaitingForDriver={setWaitingForDriver}
    />
  </div>
</div>
  );
};

export default UserHome;
