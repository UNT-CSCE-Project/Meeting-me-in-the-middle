"use client";

import { MyMap } from "./Map";
import { SuggestedPlaces } from "./SuggestedPlaces";
import { useSharedState, SharedStateProvider } from "./sharedState";
import useDirections from "./Midpoint";
import usePlaceOperations from "./usePlaceSelect";
import { MapPinIcon } from '@heroicons/react/24/outline';
import { Position, GeocodeResponse } from "@/app/lib/location/definitions";
import { useEffect, useState } from "react";
import { getFriends } from "../lib/friends/data";
import { useUser } from "../UserContext";
import { friendInfo } from "../lib/friends/definitions";
import { ChangeTransportation } from "./ChangeTransportation";
import { set } from "zod";


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
    places,
    userInfo,
    setUserInfo,
    friendInfo,
    setFriendInfo
  } = sharedState;

  const { calculateMidpoint } = useDirections();
  const { updatePlaces } = usePlaceOperations();

  // State for handling friend selection
  const [friends, setFriends] = useState<any>([]); // Example friends
  const [selectedFriend, setSelectedFriend] = useState<friendInfo | null>(null);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const {userData} = useUser();
  const [isFetching, setIsFetching] = useState(false);
  const fetchFriends = async () => {
    setIsFetching(true);
    if (userData) {
      try {
        const friendsData = await getFriends(userData?.uid) ;

        

        if('error' in friendsData) {
          setFriends([]);
          setUserInfo(null);
        } else {
         
          const friends = friendsData.map((friend: any) => ({
            id: friend.id,
            uid: friend.friend_uid,
            name: friend.friend_name,
            location: friend.streetAddress+", "+friend.city+", "+friend.state+", "+friend.zipCode
          }))

          setFriends(friends);
        }
        setIsFetching(false);
      } catch (error) {
        setUserInfo(null);
        setIsFetching(false);
        console.error('Error fetching friends:', error);
      }
    }
  };
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


  const fetchFriendLocation = (friend: friendInfo) => {
    setDestinationLocation(friend.location); // Set the destination location to friend's location
    setSelectedFriend(friend);
    setFriendInfo(friend);
    setShowFriendModal(false); // Close the modal
  };
  useEffect(() => {
    if(userData) {
      if (userData.uid) {
        setUserInfo({
          uid: userData.uid,
          name: `${userData.firstName} ${userData.lastName}`,
          location: `${userData.streetAddress}, ${userData.city}, ${userData.state}, ${userData.zipCode}`
        } as friendInfo);
        
      }
      setOriginLocation(userData.streetAddress+", "+userData.city+", "+userData.state+", "+userData.zipCode);
    }
  }, [userData]);
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full p-6 bg-gray-100">
      <div className="w-full lg:w-1/2 flex flex-col gap-6 p-6 bg-white shadow-lg rounded-lg"> 
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

          <div className="flex items-center justify-between">
            <label htmlFor="destination-location" className="block text-lg font-medium text-gray-700">Friend's Location:</label>
            <button
              onClick={() => {
                fetchFriends()
                setShowFriendModal(true)}
              }
              className="text-blue-500 hover:underline"
            >
              Select Friend
            </button>
          </div>

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

          <ChangeTransportation />

          <button
            onClick={calculateMidpoint}
            className="mt-4 p-3 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Find Midpoint
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {
          places.length > 0 && (
            <div className="mt-6 overflow-y-auto border border-gray-300 rounded-md p-2">
              <SuggestedPlaces />
            </div>
          )
        }
        
      </div>

      <div className="w-full lg:w-1/2 h-full mt-6 lg:mt-0 lg:ml-6">
        <MyMap />
      </div>

      {/* Friend Selection Modal */}
      {showFriendModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-128">
          <h2 className="text-xl font-semibold mb-4">Select a Friend</h2>
          
          {/* Table to Display Friends */}
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Address</th>
                <th className="p-2 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr>
                  <td colSpan={3} className="text-center">
                  Loading..
                  </td>
                </tr>
              ) : (
                friends.map((friend: friendInfo) => (
                  <tr key={friend.uid}>
                    <td className="p-2">{friend.name}</td>
                    <td className="p-2">{friend.location}</td>
                    <td className="p-2">
                      <button
                        onClick={() => fetchFriendLocation(friend)}
                        className="text-blue-500 hover:underline"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))    
              )}
            </tbody>
          </table>

          {/* Close Button */}
          <button
            onClick={() => setShowFriendModal(false)}
            className="mt-4 w-full p-2 bg-red-500 text-white rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    )}

    </div>
  );
}
