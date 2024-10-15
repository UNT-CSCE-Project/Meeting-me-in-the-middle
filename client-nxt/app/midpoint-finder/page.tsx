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
//import { Geocoder } from "@react-google-maps/api/dist/utils/Geocoder";

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
  const [nearestCity, setNearestCity] = useState<string | null>(null);
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [markers, setMarkers] = useState<JSX.Element[]>([]);

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
      const legs = route.legs;
      const markers = legs.map((leg, index) => (
        <Marker
          key={index}
          position={leg.start_location}
          title={`Leg ${index + 1}`}
        >
          <InfoWindow position={leg.start_location}>
            <div>
              <h2>Leg {index + 1}</h2>
              <p>Start Address: {leg.start_address}</p>
              <p>End Address: {leg.end_address}</p>
              <p>Distance: {leg.distance?.text}</p>
              <p>Duration: {leg.duration?.text}</p>
            </div>
          </InfoWindow>
        </Marker>
      ));
      setMarkers(markers);

      const decodedPath = google.maps.geometry.encoding.decodePath(
        route.overview_polyline
      );
      const midpointIndex = Math.floor(decodedPath.length / 2);
      const midpoint = decodedPath[midpointIndex];
      setMidpoint(midpoint);
      findNearestCity(midpoint);
    } else {
      console.error("Error calculating directions:", status);
    }
  };

  const calculateMidpoint = () => {
    // Clear the directions and midpoint
    setDirections(null);
    setMidpoint(null);
    setMarkers([]);

    // Calculate the directions and midpoint
    const directionsService = new google.maps.DirectionsService();
    const request = {
      origin: originLocation,
      destination: destinationLocation,
      travelMode: google.maps.TravelMode.DRIVING,
    };
    directionsService.route(request, directionsCallback);
  };

  const findNearestCity = (midpoint: google.maps.LatLng) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { location: midpoint },
      (
        results: google.maps.GeocoderResult[] | null,
        status: google.maps.GeocoderStatus
      ) => {
        console.log(`Finding nearest city to midpoint: ${midpoint}`);
        if (status === "OK" && results !== null) {
          console.log("Results:", results);
          let nearestCity: google.maps.GeocoderResult | null = null;
          let minDistance: number = Infinity;
          if (Array.isArray(results)) {
            console.log("Results is an array");
            for (const result of results) {
              console.log("Result:", result);
              if ((result as google.maps.GeocoderResult).types.includes("locality")) {
                console.log("Result is a locality");
                const cityLocation = result.geometry.location;
                console.log("City location:", cityLocation);
                const distance =
                  google.maps.geometry.spherical.computeDistanceBetween(
                    midpoint,
                    cityLocation
                  );
                  console.log("Distance:", distance);
                if (distance < minDistance) {
                  console.log("New nearest city found");
                  minDistance = distance;
                  nearestCity = result as google.maps.GeocoderResult;
                }
              }
            }
          } else {
            console.log("Results is not an array");
            if (
              (results as google.maps.GeocoderResult).types.includes("locality")
            ) {
              console.log("Result is a locality");
              const cityLocation = (results as google.maps.GeocoderResult)
                .geometry.location;
              console.log("City location:", cityLocation);
              const distance =
                google.maps.geometry.spherical.computeDistanceBetween(
                  midpoint,
                  cityLocation
                );
              console.log("Distance:", distance);
              if (distance < minDistance) {
                console.log("New nearest city found");
                minDistance = distance;
                nearestCity = results as google.maps.GeocoderResult;
              }
            }
          }
          console.log("Nearest city:", nearestCity);
          console.log("Min distance:", minDistance);
          if (nearestCity) {
            console.log("Setting nearest city");
            setNearestCity(nearestCity.formatted_address);
            zoomInOnCity(nearestCity.formatted_address);
            findPlacesAroundCity(nearestCity.formatted_address);
          }
        }
      }
    );
  };

  const zoomInOnCity = (city: string) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { address: city },
      (
        results: google.maps.GeocoderResult[] | null,
        status: google.maps.GeocoderStatus
      ) => {
        console.log(`Zooming in on city: ${city}`);
        if (status === "OK" && results !== null) {
          const cityResult = results[0];
          console.log("Geocoder result:", JSON.stringify(cityResult, null, 2));
          if (cityResult.geometry.location) {
            map?.setCenter(cityResult.geometry.location);
            map?.setZoom(12);
            console.log(`Map center set to: ${map?.getCenter()}`);
          }
        }
      }
    );
  };

  const findPlacesAroundCity = (city: string) => {
    if (map) {
      const service = new google.maps.places.PlacesService(map);
      console.log("Zooming in on:", city);
      const request: google.maps.places.PlaceSearchRequest = {
        location: map.getCenter(),
        radius: 5000,
        type: "restaurant",
      };
      service.nearbySearch(request, (results, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results !== null
        ) {
          results.forEach((result) => {
            const placeId = result.place_id;
            const request: google.maps.places.PlaceDetailsRequest = {
              placeId: placeId ?? "",
              fields: ["name", "formatted_address", "rating", "opening_hours"],
            };
            service.getDetails(request, (result, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                console.log(result);
              }
            });
          });
          setPlaces(results);
        }
      });
    }
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
        {markers}
        {places.map(
          (place, index) =>
            place.geometry &&
            place.geometry.location && (
              <Marker
                key={index}
                position={place.geometry.location}
                title={place.name}
                onClick={() => setSelectedPlace(place)}
              />
            )
        )}
        {selectedPlace && selectedPlace.geometry && (
          <InfoWindow
            position={selectedPlace.geometry.location}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div>
              <h2>{selectedPlace.name}</h2>
              <p>{selectedPlace.formatted_address}</p>
              {selectedPlace.rating && <p>Rating: {selectedPlace.rating}</p>}
              {selectedPlace.opening_hours && (
                <p>
                  Hours: {selectedPlace.opening_hours?.weekday_text?.join(", ")}
                </p>
              )}
            </div>
          </InfoWindow>
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
