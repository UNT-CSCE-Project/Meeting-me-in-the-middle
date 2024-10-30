import { useCallback } from "react";
import { useSharedStateDestructured } from "./sharedState";
import {getTravelMode} from "./ChangeTransportation"

const usePlaceOperations = () => {
  const sharedState = useSharedStateDestructured();
  const {
    setSelectedPlace,
    originLocation,
    setDistanceInMiles,
    nearestCity,
    setNewDirections,
    setNearestCity,
    map,
    setPlaces,
    travelMode,
  } = sharedState;

  const handlePlaceSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      console.log("handlePlaceSelect called");
      setSelectedPlace(place);
      if (place.geometry?.location && originLocation) {
        const newRequest: google.maps.DirectionsRequest = {
          origin: originLocation,
          destination: place.geometry.location,
          travelMode: getTravelMode(travelMode),
        };
        const directionsService = new google.maps.DirectionsService();
        directionsService.route(newRequest, (newResult, newStatus) => {
          console.log("directionsService.route callback called");
          if (newStatus === google.maps.DirectionsStatus.OK && newResult !== null) {
            console.log("newResult:", newResult);
            const distance = newResult.routes[0]?.legs[0]?.distance?.value;
            if (distance !== undefined) {
              console.log("Distance:", distance);
              const distanceInMilesValue = (distance / 1000) * 0.621371;
              console.log("Distance in miles:", distanceInMilesValue);
              setDistanceInMiles(distanceInMilesValue);
              setNewDirections(newResult);
            } else {
              console.error("Unable to retrieve distance from newResult");
            }
          } else {
            console.error("Error calculating new route:", newStatus);
          }
        });
      } else {
        console.error("Place geometry is not available");
      }
    },
    [originLocation, setDistanceInMiles, setNewDirections, setSelectedPlace]
  );

  const findNearestCity = useCallback(
    (midpoint: google.maps.LatLng) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: midpoint }, (results, status) => {
        console.log(`Finding nearest city to midpoint: ${midpoint}`);
        if (status === "OK" && results !== null) {
          let nearestCity: google.maps.GeocoderResult | null = null;
          let minDistance: number = Infinity;
          if (Array.isArray(results)) {
            for (const result of results) {
              if (
                result.types.includes("locality") ||
                result.types.includes("postal_code") ||
                result.types.includes("administrative_area_level_3")
              ) {
                const cityLocation = result.geometry?.location;
                if (cityLocation) {
                  const distance = google.maps.geometry.spherical.computeDistanceBetween(
                    midpoint,
                    cityLocation
                  );
                  if (distance < minDistance) {
                    minDistance = distance;
                    nearestCity = result;
                  }
                }
              }
            }
          }
          if (nearestCity && map) {
            setNearestCity(nearestCity.formatted_address ?? "");
            zoomInOnCity(nearestCity.formatted_address ?? "");
            findPlacesAroundCity(nearestCity.formatted_address ?? "");
          }
        }
      });
    },
    [map, setNearestCity]
  );

  const zoomInOnCity = useCallback(
    (city: string) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: city }, (results, status) => {
        if (status === "OK" && results !== null) {
          const cityResult = results[0];
          const cityLocation = cityResult.geometry?.location;
          if (cityLocation) {
            map?.setCenter(cityLocation);
            map?.setZoom(12);
          }
        }
      });
    },
    [map]
  );

  const findPlacesAroundCity = useCallback(
    (city: string, placeType: string = "restaurant") => {
      if (map) {
        const service = new google.maps.places.PlacesService(map);
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: city }, (results, status) => {
          if (status === "OK" && results !== null) {
            const cityLocation = results[0]?.geometry?.location;
            if (cityLocation) {
              const request: google.maps.places.PlaceSearchRequest = {
                location: cityLocation,
                radius: 5000,
                type: placeType,
              };
              service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results !== null) {
                  setPlaces(results);
                }
              });
            }
          }
        });
      }
    },
    [map, setPlaces]
  );

  const updatePlaces = useCallback(
    (newPlaceType: string) => {
      if (nearestCity) {
        findPlacesAroundCity(nearestCity, newPlaceType);
      } else {
        setPlaces([]);
      }
    },
    [nearestCity, findPlacesAroundCity, setPlaces]
  );

  return {
    handlePlaceSelect,
    findNearestCity,
    zoomInOnCity,
    findPlacesAroundCity,
    updatePlaces,
  };
};

export default usePlaceOperations;