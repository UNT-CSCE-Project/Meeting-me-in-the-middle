"use client";
import usePlaceOperations from "./usePlaceSelect";
import { useSharedStateDestructured } from "./sharedState";

export function SuggestedPlaces() {
  const { places, selectedPlace, distanceInMiles } = useSharedStateDestructured();
  const { handlePlaceSelect } = usePlaceOperations();

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-bold mb-2">
        {places.length > 0 ? `${places.length} Places Found` : "Search for Places"}
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
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
              }}
              onClick={() => handlePlaceSelect(place)}
            >
              <h3 className="text-lg font-bold">{place.name}</h3>
              <p>{place.vicinity}</p>
            </div>
          ))}
        </div>
        {selectedPlace && (
          <div
            style={{
              marginLeft: "20px",
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "10px",
              height: "100%",
              width: "600px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              flex: 1,
            }}
          >
            {selectedPlace.photos && selectedPlace.photos.length > 0 ? (
              <img
                src={selectedPlace.photos[0].getUrl() ?? ""}
                alt={selectedPlace.name}
                style={{
                  width: "100%",
                  height: "200px",
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
            <h2 className="text-lg font-bold">{selectedPlace.name}</h2>
            <p>{selectedPlace.vicinity}</p>
            <p>Miles: {distanceInMiles.toFixed(2)}</p>
            <p>Rating: {selectedPlace.rating}/5</p>
            <h2 className="text-md font-bold">Reviews</h2>
          </div>
        )}
      </div>
    </div>
  );
}