import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "./img/favicon.svg";
import user from "./img/user.svg";
import noteContext from "../context/noteContext";

function Navbar(props) {
  useEffect( () => {
    if (localStorage.getItem("token")) {
      async function fetchData() {await getAccount(); console.log(account);}
      fetchData();
      
    } else {
      props.showAlert("Please Login or Signup", "warning");
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);
  let location = useLocation();
  const [credentials, setCredentials] = useState({
    uname: "",
    uemail: "",
    upassword: "",
    udate: ""
  });
  const context = useContext(noteContext);
  const { account, getAccount, updateAccount } = context;
  const navigate = useNavigate();
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const updateCredentials = async () => {
    await setCredentials({
      uname: account.name,
      uemail: account.email,
      upassword: account.password,
      udate: account.date
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = updateAccount({
      name: credentials.uname,
      email: credentials.uemail,
      password: credentials.upassword,
      date: credentials.udate
    });
    if (updated) {
      document.getElementById("closeBtn").click();
      props.showAlert("Details updated successfully", "success");
    } else {
      document.getElementById("closeBtn").click();
      props.showAlert("Internal Server Error!", "danger");
    }
  };
  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
    props.showAlert("Logged Out Successfully.", "success");
  };
  const [login, setLogin] = useState(false);
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <div
            className="modal fade"
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">
                    Your Account
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form className="my-3">
                    <div className="mb-3">
                      <label htmlFor="uname" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="uname"
                        name="uname"
                        onChange={onChange}
                        value={credentials.uname}
                        minLength={2}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="uemail" className="form-label">
                        Email
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="uemail"
                        name="uemail"
                        aria-describedby="emailHelp"
                        value={credentials.uemail}
                        onChange={onChange}
                        minLength={5}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="upassword" className="form-label">
                        Password
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="upassword"
                        name="upassword"
                        onChange={onChange}
                        value={credentials.upassword}
                        minLength={6}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="udate" className="form-label">
                        Created On
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="udate"
                        name="udate"
                        onChange={onChange}
                        value={credentials.udate ? (credentials.udate).slice(0, 24): ""}
                        minLength={6}
                        disabled={true}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    id="closeBtn"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      credentials.uname.length < 2 ||
                      credentials.uemail.length < 4 ||
                      credentials.upassword.length < 6
                    }
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <img src={logo} className="mx-2" alt="" width="40" height="40" />

          <Link className="navbar-brand" to="/">
            Cloud Notebook
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 mx-3 text-center">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/"
                  style={{ paddingRight: "20px" }}
                >
                  🏠 Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link disabled ${
                    location.pathname === "/about" ? "active" : ""
                  }`}
                  to="/about"
                  style={{ paddingRight: "20px" }}
                >
                  ℹ️ About
                </Link>
              </li>
            </ul>
            {!localStorage.getItem("token") ? (
              <form
                className="d-flex"
                role="search"
                style={{ justifyContent: "center" }}
              >
                {login ? (
                  <Link
                    className="btn btn-dark mx-2"
                    to="/login"
                    role="button"
                    onClick={() => {
                      if (location.pathname === "/signup") {
                        setLogin(false);
                      }
                    }}
                  >
                    Login
                  </Link>
                ) : (
                  <Link
                    className="btn btn-dark mx-2"
                    to="/signup"
                    role="button"
                    onClick={(e) => {
                      if (location.pathname === "/login") {
                        setLogin(true);
                      }
                    }}
                  >
                    Sign Up
                  </Link>
                )}
              </form>
            ) : (
              <div className="dropdown text-center">
                <button
                  className="dropdown"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ border: "none", background: "transparent" }}
                >
                  <img src={user} alt="User" />
                </button>
                <ul
                  className="dropdown-menu my-2"
                  style={{ right: "0px", left: "unset" }}
                >
                  <li>
                    <button
                      className="dropdown-item"
                      id="accountBtn"
                      data-bs-toggle="modal"
                      data-bs-target="#staticBackdrop"
                      onClick={updateCredentials}
                    >
                      Account
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      id="logOutBtn"
                      onClick={handleLogOut}
                    >
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
