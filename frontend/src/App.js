import React, { useEffect, useState } from "react";
import "./App.css"; // Import your CSS file
import Map, { Marker, Popup } from "react-map-gl/maplibre"; // Import Map component
import "@maptiler/sdk/dist/maptiler-sdk.css"; // Import MapTiler SDK CSS
import RoomIcon from "@mui/icons-material/Room"; // Import icons
import StarIcon from "@mui/icons-material/Star";
import axios from "axios"; // Import Axios for making API requests
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/login";
import ListView from "./components/ListView";

function App() {
  // Initialize localStorage
  const myStorage = window.localStorage;

  // State variables
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showListView, setShowListView] = useState(false);

  const [viewState, setViewState] = useState({
    longitude: 72,
    latitude: 22,
    zoom: 7,
  });

  // Fetch pins from the server on component mount
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  // Handle marker click to display popup and adjust view
  const handleMarkerClick = (id, lat, lng) => {
    setCurrentPlaceId(id);

    // Set new viewState to focus on the marker
    setViewState({
      latitude: lat,
      longitude: lng,
      zoom: 5, // Adjust the zoom level as needed
    });
  };

  // Handle double click to add a new place
  const handleAddClick = (e) => {
    const lng = e.lngLat.lng;
    const lat = e.lngLat.lat;
    setNewPlace({
      lat,
      lng,
    });
  };

  // Handle form submission to add a new pin
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      lng: newPlace.lng,
    };
    try {
      const res = await axios.post("/pins", newPin);

      // Add the new pin to the pins state
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle logout by removing the user from localStorage
  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  const handleMapViewClick = () => {
    setShowListView(false);
    // Store the showListView state in localStorage
    myStorage.setItem("showListView", "false");
  };

  const handleListViewClick = () => {
    setShowListView(true); // Set it to true to show the list view
    // Store the showListView state in localStorage
    myStorage.setItem("showListView", "true");
  };

  return (
    <div>
      {/* Map */}
      <Map
        initialViewState={viewState}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.REACT_APP_MAPTILER_API_KEY}`}
        onDblClick={handleAddClick}
        transitionDuration={1000}
      >
        {pins.map((p) => (
          <div key={p._id}>
            <Marker latitude={p.lat} longitude={p.lng} anchor="bottom">
              <RoomIcon
                style={{
                  color: p.username === currentUser ? "tomato" : "purple",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.lng)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                latitude={p.lat}
                longitude={p.lng}
                anchor="left"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="Place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<StarIcon className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    {" "}
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </div>
        ))}
        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.lng}
            anchor="left"
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter a Title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder="Say something about this place."
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton">Add Pin</button>
              </form>
            </div>
          </Popup>
        )}
        {currentUser ? (
          <div className="dashboard-buttons">
            <button className="button logout" onClick={handleLogout}>
              Log out
            </button>
          </div>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
        {showListView && <ListView places={pins} showListView={showListView} />}
      </Map>

      {/* Toggle View Buttons */}
      <div className="toggle-view-buttons">
        <button
          className={`map-view-button ${showListView ? "" : "active"}`}
          onClick={handleMapViewClick}
        >
          Map View
        </button>
        <button
          className={`list-view-button ${showListView ? "active" : ""}`}
          onClick={handleListViewClick}
        >
          List View
        </button>
      </div>
    </div>
  );
}

export default App;
