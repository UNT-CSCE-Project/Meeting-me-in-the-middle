import { useCallback } from "react";
import { useSharedStateDestructured } from "./sharedState";
import { getTravelMode } from "./ChangeTransportation";
import { set } from "date-fns";

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
    placeTypeFilters,
    priceLevelFilters,
    accessibilityFilter,
    favoritesFilter,
    favorites,
    setTripDuration,
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
          if (
            newStatus === google.maps.DirectionsStatus.OK &&
            newResult !== null
          ) {
            const duration = newResult.routes[0]?.legs[0]?.duration?.text;
            const distance = newResult.routes[0]?.legs[0]?.distance?.value;
            if (distance !== undefined && duration !== undefined) {
              const distanceInMilesValue = (distance / 1000) * 0.621371;
              setTripDuration(duration);
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
                  const distance =
                    google.maps.geometry.spherical.computeDistanceBetween(
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
            findPlacesAroundCity(
              nearestCity.formatted_address ?? "",
              placeTypeFilters,
              priceLevelFilters,
              accessibilityFilter,
              favoritesFilter
            );
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

  const findPlacesAroundCity = (
    city: string,
    placeTypeFilters: {
      restaurant: boolean;
      store: boolean;
      cafe: boolean;
      park: boolean;
    },
    priceLevel: {
      "0": boolean;
      "1": boolean;
      "2": boolean;
      "3": boolean;
      "4": boolean;
    },
    accessibilityFilter: boolean,
    favoritesFilter: boolean
  ) => {
    if (map) {
      const service = new google.maps.places.PlacesService(map);
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: city }, (results, status) => {
        if (status === "OK" && results !== null) {
          const cityLocation = results[0]?.geometry?.location;
          if (cityLocation) {
            const allPlaceTypesFalse = Object.values(placeTypeFilters).every(
              (value) => value === false
            );
            const allPriceTypesFalse = Object.values(priceLevel).every(
              (value) => value === false
            );
            if (favoritesFilter) {
              if (favorites.length > 0) {
                setPlaces(favorites);
              } else {
                <div>
                  <p>No places found</p>
                </div>;
              }
            } else if (!allPlaceTypesFalse && !allPriceTypesFalse) {
              Object.keys(placeTypeFilters).forEach((placeType) => {
                Object.keys(priceLevelFilters).forEach((priceLevel) => {
                  if (
                    placeTypeFilters[
                      placeType as keyof typeof placeTypeFilters
                    ] &&
                    priceLevelFilters[
                      priceLevel as keyof typeof priceLevelFilters
                    ]
                  ) {
                    const request: google.maps.places.PlaceSearchRequest = {
                      location: cityLocation,
                      radius: 5000,
                      type: placeType,
                      maxPriceLevel: +priceLevel,
                      minPriceLevel: +priceLevel,
                      keyword: accessibilityFilter
                        ? "wheelchair_accessible"
                        : "",
                    };
                    service.nearbySearch(request, (results, status) => {
                      if (
                        status === google.maps.places.PlacesServiceStatus.OK &&
                        results !== null
                      ) {
                        setPlaces(results);
                      } else {
                        <div>
                          <p>No places found</p>
                        </div>;
                      }
                    });
                  }
                });
              });
            } else if (!allPlaceTypesFalse && allPriceTypesFalse) {
              Object.keys(placeTypeFilters).forEach((placeType) => {
                if (
                  placeTypeFilters[placeType as keyof typeof placeTypeFilters]
                ) {
                  const request: google.maps.places.PlaceSearchRequest = {
                    location: cityLocation,
                    radius: 5000,
                    type: placeType,
                    keyword: accessibilityFilter ? "wheelchair_accessible" : "",
                  };
                  service.nearbySearch(request, (results, status) => {
                    if (
                      status === google.maps.places.PlacesServiceStatus.OK &&
                      results !== null
                    ) {
                      setPlaces(results);
                    } else {
                      <div>
                        <p>No places found</p>
                      </div>;
                    }
                  });
                }
              });
            } else if (allPlaceTypesFalse && !allPriceTypesFalse) {
              Object.keys(priceLevelFilters).forEach((priceLevel) => {
                if (
                  priceLevelFilters[
                    priceLevel as keyof typeof priceLevelFilters
                  ]
                ) {
                  const request: google.maps.places.PlaceSearchRequest = {
                    location: cityLocation,
                    radius: 5000,
                    maxPriceLevel: +priceLevel,
                    minPriceLevel: +priceLevel,
                    keyword: accessibilityFilter ? "wheelchair_accessible" : "",
                  };
                  service.nearbySearch(request, (results, status) => {
                    if (
                      status === google.maps.places.PlacesServiceStatus.OK &&
                      results !== null
                    ) {
                      setPlaces(results);
                    } else {
                      <div>
                        <p>No places found</p>
                      </div>;
                    }
                  });
                }
              });
            } else {
              const request: google.maps.places.PlaceSearchRequest = {
                location: cityLocation,
                radius: 5000,
                keyword: accessibilityFilter ? "wheelchair_accessible" : "",
              };
              service.nearbySearch(request, (results, status) => {
                if (
                  status === google.maps.places.PlacesServiceStatus.OK &&
                  results !== null
                ) {
                  setPlaces(results);
                }
              });
            }
          }
        }
      });
    }
  };

  const updatePlaces = () => {
    console.log("Update places function called");
    if (nearestCity) {
      console.log("in nearest city");
      findPlacesAroundCity(
        nearestCity,
        placeTypeFilters,
        priceLevelFilters,
        accessibilityFilter,
        favoritesFilter
      );
    } else {
      setPlaces([]);
    }
  };

  return {
    handlePlaceSelect,
    findNearestCity,
    zoomInOnCity,
    findPlacesAroundCity,
    updatePlaces,
  };
};

export default usePlaceOperations;
