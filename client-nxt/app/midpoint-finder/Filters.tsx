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
<div className="container mx-auto p-4">
  <h1 className="text-3xl font-bold text-center mb-4">Change Filters</h1>
  <div className="flex flex-wrap justify-center mb-4">
    <div className="w-full md:w-1/2 xl:w-1/3 p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-2">Location Type:</h2>
      <ul>
        <li>
          <input
            type="checkbox"
            name="restaurant"
            checked={newPlaceTypeFilters.restaurant}
            onChange={handlePlaceTypeFilterChange}
            className="mr-2"
          />
          <span className="text-lg font-normal">Restaurants</span>
        </li>
        <li>
          <input
            type="checkbox"
            name="store"
            checked={newPlaceTypeFilters.store}
            onChange={handlePlaceTypeFilterChange}
            className="mr-2"
          />
          <span className="text-lg font-normal">Stores</span>
        </li>
        <li>
          <input
            type="checkbox"
            name="cafe"
            checked={newPlaceTypeFilters.cafe}
            onChange={handlePlaceTypeFilterChange}
            className="mr-2"
          />
          <span className="text-lg font-normal">Cafes</span>
        </li>
        <li>
          <input
            type="checkbox"
            name="park"
            checked={newPlaceTypeFilters.park}
            onChange={handlePlaceTypeFilterChange}
            className="mr-2"
          />
          <span className="text-lg font-normal">Parks</span>
        </li>
      </ul>
    </div>
    <div className="w-full md:w-1/2 xl:w-1/3 p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-2">Price Level:</h2>
      <ul>
        <li>
          <input
            type="checkbox"
            name="0"
            checked={newPriceLevelFilters[0]}
            onChange={handlePriceLevelFilterChange}
            className="mr-2"
          />
          <span className="text-lg font-normal">Free</span>
        </li>
        <li>
          <input
            type="checkbox"
            name="1"
            checked={newPriceLevelFilters[1]}
            onChange={handlePriceLevelFilterChange}
            className="mr-2"
          />
          <span className="text-lg font-normal">$</span>
        </li>
        <li>
          <input
            type="checkbox"
            name="2"
            checked={newPriceLevelFilters[2]}
            onChange={handlePriceLevelFilterChange}
            className="mr-2"
          />
          <span className="text-lg font-normal">$$</span>
        </li>
        <li>
          <input
            type="checkbox"
            name="3"
            checked={newPriceLevelFilters[3]}
            onChange={handlePriceLevelFilterChange}
            className="mr-2"
          />
          <span className="text-lg font-normal">$$$</span>
        </li>
        <li>
          <input
            type="checkbox"
            name="4"
            checked={newPriceLevelFilters[4]}
            onChange={handlePriceLevelFilterChange}
            className="mr-2"
          />
          <span className="text-lg font-normal">$$$$</span>
        </li>
      </ul>
    </div>
    <div className="w-full md:w-1/2 xl:w-1/3 p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-2">Accessibility:</h2>
      <label className="text-lg font-normal">
        <input
          type="checkbox"
          checked={newAccessibilityFilter}
          onChange={handleAccessibilityFilterChange}
          className="mr-2"
        />
        {newAccessibilityFilter ? "On" : "Off"}
      </label>
    </div>
  </div>
  <button
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    onClick={applyFilters}
  >
    Apply Filters
  </button>
</div>
  );
};
