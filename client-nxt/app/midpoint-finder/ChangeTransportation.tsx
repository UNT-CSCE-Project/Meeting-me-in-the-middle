import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faCar } from "@fortawesome/free-solid-svg-icons";
import { useState, MouseEventHandler } from "react";
import { useSharedStateDestructured } from "./sharedState";

interface ToggleButtonProps {
  children: React.ReactNode;
  onClick: MouseEventHandler;
  isActive: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  children,
  onClick,
  isActive,
}) => {
  return (
    <button
      style={{
        backgroundColor: isActive ? "#ccc" : "white",
        border: "1px solid #000",
        padding: "10px 20px",
        cursor: "pointer",
        color: isActive ? "#fff" : "#000",
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const ChangeTransportation = () => {
  const sharedState = useSharedStateDestructured();
  const {
    setNewDirections,
    travelMode,
    setTravelMode,
    originLocation,
    selectedPlace,
  } = sharedState;

  const handleTransportationChange = (mode: google.maps.TravelMode) => {
    setTravelMode(mode);
    // Update the directions request with the new travel mode
    const newRequest: google.maps.DirectionsRequest = {
      origin: originLocation,
      destination: selectedPlace?.formatted_address ?? "",
      travelMode: mode,
    };
    // Call the directions service with the new request
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(newRequest, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result !== null) {
        // Update the directions result
        setNewDirections(result);
      } else {
        console.error("Error updating directions:", status);
      }
    });
  };

  return (
    <div className="flex justify-start">
      <ToggleButton
        onClick={() => {
          handleTransportationChange(google.maps.TravelMode.DRIVING);
        }}
        isActive={travelMode === google.maps.TravelMode.DRIVING}
      >
        <FontAwesomeIcon icon={faCar} />
      </ToggleButton>
      <ToggleButton
        onClick={() => {
          handleTransportationChange(google.maps.TravelMode.TRANSIT);
        }}
        isActive={travelMode === google.maps.TravelMode.TRANSIT}
      >
        <FontAwesomeIcon icon={faBus} />
      </ToggleButton>
    </div>
  );
};
