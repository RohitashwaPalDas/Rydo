import React from "react";

const LocationSearchPanel = ({
  setVehiclePanel,
  setPanelOpen,
  suggestions,
  setPickup,
  setDestination,
  activeField,
}) => {
  const handleSuggestionClick = (suggestion) => {
    if (activeField === "pickup") {
      setPickup(suggestion);
    } else if (activeField === "destination") {
      setDestination(suggestion);
    }
  };
  return (
    <div className="mt-10 sm:mt-28">
      {suggestions?.map((elem, idx) => (
        <div
          key={idx}
          className="flex gap-4 border-2 p-3 border-gray-300 active:border-black rounded-xl items-center my-2 justify-start"
          onClick={() => handleSuggestionClick(elem)}
        >
          <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
            <i className="ri-map-pin-fill"></i>
          </h2>
          <h4 className="font-medium">{elem}</h4>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
