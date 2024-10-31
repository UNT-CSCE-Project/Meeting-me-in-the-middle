import React, { useState } from "react";
import usePlaceOperations from "./usePlaceSelect";
import { useSharedStateDestructured } from "./sharedState";
import Modal from "./Modal";
import { InviteFriend } from "../ui/friends/buttons";

export function SuggestedPlaces() {
  const { places, selectedPlace, setSelectedPlace, distanceInMiles, userInfo, friendInfo } =
    useSharedStateDestructured();
  const { handlePlaceSelect } = usePlaceOperations();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlaceClick = (place: google.maps.places.PlaceResult) => {
    handlePlaceSelect(place);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  console.log("places", places);
  return (
    <>
      { places.length > 0 && (
        <div className="flex flex-col h-full w-full">
        <h2 className="text-lg font-bold mb-2">
          {places.length > 0
            ? `${places.length} Places Found`
            : "Search for Places"}
        </h2>
        <div
          style={{
            display: "grid",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div
            style={{
              overflowY: "auto",
              maxHeight: "600px",
              width: "full",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {places.map((place, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "10px",
                  marginBottom: "10px",
                  boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {place.photos && place.photos[0] && (
                  <img
                    src={place.photos[0].getUrl()}
                    alt={place.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "5px",
                      marginRight: "10px",
                    }}
                    onError={(e) =>
                      console.error(
                        `Error loading image for place ${place.name}:`,
                        e
                      )
                    }
                  />
                )}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <h3 className="text-lg font-bold">{place.name}</h3>
                  <p className="text-sm">{place.vicinity}</p>
                </div>
                <button
                  onClick={() => handlePlaceClick(place)}
                  className="text-blue-500 underline"
                  style={{ marginLeft: "auto" }}
                >
                  More
                </button>
              </div>
            ))}
          </div>
        </div>
  
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {selectedPlace && (
            <div>
              {selectedPlace.photos && selectedPlace.photos.length > 0 ? (
                <img
                  src={selectedPlace.photos[0].getUrl() ?? ""}
                  alt={selectedPlace.name}
                  style={{
                    width: "100%",
                    height: "1/3",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "18px",
                    padding: "20px",
                  }}
                >
                  Photo not available
                </p>
              )}
              <h2 className="text-lg font-bold mt-4">{selectedPlace.name}</h2>
              <p>{selectedPlace.vicinity}</p>
              <p>Miles: {distanceInMiles.toFixed(2)}</p>
              <p>Rating: {selectedPlace.rating}/5</p>
              <h2 className="text-md font-bold mt-4 flex items-center">
                Reviews
                { 
                  userInfo && friendInfo && selectedPlace &&
                  <InviteFriend inviter={userInfo} invitee={friendInfo} place={selectedPlace } />
                }
                </h2>
                      
            </div>
          )}
        </Modal>

      
      </div>
      )}
      
      
    </>
    
  );
}
