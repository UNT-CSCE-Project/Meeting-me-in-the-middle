"use client";
import { MyMap } from "./Map";
import { SuggestedPlaces } from "./SuggestedPlaces";
import { useSharedState, SharedStateProvider } from "./sharedState";
import useDirections from "./Midpoint"; // Import the hook
import usePlaceOperations from "./usePlaceSelect"; // Import the custom hook
import { MapPinIcon } from '@heroicons/react/24/outline';

import { Position, GeocodeResponse } from "@/app/lib/location/definitions";

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
    error,
    setError
  } = sharedState;

  const { calculateMidpoint } = useDirections(); // Use the hook
  const { updatePlaces } = usePlaceOperations(); // Use the hook
  console.log("error", error)
  const getAddress = async (latitude: number, longitude: number): Promise<void> => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data: GeocodeResponse = await response.json();
        console.log(latitude, longitude, data.results[0]);
        if (data.status === 'OK' && data.results[0]) {
          setOriginLocation(`${data.results[0]?.formatted_address}`);
        } else {
          console.error('No address found');
          setError('No address found')
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        setError('Error fetching address')
      }
    };
  const handleLocationClick = () => {
    setOriginLocation(`Loading...`);
    navigator.geolocation.getCurrentPosition((position: Position) => {

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      getAddress(latitude, longitude);
    });
  };  
  
  return (
    <div className="flex flex-row h-screen w-full px-4  py-4">
      <div
        style={{
          backgroundColor: "lightGray",
        }}
        className="w-1/2 h-full flex flex-col items-start border-2 border-black p-4 rounded-md"
      >
        <div className="h-1/2 w-full">
          <h1 className="text-lg font-bold">Midpoint Finder</h1>
          <p className="text-md font-bold">Your Location:</p>

          <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
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
            <MapPinIcon className="absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-blue-500  hover:text-red-700 focus:text-blue-700 peer-focus:text-blue-900" 
             onClick={handleLocationClick}
              />
          </div>
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
        { error && <p className="text-red-500">{error}</p> }
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