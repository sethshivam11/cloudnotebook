import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const host = "https://cloudnotebook-zp4a.onrender.com";
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${host}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      }
    );
    const json = await response.json();
    if (json.success) {
      // Save the auth token and redirect
      localStorage.setItem("token", json.authToken);
      navigate("/");
      props.showAlert("Logged In Successfully.", "success");
    }  else {
      props.showAlert(json.error, "danger");
    }
  };
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    if (showPassword) {
      setShowPassword(false);
    } 
    else{
      setShowPassword(true);
    }
  }
  return (
    <div className="container my-4">
      <h2 className="my-3">Login to Continue</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={credentials.email}
            aria-describedby="emailHelp"
            onChange={onChange}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="input-group mb-3">
          <input
            type={showPassword ? "string" : "password"}
            id="password"
            name="password"
            className="form-control"
            value={credentials.password}
            onChange={onChange}
            aria-label="Recipient's username"
            aria-describedby="button-addon2"
          />
          <button
            className="btn btn-warning"
            type="button"
            id="button-addon2"
            onClick={togglePassword}
            disabled={credentials.password < 1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button type="submit" id="loginbtn" className="btn btn-primary mx-2">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
