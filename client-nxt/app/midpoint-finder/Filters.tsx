import React, { useState, useEffect } from "react";
import { useSharedStateDestructured } from "./sharedState";
import { set } from "zod";
import usePlaceOperations from "./usePlaceSelect";

interface FiltersProps {
  onClose: () => void;
}

export const Filters: React.FC<FiltersProps> = ({ onClose }) => {
  const { updatePlaces, updatePrice } = usePlaceOperations();
  const {
    setPlaceTypeFilters,
    setPriceLevelFilters,
    placeTypeFilters,
    priceLevelFilters,
    accessibilityFilter,
    setAccessibilityFilter,
  } = useSharedStateDestructured();

  const [newPlaceTypeFilters, setNewPlaceTypeFilters] =
    useState(placeTypeFilters);
  const [newPriceLevelFilters, setNewPriceLevelFilters] =
    useState(priceLevelFilters);
  const [newAccessibilityFilter, setNewAccessibilityFilter] =
    useState(accessibilityFilter);

  const applyFilters = () => {
    console.log("Applying filters...");
    console.log("Place type filters:", newPlaceTypeFilters);
    setPlaceTypeFilters(newPlaceTypeFilters);
    setPriceLevelFilters(newPriceLevelFilters);
    setAccessibilityFilter(newAccessibilityFilter);
    updatePlaces();
    updatePrice();
    onClose();
  };

  const handlePlaceTypeFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    setNewPlaceTypeFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  const handlePriceLevelFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    setNewPriceLevelFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  const handleAccessibilityFilterChange = () => {
    setNewAccessibilityFilter(!newAccessibilityFilter);
  };

  return (
    <div>
      <h1 className="w-full text-2xl font-bold text-center">Change Filters</h1>
      <div>
        <h2 className="text-xl font-bold">Location Type:</h2>
        <ul>
          <li>
            <input
              type="checkbox"
              name="restaurant"
              checked={newPlaceTypeFilters.restaurant}
              onChange={handlePlaceTypeFilterChange}
            />
            <span className="text-lg font-normal">Restaurants</span>
          </li>
          <li>
            <input
              type="checkbox"
              name="store"
              checked={newPlaceTypeFilters.store}
              onChange={handlePlaceTypeFilterChange}
            />
            <span className="text-lg font-normal">Stores</span>
          </li>
          <li>
            <input
              type="checkbox"
              name="cafe"
              checked={newPlaceTypeFilters.cafe}
              onChange={handlePlaceTypeFilterChange}
            />
            <span className="text-lg font-normal">Cafes</span>
          </li>
          <li>
            <input
              type="checkbox"
              name="park"
              checked={newPlaceTypeFilters.park}
              onChange={handlePlaceTypeFilterChange}
            />
            <span className="text-lg font-normal">Parks</span>
          </li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-bold">Price Level:</h2>
        <ul>
          <li>
            <input
              type="checkbox"
              name="0"
              checked={newPriceLevelFilters[0]}
              onChange={handlePriceLevelFilterChange}
            />
            <span className="text-lg font-normal">Free</span>
          </li>
          <li>
            <input
              type="checkbox"
              name="1"
              checked={newPriceLevelFilters[1]}
              onChange={handlePriceLevelFilterChange}
            />
            <span className="text-lg font-normal">$</span>
          </li>
          <li>
            <input
              type="checkbox"
              name="2"
              checked={newPriceLevelFilters[2]}
              onChange={handlePriceLevelFilterChange}
            />
            <span className="text-lg font-normal">$$</span>
          </li>
          <li>
            <input
              type="checkbox"
              name="3"
              checked={newPriceLevelFilters[3]}
              onChange={handlePriceLevelFilterChange}
            />
            <span className="text-lg font-normal">$$$</span>
          </li>
          <li>
            <input
              type="checkbox"
              name="4"
              checked={newPriceLevelFilters[4]}
              onChange={handlePriceLevelFilterChange}
            />
            <span className="text-lg font-normal">$$$$</span>
          </li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-bold">Accessibility:</h2>
        <label className="text-lg font-normal">
          <input
            type="checkbox"
            checked={newAccessibilityFilter}
            onChange={handleAccessibilityFilterChange}
          />
          {newAccessibilityFilter ? "On" : "Off"}
        </label>
      </div>
      <div className="mt-4 p-3 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <button className="w-full text-center font-normal" onClick={applyFilters} style={{justifyContent: "center"}}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};
