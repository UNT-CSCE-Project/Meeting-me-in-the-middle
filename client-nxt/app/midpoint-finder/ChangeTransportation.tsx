import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faCar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, MouseEventHandler } from "react";
import { useSharedStateDestructured } from "./sharedState";

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
    },
    transit: {
      boarderRadius: "0px 5px 5px 0px",
    },
  };

  const validModes = ["driving", "transit"];
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

  const handleTransportationChange = (mode: string) => {
    if (!selectedPlace) {
      console.error("No destination selected.");
      return;
    }
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
    </div>
  );
};
