"use client";

import { MyMap } from "./Map";
import { SuggestedPlaces } from "./SuggestedPlaces";
import { useSharedState, SharedStateProvider } from "./sharedState";
import useDirections from "./Midpoint";
import usePlaceOperations from "./usePlaceSelect";
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
    setError,
  } = sharedState;

  const { calculateMidpoint } = useDirections();
  const { updatePlaces } = usePlaceOperations();

  const getAddress = async (latitude: number, longitude: number): Promise<void> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data: GeocodeResponse = await response.json();
      if (data.status === 'OK' && data.results[0]) {
        setOriginLocation(data.results[0].formatted_address);
      } else {
        setError("No address found");
      }
    } catch (error) {
      setError("Error fetching address");
    }
  };

  const handleLocationClick = () => {
    setOriginLocation("Loading...");
    navigator.geolocation.getCurrentPosition((position: Position) => {
      const { latitude, longitude } = position.coords;
      getAddress(latitude, longitude);
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full p-6 bg-gray-100">
      <div className="w-full lg:w-1/2 flex flex-col gap-6 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Midpoint Finder</h1>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="origin-location" className="block text-lg font-medium text-gray-700">Your Location:</label>
            <MapPinIcon
              onClick={handleLocationClick}
              className="h-6 w-6 text-blue-500 hover:text-red-500 cursor-pointer"
            />
          </div>
          <input
            id="origin-location"
            type="text"
            value={originLocation}
            onChange={(e) => setOriginLocation(e.target.value)}
            placeholder="Enter origin location"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="destination-location" className="block text-lg font-medium text-gray-700">Friend's Location:</label>
          <input
            id="destination-location"
            type="text"
            value={destinationLocation}
            onChange={(e) => setDestinationLocation(e.target.value)}
            placeholder="Enter destination location"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="place-type" className="block text-lg font-medium text-gray-700">Select Location Type:</label>
          <select
            id="place-type"
            value={placeType}
            onChange={(e) => {
              setPlaceType(e.target.value);
              updatePlaces(e.target.value);
            }}
            className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="restaurant">Restaurant</option>
            <option value="store">Store</option>
            <option value="cafe">Cafe</option>
            <option value="park">Park</option>
          </select>

          <button
            onClick={calculateMidpoint}
            className="mt-4 p-3 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Find Midpoint
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        <div className="mt-6 overflow-y-auto border border-gray-300 rounded-md p-2">
          <SuggestedPlaces />
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-full mt-6 lg:mt-0 lg:ml-6">
        <MyMap />
      </div>
    </div>
  );
}
