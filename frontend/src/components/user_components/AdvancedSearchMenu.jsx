import React, { useState } from "react";

const AdvancedSearchMenu = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState("");

  const toggleDropdown = (dropdown) => {
    setDropdownOpen(dropdownOpen === dropdown ? "" : dropdown);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex flex-wrap gap-2">
        {/* Sort By Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("sortBy")}
            className="flex items-center px-4 py-2 text-sm font-medium bg-white border rounded-md shadow-sm hover:bg-gray-50"
          >
            Sort by <span className="ml-2">▼</span>
          </button>
          {dropdownOpen === "sortBy" && (
            <div className="absolute z-10 w-40 mt-2 bg-white border rounded-md shadow-lg">
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100">Price</li>
                <li className="px-4 py-2 hover:bg-gray-100">Rating</li>
                <li className="px-4 py-2 hover:bg-gray-100">Newest</li>
              </ul>
            </div>
          )}
        </div>

        {/* Type Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown("type")}
            className="flex items-center px-4 py-2 text-sm font-medium bg-white border rounded-md shadow-sm hover:bg-gray-50"
          >
            Type <span className="ml-2">▼</span>
          </button>
          {dropdownOpen === "type" && (
            <div className="absolute z-10 w-40 mt-2 bg-white border rounded-md shadow-lg">
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100">Business</li>
                <li className="px-4 py-2 hover:bg-gray-100">Personal</li>
              </ul>
            </div>
          )}
        </div>

        {/* Open Now */}
        <button className="px-4 py-2 text-sm font-medium bg-white border rounded-md shadow-sm hover:bg-gray-50">
          Open Now
        </button>

        {/* All Filters Popup */}
        <button
          onClick={togglePopup}
          className="flex items-center px-4 py-2 text-sm font-medium bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          ≡ All Filters
        </button>
      </div>

      {/* Popup Menu */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg max-w-sm">
            <h2 className="mb-4 text-lg font-bold">All Filters</h2>
            <div className="flex flex-col gap-3">
              <button className="px-4 py-2 text-sm font-medium bg-gray-100 border rounded-md hover:bg-gray-200">
                Sort by
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-gray-100 border rounded-md hover:bg-gray-200">
                Type
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-gray-100 border rounded-md hover:bg-gray-200">
                Open Now
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-gray-100 border rounded-md hover:bg-gray-200">
                Top Rated
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-gray-100 border rounded-md hover:bg-gray-200">
                JD Verified
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-gray-100 border rounded-md hover:bg-gray-200">
                Deals
              </button>
            </div>
            <button
              onClick={togglePopup}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchMenu;
