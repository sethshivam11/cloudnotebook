import React from "react";
import Notes from "./Notes";

function Home(props) {

  return (
    <div className="container">
      <Notes showAlert={props.showAlert}/>
    </div>
  );
}

export default Home;
