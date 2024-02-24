import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  const host = "https://cloudnotebook-zp4a.onrender.com";
  const [credentials, setCredentials] = useState({name: "", email: "", phone: "", password: ""});
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${host}/api/auth/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: credentials.name,
          phone: credentials.phone,
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
      props.showAlert("Account Created Successfully.", "success");
    } 
    else{
      props.showAlert(json.error , "danger");
    }
  };
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 my-4">
          <h2 className="my-3">Sign Up to Continue</h2>
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={credentials.name}
            aria-describedby="emailHelp"
            onChange={onChange}
            required={true}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Mobile
          </label>
          <input
            type="phone"
            className="form-control"
            id="phone"
            name="phone"
            value={credentials.phone}
            aria-describedby="emailHelp"
            onChange={onChange}
          />
        </div>
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
            className="btn btn-info"
            type="button"
            id="button-addon2"
            onClick={togglePassword}
            disabled={credentials.password < 1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-warning mx-2"
          id="signupbtn"
          disabled={
            credentials.name.length < 2 ||
            credentials.email.length < 6 ||
            credentials.password.length < 6
          }
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup
