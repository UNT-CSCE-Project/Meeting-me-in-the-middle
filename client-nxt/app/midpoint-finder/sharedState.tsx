import { createContext, useState, useMemo, useContext } from "react";
import { set } from "zod";
import { friendInfo } from "../lib/friends/definitions";
import { acceptEncoding } from "@googlemaps/google-maps-services-js";

interface SharedState {
  originLocation: string;
  destinationLocation: string;
  meetingTime: string | number | readonly string[] | undefined;
  midpoint: google.maps.LatLng | null;
  nearestCity: string | null;
  places: google.maps.places.PlaceResult[];
  selectedPlace: google.maps.places.PlaceResult | null;
  markers: JSX.Element[];
  newDirections: google.maps.DirectionsResult | null;
  distanceInMiles: number;
  map: google.maps.Map | null;
  directions: google.maps.DirectionsResult | null;
  error: string | null;
  userInfo: friendInfo | null;
  friendInfo: friendInfo | null;
  travelMode: string;
  placeTypeFilters: {
    restaurant: boolean;
    store: boolean;
    cafe: boolean;
    park: boolean;
  };
  priceLevelFilters: {
    "0": boolean;
    "1": boolean;
    "2": boolean;
    "3": boolean;
    "4": boolean;
  };
  accessibilityFilter: boolean;
  favoritesFilter: boolean;
  tripDuration: string | null;
  favorites: google.maps.places.PlaceResult[];
  setOriginLocation: (originLocation: string) => void;
  setDestinationLocation: (destinationLocation: string) => void;
  setMeetingTime: (meetingTime: string  ) => void;
  setMidpoint: (midpoint: google.maps.LatLng | null) => void;
  setNearestCity: (nearestCity: string | null) => void;
  setPlaces: (places: google.maps.places.PlaceResult[]) => void;
  setSelectedPlace: (
    selectedPlace: google.maps.places.PlaceResult | null
  ) => void;
  setMarkers: (markers: JSX.Element[]) => void;
  setNewDirections: (
    newDirections: google.maps.DirectionsResult | null
  ) => void;
  setDistanceInMiles: (distanceInMiles: number) => void;
  setMap: (map: google.maps.Map | null) => void;
  setDirections: (directions: google.maps.DirectionsResult | null) => void;
  setError: (error: string | null) => void;
  setUserInfo: (userInfo: friendInfo | null) => void;
  setFriendInfo: (friendInfo: friendInfo | null) => void;
  setTravelMode: (mode: string) => void;
  setPlaceTypeFilters: (placeTypeFilters: {
    restaurant: boolean;
    store: boolean;
    cafe: boolean;
    park: boolean;
  }) => void;
  setPriceLevelFilters: (priceLevelFilters: {
    "0": boolean;
    "1": boolean;
    "2": boolean;
    "3": boolean;
    "4": boolean;
  }) => void;
  setAccessibilityFilter: (accessibilityFilter: boolean) => void;
  setFavoritesFilter: (favoritesFilter: boolean) => void;
  setTripDuration: (duration: string | null) => void;
  setFavorites: (favorites: google.maps.places.PlaceResult[]) => void;
}

const SharedStateContext = createContext<SharedState | null>(null);

const SharedStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [originLocation, setOriginLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [meetingTime, setMeetingTime] = useState<string>('');
  const [midpoint, setMidpoint] = useState<google.maps.LatLng | null>(null);
  const [nearestCity, setNearestCity] = useState<string | null>(null);
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [markers, setMarkers] = useState<JSX.Element[]>([]);
  const [newDirections, setNewDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distanceInMiles, setDistanceInMiles] = useState(0);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<friendInfo | null>(null);
  const [friendInfo, setFriendInfo] = useState<friendInfo | null>(null);
  const [travelMode, setTravelMode] = useState<string>("DRIVING");
  const [placeTypeFilters, setPlaceTypeFilters] = useState({
    restaurant: false,
    store: false,
    cafe: false,
    park: false,
  });

  const [priceLevelFilters, setPriceLevelFilters] = useState({
    "0": false,
    "1": false,
    "2": false,
    "3": false,
    "4": false,
  });
  const [accessibilityFilter, setAccessibilityFilter] = useState(false);
  const [favoritesFilter, setFavoritesFilter] = useState(false);
  const [tripDuration, setTripDuration] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<google.maps.places.PlaceResult[]>([]);

  const value = useMemo(
    () => ({
      map,
      setMap,
      originLocation,
      setOriginLocation,
      destinationLocation,
      setDestinationLocation,
      meetingTime, 
      setMeetingTime,
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
      newDirections,
      setNewDirections,
      distanceInMiles,
      setDistanceInMiles,
      directions,
      setDirections,
      error,
      setError,
      userInfo,
      setUserInfo,
      friendInfo,
      setFriendInfo,
      travelMode,
      setTravelMode,
      placeTypeFilters,
      setPlaceTypeFilters,
      priceLevelFilters,
      setPriceLevelFilters,
      accessibilityFilter,
      setAccessibilityFilter,
      tripDuration,
      setTripDuration,
      favorites,
      setFavorites,
      favoritesFilter,
      setFavoritesFilter,
    }),
    [
      map,
      originLocation,
      destinationLocation,
      meetingTime,
      midpoint,
      nearestCity,
      places,
      selectedPlace,
      markers,
      newDirections,
      distanceInMiles,
      directions,
      error,
      travelMode,
      placeTypeFilters,
      priceLevelFilters,
      accessibilityFilter,
      tripDuration,
      favorites,
      favoritesFilter,
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
    meetingTime: sharedState.meetingTime,
    setMeetingTime: sharedState.setMeetingTime,
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
    error: sharedState.error,
    setError: sharedState.setError,
    userInfo: sharedState.userInfo,
    setUserInfo: sharedState.setUserInfo,
    friendInfo: sharedState.friendInfo,
    setFriendInfo: sharedState.setFriendInfo,
    travelMode: sharedState.travelMode,
    setTravelMode: sharedState.setTravelMode,
    placeTypeFilters: sharedState.placeTypeFilters,
    setPlaceTypeFilters: sharedState.setPlaceTypeFilters,
    priceLevelFilters: sharedState.priceLevelFilters,
    setPriceLevelFilters: sharedState.setPriceLevelFilters,
    accessibilityFilter: sharedState.accessibilityFilter,
    setAccessibilityFilter: sharedState.setAccessibilityFilter,
    tripDuration: sharedState.tripDuration,
    setTripDuration: sharedState.setTripDuration,
    favorites: sharedState.favorites,
    setFavorites: sharedState.setFavorites,
    favoritesFilter: sharedState.favoritesFilter,
    setFavoritesFilter: sharedState.setFavoritesFilter,
  };
};

export { SharedStateProvider, useSharedState, useSharedStateDestructured };
