import { createContext, useState, useMemo, useContext } from "react";

interface SharedState {
  originLocation: string;
  destinationLocation: string;
  midpoint: google.maps.LatLng | null;
  nearestCity: string | null;
  places: google.maps.places.PlaceResult[];
  selectedPlace: google.maps.places.PlaceResult | null;
  markers: JSX.Element[];
  placeType: string;
  newDirections: google.maps.DirectionsResult | null;
  distanceInMiles: number;
  map: google.maps.Map | null;
  directions: google.maps.DirectionsResult | null;
  setOriginLocation: (originLocation: string) => void;
  setDestinationLocation: (destinationLocation: string) => void;
  setMidpoint: (midpoint: google.maps.LatLng | null) => void;
  setNearestCity: (nearestCity: string | null) => void;
  setPlaces: (places: google.maps.places.PlaceResult[]) => void;
  setSelectedPlace: (
    selectedPlace: google.maps.places.PlaceResult | null
  ) => void;
  setMarkers: (markers: JSX.Element[]) => void;
  setPlaceType: (placeType: string) => void;
  setNewDirections: (
    newDirections: google.maps.DirectionsResult | null
  ) => void;
  setDistanceInMiles: (distanceInMiles: number) => void;
  setMap: (map: google.maps.Map | null) => void;
  setDirections: (directions: google.maps.DirectionsResult | null) => void;
}

const SharedStateContext = createContext<SharedState | null>(null);

const SharedStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [originLocation, setOriginLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
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
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const value = useMemo(
    () => ({
      map,
      setMap,
      originLocation,
      setOriginLocation,
      destinationLocation,
      setDestinationLocation,
      midpoint,
      setMidpoint,
      nearestCity,
      setNearestCity,
      places,
      setPlaces,
      selectedPlace,
      setSelectedPlace,
      markers,
      setMarkers,
      placeType,
      setPlaceType,
      newDirections,
      setNewDirections,
      distanceInMiles,
      setDistanceInMiles,
      directions,
      setDirections,
    }),
    [
      map,
      originLocation,
      destinationLocation,
      midpoint,
      nearestCity,
      places,
      selectedPlace,
      markers,
      placeType,
      newDirections,
      distanceInMiles,
      directions,
    ]
  );

  return (
    <SharedStateContext.Provider value={value}>
      {children}
    </SharedStateContext.Provider>
  );
};

const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error("useSharedState must be used within a SharedStateProvider");
  }
  return context;
};

const useSharedStateDestructured = () => {
    const sharedState = useSharedState();
    return {
      originLocation: sharedState.originLocation,
      setOriginLocation: sharedState.setOriginLocation,
      selectedPlace: sharedState.selectedPlace,
      setSelectedPlace: sharedState.setSelectedPlace,
      destinationLocation: sharedState.destinationLocation,
      setDestinationLocation: sharedState.setDestinationLocation,
      placeType: sharedState.placeType,
      setPlaceType: sharedState.setPlaceType,
      newDirections: sharedState.newDirections,
      setNewDirections: sharedState.setNewDirections,
      distanceInMiles: sharedState.distanceInMiles,
      setDistanceInMiles: sharedState.setDistanceInMiles,
      map: sharedState.map,
      setMap: sharedState.setMap,
      directions: sharedState.directions,
      setDirections: sharedState.setDirections,
      midpoint: sharedState.midpoint,
      setMidpoint: sharedState.setMidpoint,
      nearestCity: sharedState.nearestCity,
      setNearestCity: sharedState.setNearestCity,
      places: sharedState.places,
      setPlaces: sharedState.setPlaces,
      markers: sharedState.markers,
      setMarkers: sharedState.setMarkers,
    };
  };

export { SharedStateProvider, useSharedState, useSharedStateDestructured };
