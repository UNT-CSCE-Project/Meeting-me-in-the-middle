"use client";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import usePlaceOperations from "./usePlaceSelect"; // Import the custom hook
import { useSharedStateDestructured } from "./sharedState";
import MapWithDirections from "../ui/midpointfinder/customMarker";
const mapStyles = {
  height: "100%",
  width: "100%",
};

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

if (!apiKey) {
  throw new Error("Google Maps API key is not set");
}

export function MyMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places", "geometry"],
  });

  const sharedState = useSharedStateDestructured();
  const {
    setMap,
    midpoint,
    directions,
    newDirections,
    markers,
    places,
    selectedPlace,
    setSelectedPlace,
    distanceInMiles,
    userInfo,
    friendInfo,
    tripDuration,
  } = sharedState;

  const { handlePlaceSelect } = usePlaceOperations(); // Use the custom hook

  if (!isLoaded) return <div>Loading...</div>;

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  const onUnmount = () => {
    setMap(null);
  };

  return (
    <div className="h-full w-full">
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={9}
        center={midpoint ?? { lat: 37.7749, lng: -122.4194 }}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {directions && (
          <MapWithDirections directions={directions} userInfo={userInfo} friendInfo={friendInfo}/>
        )}
        {newDirections && (
          <DirectionsRenderer
            directions={newDirections}
            options={{
              polylineOptions: {
                strokeColor: "#0000ff", // blue
                strokeOpacity: 0.5,
                strokeWeight: 5,
              },
            }}
          />
        )}
        {markers}
        {places.map(
          (place, index) =>
            place.geometry?.location && (
              <Marker
                key={index}
                position={place.geometry.location}
                title={place.name}
                
                onClick={() => handlePlaceSelect(place)}
              />
            )
        )}
        {selectedPlace?.geometry?.location && (
          <InfoWindow
            position={selectedPlace.geometry.location}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div>
              <h2>{selectedPlace.name}</h2>
              <p>{selectedPlace.formatted_address}</p>
              <p>Miles: {distanceInMiles?.toFixed(2)} ({tripDuration})</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};