import { useRef, useState } from "react";
import "./login.css"; // Import your CSS file
import RoomIcon from "@mui/icons-material/Room";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

// Define the Login component
export default function Login({ setShowLogin, myStorage, setCurrentUser }) {
  // State to manage error display
  const [error, setError] = useState(false);

  // Refs for input fields
  const nameRef = useRef();
  const passwordRef = useRef();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      // Send a POST request to the server for user authentication
      const res = await axios.post("/users/login", user);

      // If authentication is successful, update user data and close the login form
      myStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
      setShowLogin(false);
      setError(false);
    } catch (err) {
      // If there is an error during authentication, set an error flag
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <RoomIcon />
        <h2>MapPin</h2>
      </div>

      {/* Login form */}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="loginBtn">Login</button>

        {/* Display an error message if authentication fails */}
        {error && <span className="failure">Something went wrong!</span>}
      </form>

      {/* Close button */}
      <CloseIcon className="loginClose" onClick={() => setShowLogin(false)} />
    </div>
  );
}
