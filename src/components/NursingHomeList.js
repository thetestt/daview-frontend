import React from "react";
import nursingHomes from "../data/nursingHomes";
import "./NursingHomeList.css";

function NursingHomeList() {
  return (
    <div className="facility-list">
      {nursingHomes.map((home) => (
        <div key={home.id} className="facility-card">
          <h3>{home.name}</h3>
          <p>{home.description}</p>
        </div>
      ))}
    </div>
  );
}

export default NursingHomeList;