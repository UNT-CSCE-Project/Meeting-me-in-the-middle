//import Error from "../ui/error";
"use client";
import Head from "next/head";
import { useState, useEffect, SetStateAction } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";

const mapStyles = {
  height: "100vh",
  width: "100%",
};

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

function MyMap() {
  const [originLocation, setOriginLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [midpoint, setMidpoint] = useState<google.maps.LatLng | null>(null);

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places", "geometry"],
  });

  if (!isLoaded) return <div>Loading...</div>;

  const onUnmount = () => {
    setMap(null);
  };

  const directionsCallback = (
    result: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === google.maps.DirectionsStatus.OK && result !== null) {
      setDirections(result);
      const route = result.routes[0];
      const decodedPath = google.maps.geometry.encoding.decodePath(
        route.overview_polyline
      );
      const midpointIndex = Math.floor(decodedPath.length / 2);
      const midpoint = decodedPath[midpointIndex];
      setMidpoint(midpoint);
    } else {
      console.error("Error calculating directions:", status);
    }
  };

  const calculateMidpoint = () => {
    // Clear the directions and midpoint
    setDirections(null);
    setMidpoint(null);

    // Calculate the directions and midpoint
    const directionsService = new google.maps.DirectionsService();
    const request = {
      origin: originLocation,
      destination: destinationLocation,
      travelMode: google.maps.TravelMode.DRIVING,
    };
    directionsService.route(request, directionsCallback);
  };

  if (!apiKey) {
    throw new Error("Google Maps API key is not set");
  }

  return (
    <div>
      <input
        type="text"
        value={originLocation}
        onChange={(e) => setOriginLocation(e.target.value)}
        placeholder="Enter origin location"
      />
      <input
        type="text"
        value={destinationLocation}
        onChange={(e) => setDestinationLocation(e.target.value)}
        placeholder="Enter destination location"
      />
      <button onClick={calculateMidpoint}>Calculate Midpoint</button>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={9}
        center={midpoint ?? { lat: 37.7749, lng: -122.4194 }}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
              },
              preserveViewport: true,
            }}
          />
        )}
        {midpoint && (
          <Marker
            position={midpoint}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/micons/blue-dot.png",
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}

export default function MidpointFinder() {
  return (
    <div>
      <MyMap />
    </div>
  );
}
