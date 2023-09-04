import { useRef, useState } from "react";
import "./register.css";
import RoomIcon from "@mui/icons-material/Room";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';

export default function Register({setShowRegister}) {
    const[success, setSuccess] = useState(false);
    const[error, setError] = useState(false);
    const nameRef = useRef  ()
    const emailRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser ={
            username:nameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value,
        }

        try{
            const res = await axios.post("/users/register", newUser);
            setError(false)
            setSuccess(true)
        }catch(err){
            setError(true);
        }
    }
  return (
    <div className="registerContainer">
        <div className="logo">
            <RoomIcon/>
          <h2>MapPin</h2>  
        </div>
        
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="username" ref={nameRef}/>
            <input type="email" placeholder="email" ref={emailRef}/>
            <input type="password" placeholder="password" ref={passwordRef}/>
            <button className="registerBtn">Register</button>
            {success && (
            <span className="success">Successfull.You can login now!</span>
            )} {error &&(
            <span className="failure">Something went wrong!</span>
            )}
        </form>
        <CloseIcon className="registerClose" onClick={()=>setShowRegister(false)}/>
    </div>
  )
}
