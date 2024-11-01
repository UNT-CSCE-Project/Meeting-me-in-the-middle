import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSharedStateDestructured } from "./sharedState";

type Filters = { [key: string]: boolean };

export const FilterTabs = ({
  filters,
  onDeleteFilter,
}: {
  filters: Filters;
  onDeleteFilter: (key: string) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.keys(filters).map(
        (filterKey, index) =>
          filters[filterKey] && (
            <div
              key={index}
              className="bg-gray-200 py-2 px-4 rounded-full flex items-center justify-between"
            >
              <span className="text-sm">
                {filterKey === "0"
                  ? "Free"
                  : filterKey === "1"
                  ? "$"
                  : filterKey === "2"
                  ? "$$"
                  : filterKey === "3"
                  ? "$$$"
                  : filterKey === "4"
                  ? "$$$$"
                  : filterKey}
              </span>
              <button
                className="ml-2"
                onClick={() => onDeleteFilter(filterKey)}
              >
                <FontAwesomeIcon icon={faTimes} size="sm" />
              </button>
            </div>
          )
      )}
    </div>
  );
};

export const AccessibilityTabFilter = ({
  onChange,
}: {
  onChange: (value: boolean) => void;
}) => {
  const { accessibilityFilter, setAccessibilityFilter } =
    useSharedStateDestructured();

  const handleFilterChange = () => {
    setAccessibilityFilter(!accessibilityFilter);
    onChange(!accessibilityFilter);
  };

  return (
    <div>
      {accessibilityFilter && (
        <div
          key="accessibility"
          className="bg-gray-200 py-2 px-4 rounded-full flex items-center justify-between"
        >
          <span className="text-sm">Wheelchair Accessible</span>
          <button className="ml-2" onClick={handleFilterChange}>
            <FontAwesomeIcon icon={faTimes} size="sm" />
          </button>
        </div>
      )}
    </div>
  );
};
