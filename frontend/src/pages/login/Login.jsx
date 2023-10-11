import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./login.css";
import { Context } from "../../context/Context";

const Login = () => {
  const userRef = useRef();
  const passRef = useRef();
  const { dispatch, isFetching } = useContext(Context);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation: Check if any of the fields are empty
    if (!username || !password) {
      setErrorMessage("Please fill in all fields.");
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    // Username validation: Check if the username meets the specified criteria
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{5,29}$/;
    if (!username.match(usernameRegex)) {
      setErrorMessage(
        "Username must be 6 to 30 characters long, start with an alphabetic character, and contain only alphanumeric characters and underscores."
      );
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password.match(passwordRegex)) {
      setErrorMessage(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, one special symbol (@, $, !, %, *, ?, &) ."
      );
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", {
        username: userRef.current.value,
        password: passRef.current.value,
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE" });
    }
  };

  return (
    <div className="login">
      <span className="loginTitle">Login</span>
      <form className="loginForm" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          className="loginInput"
          placeholder="Enter your username..."
          ref={userRef}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          className="loginInput"
          placeholder="Enter your password..."
          ref={passRef}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="loginButton" type="submit" disabled={isFetching}>
          Login
        </button>
      </form>
      <button className="loginRegisterButton">
        <Link className="link" to="/register">
          Register
        </Link>
      </button>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default Login;
