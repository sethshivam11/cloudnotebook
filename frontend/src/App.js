// import { useState } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import  About from "./components/About";
import Home from "./components/Home";
import NoteState from "./context/NoteState";
import Alert from "./components/Alert";
import Login from "./components/Login"
import Signup from "./components/Signup"
import { useState } from "react";

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  }
  return (
    <>
      <NoteState>
        <Navbar showAlert={showAlert}/>
        <Alert alert={alert}/>
        <div className="container">
          <Routes>
            <Route path="/*" element={<Navigate path="/"/>} />
            <Route element={<Home showAlert={showAlert} /> } exact path="/" />
            <Route element={<About showAlert={showAlert}/>} exact path="/about" />
            <Route element={<Login showAlert={showAlert}/>} exact path="/login" />
            <Route element={<Signup showAlert={showAlert}/>} exact path="/signup" />
          </Routes>
        </div>
      </NoteState>
    </>
  );
}

export default App;
