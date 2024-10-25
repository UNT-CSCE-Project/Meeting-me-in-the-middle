"use client";
import { MyMap } from "./Map";
import { SuggestedPlaces } from "./SuggestedPlaces";
import { useSharedState, SharedStateProvider } from "./sharedState";
import useDirections from "./Midpoint"; // Import the hook
import usePlaceOperations from "./usePlaceSelect"; // Import the custom hook

export default function MidpointFinder() {
  return (
    <SharedStateProvider>
      <MidpointFinderInner />
    </SharedStateProvider>
  );
}

function MidpointFinderInner() {
  const sharedState = useSharedState();
  const {
    originLocation,
    setOriginLocation,
    destinationLocation,
    setDestinationLocation,
    placeType,
    setPlaceType,
  } = sharedState;

  const { calculateMidpoint } = useDirections(); // Use the hook
  const { updatePlaces } = usePlaceOperations(); // Use the hook

  return (
    <div className="flex flex-row h-screen w-full">
      <div
        style={{
          backgroundColor: "lightGray",
        }}
        className="w-1/2 h-full flex flex-col items-start border-2 border-black p-4 rounded-md"
      >
        <div className="h-1/2 w-full">
          <h1 className="text-lg font-bold">Midpoint Finder</h1>
          <p className="text-md font-bold">Your Location:</p>
          <input
            type="text"
            value={originLocation}
            onChange={(e) => setOriginLocation(e.target.value)}
            placeholder="Enter origin location"
            style={{
              boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
            }}
            className="w-full p-2 mb-2 rounded-md"
          />
          <p className="text-md font-bold">Friend's Location:</p>
          <input
            type="text"
            value={destinationLocation}
            onChange={(e) => setDestinationLocation(e.target.value)}
            placeholder="Enter destination location"
            style={{
              boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
            }}
            className="w-full p-2 mb-2 rounded-md"
          />
          <p className="text-md font-bold">Select Location Type:</p>
          <select
            value={placeType}
            onChange={(e) => {
              setPlaceType(e.target.value);
              updatePlaces(e.target.value);
            }}
            style={{
              width: "200px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
            }}
            className="bg-white text-black p-2 rounded-md"
          >
            <option value="restaurant">Restaurant</option>
            <option value="store">Store</option>
            <option value="cafe">Cafe</option>
            <option value="park">Park</option>
          </select>
          <button
            onClick={calculateMidpoint}
            style={{
              width: "100px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              backgroundColor: "black",
              borderRadius: "20px",
            }}
            className="text-white p-2 rounded-md"
          >
            Search
          </button>
        </div>
        <div className="h-2/3 w-full">
          <SuggestedPlaces />
        </div>
      </div>
      <div className="w-1/2 h-full">
        <MyMap />
      </div>
    </div>
  );
}
