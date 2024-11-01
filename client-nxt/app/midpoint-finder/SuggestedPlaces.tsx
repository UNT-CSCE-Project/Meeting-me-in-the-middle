import React, { useState, useEffect } from "react";
import usePlaceOperations from "./usePlaceSelect";
import { useSharedStateDestructured } from "./sharedState";
import Modal from "./Modal";
import { ChangeTransportation } from "./ChangeTransportation";
import { Filters } from "./Filters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faWheelchair } from "@fortawesome/free-solid-svg-icons";
import { FilterTabs, AccessibilityTabFilter } from "./FilterTabs";
import { InviteFriend } from "../ui/friends/buttons";
import { set } from "zod";

export function SuggestedPlaces() {
  const {
    places,
    selectedPlace,
    setSelectedPlace,
    distanceInMiles,
    userInfo,
    friendInfo,
    map,
    placeTypeFilters,
    setPlaceTypeFilters,
    priceLevelFilters,
    setPriceLevelFilters,
    accessibilityFilter,
    setAccessibilityFilter,
    tripDuration,
    setTripDuration,
    error,
    setError,
  } = useSharedStateDestructured();

  const { handlePlaceSelect, updatePlaces, updatePrice } = usePlaceOperations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isWheelChairAccessible, setIsWheelChairAccessible] = useState(false);
  const [reviews, setReviews] = useState<
    google.maps.places.PlaceReview[] | null
  >(null);

  const handlePlaceClick = (place: google.maps.places.PlaceResult) => {
    handlePlaceSelect(place);
    setIsModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFiltersClick = () => {
    setIsFiltersOpen(true);
    setError(null);
  };

  useEffect(() => {
    if (selectedPlace && map) {
      console.log("Making API request for reviews...");
      const service = new google.maps.places.PlacesService(map);
      service.getDetails(
        {
          placeId: selectedPlace.place_id ?? "",
          fields: ["reviews"],
        },
        (place, status) => {
          console.log("API request complete:", status);
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const reviews = place.reviews ?? [];
            console.log("Reviews:", reviews);
            if (reviews.length === 0) {
              console.log("No reviews found for this place.");
            }
            setReviews(reviews);
          } else {
            console.error("Error fetching reviews:", status);
          }
        }
      );
    }
    updatePlaces();
    updatePrice();
  }, [selectedPlace, placeTypeFilters, priceLevelFilters, accessibilityFilter]);

  return (
    <>
      {places.length > 0 && (
        <div className="flex flex-col h-full w-full">
          <div className="flex flex-row h-full w-full">
            <h2 className="text-lg font-bold mb-2">
              {places.length > 0
                ? `${places.length} Places Found`
                : "Search for Places"}
              <button
                onClick={handleFiltersClick}
                style={{ marginLeft: "auto" }}
              >
                <FontAwesomeIcon icon={faPencilAlt} size="lg" />
              </button>
              <Modal
                isOpen={isFiltersOpen}
                onClose={() => setIsFiltersOpen(false)}
              >
                <Filters onClose={() => setIsFiltersOpen(false)} />
              </Modal>
            </h2>
            <div style={{display: "flex", justifyContent: "center", width: "60%" }}>
              <ChangeTransportation />
            </div>
          </div>
          <FilterTabs
            filters={placeTypeFilters}
            onDeleteFilter={(key: string) => {
              setPlaceTypeFilters({ ...placeTypeFilters, [key]: false });
              updatePlaces();
              updatePrice();
            }}
          />
          <FilterTabs
            filters={priceLevelFilters}
            onDeleteFilter={(key: string) => {
              setPriceLevelFilters({ ...priceLevelFilters, [key]: false });
              updatePlaces();
              updatePrice();
            }}
          />
          <AccessibilityTabFilter
            onChange={() => {
              setAccessibilityFilter(!accessibilityFilter);
              updatePlaces();
              updatePrice();
            }}
          />
          {!Object.values(placeTypeFilters).some(Boolean) &&
          !Object.values(priceLevelFilters).some(Boolean) &&
          !accessibilityFilter ? (
            <p>No filters added</p>
          ) : null}
          <div
            style={{
              display: "grid",
              flexDirection: "column",
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
                    backgroundColor: selectedPlace?.name === place?.name ? "lightblue" : "white",
                    borderRadius: "10px",
                    padding: "10px",
                    marginBottom: "10px",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                  }} 
                  onClick={() => handlePlaceSelect(place)}
                >
                  {place.photos && place.photos[0] && (
                    <img
                      src={place.photos[0].getUrl()}
                      alt={place.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "5px",
                        marginRight: "10px",
                      }}
                      onError={(e) =>
                        console.error(
                          `Error loading image for place ${place.name}:`,
                          e
                        )
                      }
                    />
                  )}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h3 className="text-lg font-bold">
                      {place.name}
                      {isWheelChairAccessible && (
                        <FontAwesomeIcon
                          icon={faWheelchair}
                          size="sm"
                          style={{ marginLeft: "5px" }}
                        />
                      )}
                    </h3>
                    <p className="text-sm">{place.vicinity}</p>
                    <p className="text-sm">
                      {place.price_level?.toString() === "0"
                        ? "Free"
                        : place.price_level?.toString() === "1"
                        ? "$"
                        : place.price_level?.toString() === "2"
                        ? "$$"
                        : place.price_level?.toString() === "3"
                        ? "$$$"
                        : place.price_level?.toString() === "4"
                        ? "$$$$"
                        : "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={() => handlePlaceClick(place)}
                    className="text-blue-500 underline"
                    style={{ marginLeft: "auto" }}
                  >
                    More
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            style={{
              // width: "900px",
              // height: "600px",
              margin: "auto",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
            }}
          >
            {selectedPlace && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {selectedPlace.photos && selectedPlace.photos.length > 0 ? (
                  <img
                    src={selectedPlace.photos[0].getUrl() ?? ""}
                    alt={selectedPlace.name}
                    style={{
                      width: "100%",
                      height: "200px",
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
                <p>Miles: {distanceInMiles.toFixed(2)} ({tripDuration})</p>
                <p>Rating: {selectedPlace.rating}/5</p>
                <h2 className="text-md font-bold mt-4 flex items-center">
                Reviews
                { 
                  userInfo && friendInfo && selectedPlace &&
                  <InviteFriend inviter={userInfo} invitee={friendInfo} place={selectedPlace } />
                }
                </h2>
                <div
                  style={{
                    display: "grid",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      padding: "20px",
                      maxHeight: "250px",
                      width: "full",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {reviews &&
                      reviews.map((review, index) => (
                        <div
                          key={index}
                          style={{
                            backgroundColor: "white",
                            borderRadius: "10px",
                            padding: "10px",
                            marginBottom: "10px",
                            boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <p>
                            <strong>{review.author_name}</strong> (
                            {review.rating}/5)
                          </p>
                          <p>{review.text}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </div>
      )}
    </>
  );
}
