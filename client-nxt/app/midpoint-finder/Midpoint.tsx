"use client";
import { useCallback } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import usePlaceOperations from "./usePlaceSelect";
import { useSharedStateDestructured } from "./sharedState";
import { set } from "zod";

const useDirections = () => {
  const sharedState = useSharedStateDestructured();
  const {
    setDirections,
    setMidpoint,
    selectedPlace,
    originLocation,
    setMarkers,
    setNewDirections,
    destinationLocation,
    error,
    setError
  } = sharedState;

  const { findNearestCity } = usePlaceOperations(); // Import the function

  const directionsCallback = useCallback(
    (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus
    ) => {
      if (status === google.maps.DirectionsStatus.OK && result !== null) {
        setDirections(result);
        const route = result.routes[0];
        const legs = route.legs;

        const decodedPath = google.maps.geometry.encoding.decodePath(
          route.overview_polyline
        );
        const midpointIndex = Math.floor(decodedPath.length / 2);
        const midpoint = decodedPath[midpointIndex];
        setMidpoint(midpoint);
        findNearestCity(midpoint);

        if (selectedPlace && originLocation) {
          const directionsService = new google.maps.DirectionsService();
          const newRequest: google.maps.DirectionsRequest = {
            origin: originLocation,
            destination: selectedPlace.formatted_address as string,
            travelMode: google.maps.TravelMode.DRIVING,
          };
          directionsService.route(newRequest, (newResult, newStatus) => {
            if (
              newStatus === google.maps.DirectionsStatus.OK &&
              newResult !== null
            ) {
              const newRoute = newResult.routes[0];
              const newLegs = newRoute.legs;
              const newMarkers = newLegs.map((leg, index) => (
                <Marker
                  key={index}
                  position={midpoint}
                  title={`Midpoint ${index + 1}`}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  }}
                >
                  <InfoWindow position={midpoint}>
                    <div>
                      <h2>Midpoint {index + 1}</h2>
                      <p>Start Address: {leg.start_address}</p>
                      <p>End Address: {leg.end_address}</p>
                    </div>
                  </InfoWindow>
                </Marker>
              ));
              setMarkers([...markers, ...newMarkers]);
              setNewDirections(newResult);
            } else {
              console.error("Error calculating new route:", newStatus);
              setError("Error calculating new route");
            }
          });
        }

        const markers = legs.map((leg, index) => (
          <Marker
            key={index}
            position={midpoint}
            title={`Midpoint ${index + 1}`}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          >
            <InfoWindow position={midpoint}>
              <div>
                <h2>Midpoint {index + 1}</h2>
                <p>Start Address: {leg.start_address}</p>
                <p>End Address: {leg.end_address}</p>
                <p>Distance: {leg.distance?.text}</p>
                <p>Duration: {leg.duration?.text}</p>
              </div>
            </InfoWindow>
          </Marker>
        ));
        setMarkers(markers);
      } else {
        console.error("Error calculating directions:", status);
        setError("Error calculating directions");
      }
    },
    [
      setDirections,
      setMidpoint,
      selectedPlace,
      originLocation,
      error,
      setMarkers,
      setNewDirections,
      setError
    ]
  );

  const calculateMidpoint = useCallback(() => {
    const {
      setDirections,
      setMidpoint,
      setMarkers,
      setError,
      originLocation,
      destinationLocation,
    } = sharedState;
    setDirections(null);
    setMidpoint(null);
    setMarkers([]);
    setError("");
    const directionsService = new google.maps.DirectionsService();

    if (originLocation && destinationLocation) {
      const request = {
        origin: originLocation,
        destination: destinationLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      };
      directionsService.route(request, (result, status) =>
        directionsCallback(result, status)
      );
    } else {
      console.error("Origin or destination location is null");
      setError("Origin or destination location is null");
    }
  }, [
    sharedState,
    directionsCallback,
    setDirections,
    setMidpoint,
    setMarkers,
    originLocation,
    destinationLocation,
    setError
  ]);

  return { calculateMidpoint };
};

export default useDirections;
