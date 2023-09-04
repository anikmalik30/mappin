import React, { useEffect, useState } from "react";
import "./App.css";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import RoomIcon from "@mui/icons-material/Room";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorage= window.localStorage; 
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [viewState, setViewState] = useState({
    longitude: 72,
    latitude: 22,
    zoom: 7,
  });

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

  const handleMarkerClick = (id, lat, lng) => {
    setCurrentPlaceId(id);

    console.log("Lat", lat, "Lan", lng);

    setViewState({
      latitude: lat,
      longitude: lng,
      zoom: 5, // Adjust the zoom level as needed
    });
  };
  console.log(viewState);

  const handleAddClick = (e) => {
    const lng = e.lngLat.lng;
    const lat = e.lngLat.lat;
    setNewPlace({
      lat,
      lng,
    });
  };

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

      setPins([...pins, res.data]);
      console.log(pins);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };
const handleLogout = () =>{
  myStorage.removeItem("user");
  setCurrentUser(null);
}

  return (
    <div>
      <Map
        // initialViewState={{
        //   longitude: -122.4,
        //   latitude: 37.8,
        //   zoom: 14
        // }}
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
                  placeholder="Say us somthing about this place."
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
          <button className="button logout" onClick={handleLogout}>Log out</button>
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
        {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>}
      </Map>
    </div>
  );
}

export default App;
