import { useRef, useState } from "react";
import "./register.css"; // Import your CSS file
import RoomIcon from "@mui/icons-material/Room"; // Import icons
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

export default function Register({ setShowRegister }) {
  // State for success and error messages
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // Refs for input fields
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("/users/register", newUser); // eslint-disable-line no-unused-vars
      setError(false);
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
    
  };

  return (
    <div className="registerContainer">
      {/* Logo */}
      <div className="logo">
        <RoomIcon />
        <h2>MapPin</h2>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="registerBtn">Register</button>

        {/* Success and Error Messages */}
        {success && (
          <span className="success">
            Successfully registered. You can now login!
          </span>
        )}
        {error && <span className="failure">Something went wrong!</span>}
      </form>

      {/* Close Icon */}
      <CloseIcon
        className="registerClose"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}
