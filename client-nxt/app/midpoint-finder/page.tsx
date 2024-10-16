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
  height: "400px",
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
  const [placeType, setPlaceType] = useState("restaurant");
  const [newDirections, setNewDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distanceInMiles, setDistanceInMiles] = useState(0);

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

      const decodedPath = google.maps.geometry.encoding.decodePath(
        route.overview_polyline
      );
      const midpointIndex = Math.floor(decodedPath.length / 2);
      const midpoint = decodedPath[midpointIndex];
      setMidpoint(midpoint);
      findNearestCity(midpoint);

      if (selectedPlace) {
        // Create a new route from the origin point to the selected place
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
                position={leg.start_location}
                title={`Leg ${index + 1}`}
              >
                <InfoWindow position={midpoint}>
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
            setMarkers([...markers, ...newMarkers]);
            setNewDirections(newResult);
          } else {
            console.error("Error calculating new route:", newStatus);
          }
        });
      }

      const markers = legs.map((leg, index) => (
        <Marker
          key={index}
          position={leg.start_location}
          title={`Leg ${index + 1}`}
        >
          <InfoWindow position={midpoint}>
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
    } else {
      console.error("Error calculating directions:", status);
    }
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    console.log("handlePlaceSelect called");
    setSelectedPlace(place);
    if (place.geometry && place.geometry.location) {
      const newRequest: google.maps.DirectionsRequest = {
        origin: originLocation,
        destination: place.geometry.location,
        travelMode: google.maps.TravelMode.DRIVING,
      };
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(newRequest, (newResult, newStatus) => {
        console.log("directionsService.route callback called");
        if (
          newStatus === google.maps.DirectionsStatus.OK &&
          newResult !== null
        ) {
          console.log("newResult:", newResult);
          if (
            newResult.routes &&
            newResult.routes[0] &&
            newResult.routes[0].legs &&
            newResult.routes[0].legs[0] &&
            newResult.routes[0].legs[0].distance
          ) {
            const distance = newResult.routes[0].legs[0].distance.value;
            console.log("Distance:", distance);
            // Convert distance to kilometers
            const distanceInMilesValue = (distance / 1000) * 0.621371;
            console.log("Distance in miles:", distanceInMilesValue);
            setDistanceInMiles(distanceInMilesValue);
          } else {
            console.error("Unable to retrieve distance from newResult");
          }
          setNewDirections(newResult);
        } else {
          console.error("Error calculating new route:", newStatus);
        }
      });
    } else {
      console.error("Place geometry is not available");
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
              if (
                (result as google.maps.GeocoderResult).types.includes(
                  "locality"
                )
              ) {
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

  const findPlacesAroundCity = (
    city: string,
    placeType: string = "restaurant"
  ) => {
    if (map) {
      const service = new google.maps.places.PlacesService(map);
      console.log("Zooming in on:", city);
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: city }, (results, status) => {
        if (status === "OK" && results !== null) {
          const cityLocation = results[0].geometry.location;
          const request: google.maps.places.PlaceSearchRequest = {
            location: cityLocation,
            radius: 5000,
            type: placeType,
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
                  fields: [
                    "name",
                    "formatted_address",
                    "rating",
                    "opening_hours",
                  ],
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
      });
    }
  };

  const calculateDistance = (
    origin: string,
    destination: google.maps.LatLng,
    place: google.maps.places.PlaceResult
  ) => {
    const directionsService = new google.maps.DirectionsService();
    const request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };
    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        const distance = result?.routes?.[0]?.legs?.[0]?.distance;
        if (distance) {
          const distanceInKm = distance.value / 1000;
          const distanceInMiles = distanceInKm * 0.621371;
          return { place, distance: `Miles: ${distanceInMiles.toFixed(2)}` };
        } else {
          return { place, distance: "" };
        }
      } else {
        return { place, distance: "" };
      }
    });
  };

  if (!apiKey) {
    throw new Error("Google Maps API key is not set");
  }

  const updatePlaces = (newPlaceType: string) => {
    if (nearestCity) {
      findPlacesAroundCity(nearestCity, newPlaceType);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row">
        <div
          style={{
            width: "600px",
            height: "400px",
            backgroundColor: "lightGray",
          }}
          className="flex flex-col justify-start items-start border-2 border-black p-4 w-64 h-48 rounded-md"
        >
          <h1 style={{marginLeft: "210px"}} className="text-lg font-bold">Midpoint Finder</h1>
          <p className="text-md font-bold">Your Location:</p>
          <input
            type="text"
            value={originLocation}
            onChange={(e) => setOriginLocation(e.target.value)}
            placeholder="Enter origin location"
            style={{
              marginTop: "10px",
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
              marginTop: "10px",
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
              marginTop: "10px",
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
              marginTop: "60px",
              marginLeft: "460px",
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
        <div
          style={{ marginLeft: "50px", height: "400px" }}
          className="float-right flex justify-start items-start w-1/2 rounded-md overflow-hidden"
        >
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
                place.geometry &&
                place.geometry.location && (
                  <Marker
                    key={index}
                    position={place.geometry.location}
                    title={place.name}
                    onClick={() => handlePlaceSelect(place)}
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
                  <p>Miles: {distanceInMiles.toFixed(2)}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "600px",
          marginTop: "20px",
          backgroundColor: "lightgray",
        }}
        className="flex flex-col justify-start items-start border-2 border-black p-4 rounded-md"
      >
        <h2 className="text-lg font-bold mb-2">
          {places.length > 0
            ? `${places.length} Places Found`
            : "Search for Places"}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            height: "500px",
          }}
        >
          <div
            style={{
              overflowY: "auto",
              maxHeight: "600px",
              width: "600px",
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
                  flex: 1, // take up an equal amount of space
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
                flex: 1, // take up the full width of the column
              }}
            >
              {selectedPlace.photos && selectedPlace.photos.length > 0 ? (
                <img
                  src={selectedPlace.photos[0].getUrl()}
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