import React from "react";

const Alert = (props) => {
  const capital = (value) => { 
    if(value === "danger"){
      value = "error";
    }
    return value.charAt(0).toUpperCase() + value.slice(1);} 
  return (
    <div
      style={{
        display: "flex",
        position: "fixed",
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
        bottom: "20px",
        zIndex: "2",
      }}
    >
      {props.alert && (
        <div
          className={`toast align-items-center show text-bg-${props.alert.type} border-0`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">
              <strong>{capital(props.alert.type)}</strong>{", "}
              {props.alert.message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alert;
