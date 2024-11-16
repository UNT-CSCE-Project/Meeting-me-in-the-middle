import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faCar,
  faBicycle,
  faWalking,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, MouseEventHandler } from "react";
import { useSharedStateDestructured } from "./sharedState";
import { setErrorMap } from "zod";

interface ToggleButtonProps {
  children: React.ReactNode;
  onClick: MouseEventHandler;
  isActive: boolean;
  mode: string;
}

export const getTravelMode = (mode: string): google.maps.TravelMode => {
  switch (mode) {
    case "DRIVING":
      return google.maps.TravelMode.DRIVING;
    case "TRANSIT":
      return google.maps.TravelMode.TRANSIT;
    case "BIKING":
      return google.maps.TravelMode.BICYCLING;
    case "WALKING":
      return google.maps.TravelMode.WALKING;
    default:
      return google.maps.TravelMode.DRIVING;
  }
};

const ToggleButton: React.FC<ToggleButtonProps> = ({
  children,
  onClick,
  isActive,
  mode,
}) => {
  const styles = {
    driving: {
      borderRadius: "5px 0px 0px 5px",
      boxShadow:
        "0px -2px 4px rgba(0, 0, 0, 0.2), -2px 0px 4px rgba(0, 0, 0, 0.2), 0px 2px 4px rgba(0, 0, 0, 0.2)",
    },
    transit: {
      boxShadow:
        "0px -2px 4px rgba(0, 0, 0, 0.2), 0px 2px 4px rgba(0, 0, 0, 0.2)",
    },
    biking: {
      boxShadow:
        "0px -2px 4px rgba(0, 0, 0, 0.2), 0px 2px 4px rgba(0, 0, 0, 0.2)",
    },
    walking: {
      borderRadius: "0px 5px 5px 0px",
      boxShadow:
        "2px 0px 4px rgba(0, 0, 0, 0.2), 0px -2px 4px rgba(0, 0, 0, 0.2), 0px 2px 4px rgba(0, 0, 0, 0.2)",
    },
  };

  const validModes = ["driving", "transit", "biking", "walking"];
  if (!validModes.includes(mode)) {
    throw new Error(`Invalid mode: ${mode}`);
  }

  return (
    <button
      style={{
        ...styles[mode as keyof typeof styles],
        backgroundColor: isActive ? "#ccc" : "white",
        border: "1px solid #000",
        padding: "10px 20px",
        cursor: "pointer",
        color: isActive ? "#fff" : "#000",
      }}
      type="button"
      aria-label="Toggle button"
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
    tripDuration,
    setTripDuration,
    setDistanceInMiles,
    error,
    setError,
  } = sharedState;

  const handleTransportationChange = (mode: string) => {
    if (!selectedPlace) {
      console.error("No place selected.");
      setError("No place selected.");
      return;
    }
    setError(null);
    setTravelMode(mode);
  };

  useEffect(() => {
    if (!selectedPlace) {
      console.error("No destination selected.");
      return;
    }
    console.log("Selected place:", selectedPlace?.geometry?.location);
    console.log("originLocation:", originLocation);
    const newRequest: google.maps.DirectionsRequest = {
      origin: originLocation,
      destination: selectedPlace?.geometry?.location ?? {
        lat: 0,
        lng: 0,
      },
      travelMode: google.maps.TravelMode[getTravelMode(travelMode)],
    };
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(newRequest, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result !== null) {
        const duration = result?.routes[0]?.legs[0]?.duration?.text;
        const distanceInMeters = result?.routes[0]?.legs[0]?.distance?.value;
        const distanceInMiles = distanceInMeters
          ? (distanceInMeters / 1000) * 0.621371
          : null;
        setTripDuration(duration ?? null);
        setDistanceInMiles(distanceInMiles?.valueOf() ?? 0);
        setNewDirections(result);
      } else if (status === google.maps.DirectionsStatus.NOT_FOUND) {
        console.error("No route found between the specified locations.");
      } else {
        console.error("Error updating directions:", status);
      }
    });
  }, [travelMode]);

  return (
    <div className="flex justify-start">
      <ToggleButton
        onClick={() => {
          handleTransportationChange("DRIVING");
        }}
        isActive={travelMode === "DRIVING"}
        mode="driving"
      >
        <FontAwesomeIcon icon={faCar} />
      </ToggleButton>
      <ToggleButton
        onClick={() => {
          handleTransportationChange("TRANSIT");
        }}
        isActive={travelMode === "TRANSIT"}
        mode="transit"
      >
        <FontAwesomeIcon icon={faBus} />
      </ToggleButton>
      <ToggleButton
        onClick={() => {
          handleTransportationChange("BIKING");
        }}
        isActive={travelMode === "BIKING"}
        mode="biking"
      >
        <FontAwesomeIcon icon={faBicycle} />
      </ToggleButton>
      <ToggleButton
        onClick={() => {
          handleTransportationChange("WALKING");
        }}
        isActive={travelMode === "WALKING"}
        mode="walking"
      >
        <FontAwesomeIcon icon={faWalking} />
      </ToggleButton>
    </div>
  );
};
