import React, { useState } from "react";
import "./listView.css";

function ListView({ places, showListView }) {
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // State for selected item in the dropdown
  const [selectedItem, setSelectedItem] = useState("");

  // Filter the data based on the search query and selected item
  const filteredPlaces = places.filter((place) => {
    const isTitleMatch =
      searchQuery === "" ||
      place.title.toLowerCase().includes(searchQuery.toLowerCase());
    const isItemSelected = selectedItem === "" || place.title === selectedItem;
    return isTitleMatch && isItemSelected;
  });

  // Handle the search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle the dropdown selection change
  const handleDropdownChange = (e) => {
    setSelectedItem(e.target.value);
  };

  return (
    <div className={`list-view-container ${showListView ? "active" : ""}`}>
      {/* List View Header */}
      <h2>List View</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchInputChange}
      />

      {/* Dropdown Filter */}
      <select value={selectedItem} onChange={handleDropdownChange}>
        <option value="">All</option>
        {places.map((place) => (
          <option key={place._id} value={place.title}>
            {place.title}
          </option>
        ))}
      </select>

      {/* List View Content */}
      <div className="list-view-content">
        <table>
          {/* Table Header */}
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Rating</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredPlaces.map((place) => (
              <tr key={place._id}>
                <td>{place.title}</td>
                <td>{place.desc}</td>
                <td>{place.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListView;
